import * as ReactDOM from "/cdn/react-dom"
import {createRoot} from "/cdn/react-dom/client"
import React from "/cdn/react"
import App from "/Views/index.js"

const root = createRoot(document.getElementById('app'))
root.render(App())

document.body.classList.remove("loading")
