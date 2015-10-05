var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var passportLocal = require("passport-local").Strategy;
var mongoose = require("mongoose");
var flash = require("connect-flash");
var User = require("./models/User.js");
var bcrypt = require("bcrypt-nodejs");
var app = express();

mongoose.connect("mongodb://localhost/sweg");



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "sdfadfasdf", resave: true, saveUninitialized:true}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use("local-signup", new passportLocal({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, function(req, username, password, done ){
    User.findOne({username: username}, function(err, user){
        if(err) return done(err)

        if(user){
          return done(null, false, req.flash("signupMessage", "Username already taken"));
        } else{
            bcrypt.hash(password, null, null, function(err, hash){
              if(err) console.log(err);
                var newUser = new User({
                    username: username,
                    password: hash
                });
                newUser.save(function(err){
                  if(err) console.log(err);
                  return done(null, newUser);
                });
            });
        }
    });
}));

passport.use("local-login", new passportLocal({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, function(req, username, password, done){
    User.findOne({username: username}, function(err, user){
      if(err) return done(err);

      if(!user){
        return done(null, false, req,flash("login-message", "No user found"));
      } else{
        bcrypt.compare(password, user.password, function(err, check){
          if(check){
            return done(null, user);
          } else{
            return done(null, false, req.flash("login-message", "Try again"));
          }
        });
      }

});
}));

var Router = require("./routes/everything.js")(passport);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/", Router);

app.listen(3000);
