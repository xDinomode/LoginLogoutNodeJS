var gulp = require("gulp");
var jshint = require("gulp-jshint");
var sass = require("gulp-sass");


gulp.task("jshint", function(){
    return gulp.src(["index.js", "routes/**/*.js", "models/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("styles", function(){
    gulp.src("sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./public/stylesheets/"));
});

gulp.task("checkjs", function(){
    gulp.watch(["index.js", "routes/**/*.js", "models/**/*.js"], ["jshint"]);
    gulp.watch("sass/**/*.scss", ["styles"]);
});