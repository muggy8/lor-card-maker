const { src, dest, series, parallel } = require('gulp')
// const uglify = require('gulp-uglify')
const terser = require('gulp-terser')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const jsonminify = require('gulp-jsonminify');
const replace = require('gulp-replace')

let copy = exports.copy = function() {
	return src(['src/**/*.*', '!src/**/*.md'])
		.pipe(dest('docs/'))
}

let minifyJs = exports.minifyJs = function() {
	return src('src/**/*.js')
		.pipe(terser())
		.pipe(replace(/(\\n)+(\\t)+/gm, " "))
		.pipe(dest('docs/'))
}

let minifyCss = exports.minifyCss = function() {
	return src('src/**/*.css')
		.pipe(cleanCSS())
		.pipe(dest('docs/'))
}

let minifyPng = exports.minifyPng = function() {
	return src('src/**/*.png')
		.pipe(imagemin())
		.pipe(dest('docs/'))
}

let minifyHtml = exports.minifyHtml = function() {
	return src('src/**/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest('docs/'))
}

let minifyJson = exports.minifyJson = function(){
	return src('src/**/*.json')
		.pipe(jsonminify())
		.pipe(dest('docs/'))
}

let pathReplace = exports.pathReplace = function(){
	return src('docs/**/*.*')
		.pipe(replace(/([^\.])\/assets\//g, '$1./assets/'))
		.pipe(dest('docs/'))
}

exports.default = series(
	copy,
	parallel(
		minifyJs,
		minifyCss,
		minifyPng,
		minifyHtml,
		minifyJson,
	),
	pathReplace,
)
