/* */ 
var gulp = require('gulp');
var replace = require('gulp-replace');
gulp.task('meteor', function() {
  var pkg = require('./package.json!systemjs-json');
  var versionRegex = /(version\:\s*\')([^\']+)\'/gi;
  return gulp.src('package.js').pipe(replace(versionRegex, '$1' + pkg.version + "'")).pipe(gulp.dest('./'));
});
