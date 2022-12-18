import { useEffect, useState, useRef } from "/cdn/react";
import svgWrap from "../card-template/svg-wrap.js";
import factory, { div, strong } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";
import useToggle from "/Utils/use-toggle.js";
import useLang from "/Utils/use-lang.js";
import searchText from "/Components/deck/search-text.js";
import checkbox from "./checkbox.js";
import { KeywordImageCheck } from "../card-config/edit-keywords.js";

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
                
                checkbox({
                    label: translate("collectible"),
                    value: props.selectedFilters.collectible && props.selectedFilters.collectible.value,
                    onChange: selected=>{
                        props.updateSelectedFilter("collectible", { value: selected })
                    },
                    options: props.filterOptions.collectible,
                    renderOption: (collectable)=>div(
                        { className: "flex vhcenter clickable gutter-trbl-.5" },
                        collectable ? "✔ " + translate("yes") : "✘ " + translate("no")
                    )
                }),

                searchText({
                    label: translate("name"),
                    value: props.selectedFilters.name? props.selectedFilters.name.value : "",
                    onChange: value=>props.updateSelectedFilter("name", { value })
                }),
                
                searchText({
                    label: translate("card_text"),
                    value: props.selectedFilters.descriptionRaw? props.selectedFilters.descriptionRaw.value : "",
                    onChange: value=>props.updateSelectedFilter("descriptionRaw", { value })
                }),
                
                searchText({
                    label: translate("clan"),
                    value: props.selectedFilters.subtypes? props.selectedFilters.subtypes.value : "",
                    onChange: value=>props.updateSelectedFilter("subtypes", { value })
                }),

                checkbox({
                    label: translate("card_type"),
                    value: props.selectedFilters.type && props.selectedFilters.type.value || [],
                    onChange: selected=>{
                        props.updateSelectedFilter("type", { value: selected })
                    },
                    options: props.filterOptions.type,
                    renderOption: (type)=>div(
                        { className: "flex vhcenter clickable gutter-trbl-.5" },
                        type
                    )
                }),

                checkbox({
                    label: translate("keyword"),
                    value: props.selectedFilters.keywords && props.selectedFilters.keywords.value || [],
                    onChange: selected=>{
                        props.updateSelectedFilter("keywords", { value: selected })
                    },
                    options: props.filterOptions.keywords,
                    renderOption: (keyword, isChecked)=>div(
                        { className: "flex vhcenter clickable gutter-trbl-.5" },
                        KeywordImageCheck({
                            isChecked,
                            keywordName: keyword.toLowerCase(),
                        })
                    )
                }),
            )
        )
    )
}

export default factory(filterCardListConfigurationComponent, cssLoaded)