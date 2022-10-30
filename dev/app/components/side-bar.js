import factory, { div, span } from "/Utils/elements.js"
import { useCallback, useEffect, useState } from "/cdn/react" 
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"


const cssLoaded = loadCss("/Components/side-bar.css")

function SidebarComponent(){
    const translate = useLang()

    const [opened, updateOpened] = useState(false)
    const toggleOpened = useCallback(()=>{
        updateOpened(!opened)
    }, [opened])

    return div(
        { className: `side-bar card-text-universe gutter-rl-3 flex column vhcenter ${opened ? "open" : ""}` },
        div(
            {
                className: "menu-icon flex vhcenter",
                onClick: toggleOpened
            },
            div({className: "icon animate clickable" }, 
                span({ className: opened ? "delete" : "menu" })
            ),
        ),
        div(
            { className: "menu-option clickable gutter-tb" },
            translate("batch_export")
        ),
        div(
            { className: "menu-option clickable gutter-tb" },
            translate("export_save")
        ),
        div(
            { className: "menu-option clickable gutter-tb" },
            translate("import_save")
        ),
        div(
            { className: "menu-option clickable gutter-tb" },
            translate("report_bug")
        ),
    )

}

export default factory(SidebarComponent, cssLoaded)