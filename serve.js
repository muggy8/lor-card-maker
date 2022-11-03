const express = require('express')
const app = express()
const port = 1337

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const open = require('open')

const fs = require('fs').promises

const proxymityScriptRegex = /<script\ssrc\s?=\s?['"][^"']+proxymity.+$/m
const cdnJsRegex = /https\:\/\/cdn\.jsdelivr\.net\/npm\/([^\@]+)\@[^\/]+/gm
const cdnGitRegex = /https\:\/\/cdn\.jsdelivr\.net\/gh\/[^\/]+\/([^\@]+)\@[^\/]+/gm

const appDir = "."

if (argv.proxymity){
	app.get("/", async function(req, res, next){
		let indexPage = await fs.readFile(appDir + "/index.html", "utf-8")
		indexPage = indexPage.replace(proxymityScriptRegex, `
			<script src="src/proxymity-util.js"></script>
			<script src="src/on-next-event-cycle.js"></script>
			<script src="src/proxymity-watch-2.js"></script>
			<script src="src/proxymity-ui.js"></script>
			<script src="src/proxymity.dev.js"></script>
			<script>
			// gonna stub this in here
			var safeEval = function(s, sv = {}, t = false){
				try {
					with(sv){
						return eval(s)
					}
				}
				catch(o3o){
					if (!t){
						console.error("failed to evaluate expression [" + s + "]", this, o3o)
						return ""
					}
					else {
						throw o3o
					}
				}
			}
			</script>
		`)

		indexPage = indexPage.replace(cdnJsRegex, function(match, packageName){
			return `/node_modules/${packageName}`
		})
		indexPage = indexPage.replace(cdnGitRegex, function(match, packageName){
			return `/node_modules/${packageName}`
		})
		res.send(indexPage)
	})

	app.use(express.static(argv.proxymity))
}
else{
	app.get("/", async function(req, res, next){
		let indexPage = await fs.readFile(appDir + "/index.html", "utf-8")

		indexPage = indexPage.replace(cdnJsRegex, function(match, packageName){
			return `/node_modules/${packageName}`
		})

		indexPage = indexPage.replace(cdnGitRegex, function(match, packageName){
			return `/node_modules/${packageName}`
		})
		res.send(indexPage)
	})
}
app.use("/node_modules", express.static("node_modules"))
app.use(express.static(appDir))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/`)

//   open(`http://localhost:${port}/`)
})
