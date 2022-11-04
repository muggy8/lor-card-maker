const { src, dest, series, parallel } = require('gulp')
const gulpTerser = require('gulp-terser')
const terser = require("terser")
const gulpCleanCSS = require('gulp-clean-css')
const CleanCSS = require('clean-css')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const jsonminify = require('gulp-jsonminify')
const replace = require('gulp-async-replace')

const sourceDir = "dev"
const cleanCss = new CleanCSS({})

let copy = exports.copy = function() {
	return src([
		`${sourceDir}/**/*.*`,
		`!${sourceDir}/**/*.md`,
		`!${sourceDir}/**/*.png`,
		`!${sourceDir}/**/*.svg`,
		`!${sourceDir}/**/*.webp`,
	])
	.pipe(dest('docs/'))
}
let copyArt = exports.copyArt = function() {
	return src([
		`${sourceDir}/**/*.png`,
		`${sourceDir}/**/*.svg`,
		`${sourceDir}/**/*.webp`,
	])
	.pipe(dest('docs/'))
}

const jsMinificationConfigs = {
	// drop_console: true,
	module: true,
	// passes: 3,
}

let minifyJs = exports.minifyJs = function() {
	return src(`${sourceDir}/**/*.js`)
		.pipe(gulpTerser(jsMinificationConfigs, terser.minify))
		.pipe(replace(/(\\n)+(\\t)+/gm, " "))
		.pipe(dest('docs/'))
}

let minifyCss = exports.minifyCss = function() {
	return src(`${sourceDir}/**/*.css`)
		.pipe(gulpCleanCSS())
		.pipe(dest('docs/'))
}

let minifyPng = exports.minifyPng = function() {
	return src(`${sourceDir}/**/*.png`)
		.pipe(imagemin())
		.pipe(dest('docs/'))
}

let minifyHtml = exports.minifyHtml = function() {
	return src(`${sourceDir}/**/*.html`)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(replace(/<style[^>]*>(.+?)<\/style>/gs, function(match, cssCode){
			const cleanedCss = cleanCss.minify(cssCode)
			return match.replace(cssCode, cleanedCss.styles)
		}))
		.pipe(replace(/<script[^>]*>(.+?)<\/script>/gs, async function(match, jsCode){
			return match

			const minifiedJs = await terser.minify(jsCode)
			return match.replace(jsCode, minifiedJs.code)

		}))
		.pipe(dest('docs/'))
}

let minifyJson = exports.minifyJson = function(){
	return src([
			`${sourceDir}/**/*.json`,
			`${sourceDir}/**/*.webmanifest`,
		])
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
		minifyHtml,
		minifyJson,
	),
	// pathReplace,
)

exports.art = series(
	copyArt,
	minifyPng,
)