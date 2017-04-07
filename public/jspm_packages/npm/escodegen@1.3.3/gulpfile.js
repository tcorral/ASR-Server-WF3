/* */ 
(function(process) {
  'use strict';
  var gulp = require('gulp');
  var mocha = require('gulp-mocha');
  var jshint = require('gulp-jshint');
  var eslint = require('gulp-eslint');
  var TEST = ['test/*.js'];
  var LINT = ['gulpfile.js', 'escodegen.js'];
  var ESLINT_OPTION = {
    'rulesdir': 'tools/rules/',
    'rules': {
      'push-with-multiple-arguments': 2,
      'quotes': 0,
      'eqeqeq': 0,
      'no-use-before-define': 0,
      'no-shadow': 0
    },
    'env': {'node': true}
  };
  gulp.task('test', function() {
    return gulp.src(TEST).pipe(mocha({reporter: 'spec'}));
  });
  gulp.task('lint', function() {
    return gulp.src(LINT).pipe(jshint('.jshintrc')).pipe(jshint.reporter(require('jshint-stylish'))).pipe(jshint.reporter('fail')).pipe(eslint(ESLINT_OPTION)).pipe(eslint.formatEach('compact', process.stderr));
  });
  gulp.task('travis', ['lint', 'test']);
  gulp.task('default', ['travis']);
})(require('process'));
