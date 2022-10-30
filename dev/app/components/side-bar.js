import factory, { div, span } from "/Utils/elements.js"
import { useCallback, useEffect, useState } from "/cdn/react" 
import loadCss from "/Utils/load-css.js"

const cssLoaded = loadCss("/Components/side-bar.css")

function SidebarComponent(props){
    const [opened, updateOpened] = useState(false)
    const toggleOpened = useCallback(()=>{
        updateOpened(!opened)
    }, [opened])

    return div(
        { className: "side-bar " + (opened ? "open" : "") },
        div(
            {
                className: "menu-icon flex vhcenter",
                onClick: toggleOpened
            },
            div({className: "icon animate" }, 
                span({ className: opened ? "delete" : "menu" })
            ),
        )
    )

}

export default factory(SidebarComponent, cssLoaded)