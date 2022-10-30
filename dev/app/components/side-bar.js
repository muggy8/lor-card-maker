import factory, { div, span, label, a } from "/Utils/elements.js"
import { useCallback, useEffect, useState, useRef } from "/cdn/react" 
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"


const cssLoaded = loadCss("/Components/side-bar.css")

function SidebarComponent(){
    const translate = useLang()

    const [opened, updateOpened] = useState(false)
    const toggleOpened = useCallback(()=>{
        updateOpened(!opened)
    }, [opened])

    const bugReportlink = useRef()

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
        label(
            { className: "menu-option clickable gutter-tb", onClick: ()=>bugReportlink.current.click() },
            translate("report_bug"),
            a({
                ref: bugReportlink,
                href: "https://github.com/muggy8/lor-card-maker/issues",
                className: "hide",
                target: "_blank"
            })
        ),
    )

}

export default factory(SidebarComponent, cssLoaded)