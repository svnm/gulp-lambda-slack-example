var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var install = require('gulp-install');
var runSequence = require('run-sequence');
var awsLambda = require("node-aws-lambda");
var Slack = require('gulp-slack');
var childProcess = require('child_process');

const SLACK_WEBHOOK_URL = <slack webhook url>

const rev = {
  branch: childProcess.execSync('git name-rev --name-only HEAD').toString().trim(),
  commit: childProcess.execSync('git rev-parse HEAD').toString().trim(),
  commitShort: childProcess.execSync('git rev-parse --short HEAD').toString().trim(),
  user: childProcess.execSync('git config user.name').toString().trim().split(' ')[0]
}

const slack = Slack({
  url: SLACK_WEBHOOK_URL,
  icon_emoji: ':george:',
  user: 'gulp-lambda-slack-example'
});

gulp.task('clean', function() {
  return del(['./dist', './dist.zip']);
});

gulp.task('js', function() {
  return gulp.src('src/index.js')
    .pipe(gulp.dest('dist/'));
});

gulp.task('node-mods', function() {
  return gulp.src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({production: true}));
});

gulp.task('zip', function() {
  return gulp.src(['dist/**/*', '!dist/package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('upload', function(callback) {
  awsLambda.deploy('./dist.zip', require("./lambda.js"), callback);
});

gulp.task('notify', function() {
  const branchUrl = `https://github.com/StevenIseki/gulp-lambda-slack-example/commits/${rev.branch}`;
  const commitUrl = `https://github.com/StevenIseki/gulp-lambda-slack-example/commit/${rev.commit}`;
  const notificationText = `${rev.user} deployed branch <${branchUrl}|${rev.branch}> (<${commitUrl}|${rev.commitShort}>).`;
  var notification = {
    fallback: notificationText,
    pretext: notificationText,
    color: 'good'
  }
  slack([notification])
});

gulp.task('deploy', function(callback) {
  return runSequence(
    ['clean'],
    ['js', 'node-mods'],
    ['zip'],
    ['upload'],
    callback
  );
});
