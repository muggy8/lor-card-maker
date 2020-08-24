const { src, dest, series, parallel } = require('gulp')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')

let copy = exports.copy = function() {
	return src('src/**/*.*')
		.pipe(dest('docs/'))
}

let minifyJs = exports.minifyJs = function() {
	return src('src/**/*.js')
		.pipe(uglify())
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
	return src('src/**/*.png')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest('docs/'))
}

exports.default = series(
	copy,
	parallel(
		minifyJs,
		minifyCss,
		minifyPng,
		minifyHtml,
	)
)