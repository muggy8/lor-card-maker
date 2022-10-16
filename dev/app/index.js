import * as ReactDOM from "/cdn/react-dom"
import {createRoot} from "/cdn/react-dom/client"
import React from "/cdn/react"
import App from "/Views/index.js"
import loadCss from "/Utils/load-css.js"

loadCss("/cdn/flex-box/flex-box.min.css")
loadCss("/cdn/flex-box/flex-box.gutters.min.css")
loadCss("/App/main.css")

const root = createRoot(document.getElementById("app"))
root.render(App())

document.body.classList.remove("loading")
