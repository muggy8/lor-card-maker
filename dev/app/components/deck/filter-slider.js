import { useEffect, useState, useRef } from "/cdn/react";
import svgWrap from "../card-template/svg-wrap.js";
import factory, { div, strong } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";
import useToggle from "/Utils/use-toggle.js";
import useLang from "/Utils/use-lang.js";
import searchText from "/Components/deck/search-text.js";

const cssLoaded = linkAsset("/Components/deck/filter-slider.css")

function filterCardListConfigurationComponent (props){
    const [expanded, toggleExpanded] = useToggle(false)
    const translate = useLang()

    return div(
        { className: `filter-slider gutter-b-1 ${expanded ? "expanded" : ""}` },
        div({ className: "flex no-wrap vcenter" }, 
            div({ className: "grow clickable", onClick: toggleExpanded }, 
                strong(translate("filter"))
            ),
            div({className: "icon clickable animate", onClick: toggleExpanded }, 
                div({ className: expanded ? "minus" : "menu" })
            ),
        ),
        div({ className: "options" },
            div({ className: "gutter-rbl-.5" },
                searchText({
                    label: translate("name"),
                    value: props.selectedFilters.name? props.selectedFilters.name.include : "",
                    onChange: value=>props.updateSelectedFilter("name", { include: value })
                }),
                
                searchText({
                    label: translate("card_text"),
                    value: props.selectedFilters.descriptionRaw? props.selectedFilters.descriptionRaw.include : "",
                    onChange: value=>props.updateSelectedFilter("descriptionRaw", { include: value })
                }),
            )
        )
    )
}

export default factory(filterCardListConfigurationComponent, cssLoaded)