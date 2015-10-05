var express = require("express");
var Router = express.Router();
var bcrypt = require("bcrypt-nodejs");

var message = null;
var User = require("../models/User.js");

module.exports = function(passport){
    Router.get("/", function(req, res){
    if(req.isAuthenticated()) res.redirect("/admin");
    res.render("index", {message: req.flash("loginMessage")});
});

Router.get("/signup", function(req, res){
    if(req.isAuthenticated()) res.redirect("/admin");
    res.render("signup", {message: req.flash("signupMessage")});
});
Router.post("/signup", passport.authenticate("local-signup", {
    successRedirect:"/admin",
    failureRedirect:"/signup",
    failureFlash:true
}));


Router.post("/login", passport.authenticate("local-login", {
    successRedirect: "/admin",
    failureRedirect:"/",
    failureFlash:true
}));
Router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

Router.get("/admin", isLoggedIn, function(req, res){
    res.render("admin", {user: req.user });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();

    res.redirect("/");
}

return Router;
};