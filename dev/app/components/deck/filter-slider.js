import { useEffect, useState, useRef } from "/cdn/react";
import svgWrap from "../card-template/svg-wrap.js";
import factory, { div } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";
import useToggle from "/Utils/use-toggle.js";
import useLang from "/Utils/use-lang.js";

const cssLoaded = linkAsset("/Components/deck/filter-slider.css")

function filterCardListConfigurationComponent (props){
    const [expanded, toggleExpanded] = useToggle(false)
    const translate = useLang()

    return div(
        { className: `filter-slider gutter-b-1 ${expanded ? "expanded" : ""}` },
        div({ className: "flex no-wrap vcenter" }, 
            div({ className: "grow" }, translate("filter")),
            div({className: "icon clickable animate", onClick: toggleExpanded }, 
                div({ className: expanded ? "minus" : "menu" })
            )
        ),
        div({ className: "options" },
            div("placeholder"),
            div("placeholder"),
            div("placeholder"),
            div("placeholder"),
        )
    )
}

export default factory(filterCardListConfigurationComponent, cssLoaded)