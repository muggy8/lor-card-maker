import loadCss from "/Utils/load-css.js"

export default loadCss("/App/under-ride.css")
    .then(()=>{
        return Promise.all([
            import("/cdn/react-dom/client"),
            import("/Views/index.js"),
            loadCss("/cdn/css-icons/icons.min.css"),
            loadCss("/cdn/flex-box/flex-box.min.css"),
            loadCss("/cdn/flex-box/flex-box.gutters.min.css"),
            loadCss("/App/main.css"),
        ])
    }).then(([ReactDOM, App])=>{
        const rootElement = document.getElementById("app")
        const root = ReactDOM.createRoot(rootElement)
        root.render(App.default({root: rootElement}))
        
        document.body.classList.remove("loading")
    })