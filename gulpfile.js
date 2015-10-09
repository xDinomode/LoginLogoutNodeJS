var gulp = require("gulp");
var jshint = require("gulp-jshint");

gulp.task("jshint", function(){
    return gulp.src(["index.js", "routes/**/*.js", "models/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("checkjs", function(){
    gulp.watch(["index.js", "routes/**/*.js", "models/**/*.js"], ["jshint"]);
});