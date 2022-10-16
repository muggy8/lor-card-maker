import * as ReactDOM from "/cdn/react-dom"
import {createRoot} from "/cdn/react-dom/client"
import React from "/cdn/react"
import App from "/Views/index.js"
import loadCss from "/Utils/load-css.js"

loadCss("https://cdn.jsdelivr.net/gh/muggy8/flex-box@f1c7d23fad7ece8fc7538b152ac393a29b65669b/flex-box.min.css")
loadCss("https://cdn.jsdelivr.net/gh/muggy8/flex-box@f1c7d23fad7ece8fc7538b152ac393a29b65669b/flex-box.gutters.min.css")
loadCss("/App/main.css")

const root = createRoot(document.getElementById('app'))
root.render(App())

document.body.classList.remove("loading")
