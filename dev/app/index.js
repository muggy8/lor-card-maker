import {createRoot} from "/cdn/react-dom/client"
import App from "/Views/index.js"
import loadCss from "/Utils/load-css.js"

Promise.all([
    loadCss("/cdn/flex-box/flex-box.min.css"),
    loadCss("/cdn/flex-box/flex-box.gutters.min.css"),
    loadCss("/cdn/mmc-3/app/css/icons.css"),
    loadCss("/App/main.css"),
]).then(()=>{
    const rootElement = document.getElementById("app")
    const root = createRoot(rootElement)
    root.render(App({root: rootElement}))
    
    document.body.classList.remove("loading")    
})