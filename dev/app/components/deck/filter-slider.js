import { useEffect, useState, useRef } from "/cdn/react";
import factory, { div, strong, img, button, } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";
import useToggle from "/Utils/use-toggle.js";
import useLang from "/Utils/use-lang.js";
import searchText from "/Components/deck/search-text.js";
import checkbox from "./checkbox.js";
import rangeSlider from "./range-slider.js";
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

                div(
                    { className: "flex gutter-b" },
                    button(
                        { 
                            onClick: props.refreshRitoData,
                            className: "gutter-trbl-.5 grow",
                        }, 
                        props.refreshRitoLoading 
                            ? div({ className: "icon" }, 
                                div({ className: "loading" })
                            )
                            : translate("refresh_rito_data")
                        ,
                    )
                ), 
                
                props.filterOptions.collectible && props.filterOptions.collectible.length
                    ? checkbox({
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
                    }) 
                    : undefined
                ,

                props.filterOptions.name && props.filterOptions.name.length
                    ? searchText({
                        label: translate("name"),
                        value: props.selectedFilters.name? props.selectedFilters.name.value : "",
                        onChange: value=>props.updateSelectedFilter("name", { value })
                    })
                    : undefined 
                ,
                
                props.filterOptions.descriptionRaw && props.filterOptions.descriptionRaw.length
                    ? searchText({
                        label: translate("card_text"),
                        value: props.selectedFilters.descriptionRaw? props.selectedFilters.descriptionRaw.value : "",
                        onChange: value=>props.updateSelectedFilter("descriptionRaw", { value })
                    })
                    : undefined
                ,
                
                props.filterOptions.subtypes && props.filterOptions.subtypes.length
                    ? searchText({
                        label: translate("clan"),
                        value: props.selectedFilters.subtypes? props.selectedFilters.subtypes.value : "",
                        onChange: value=>props.updateSelectedFilter("subtypes", { value })
                    })
                    : undefined
                ,

                props.filterOptions.rarity && props.filterOptions.rarity.length
                    ? checkbox({
                        label: translate("rarity"),
                        value: props.selectedFilters.rarity && props.selectedFilters.rarity.value || [],
                        onChange: selected=>{
                            props.updateSelectedFilter("rarity", { value: selected })
                        },
                        options: props.filterOptions.rarity,
                        renderOption: (rarity, isChecked)=>{
                            if (rarity.toLowerCase() === "none"){
                                return null
                            }
                            return div(
                                { className: (isChecked ? "" : "ghost ") + "icon-checkbox flex vhcenter clickable gutter-trbl-.5" },
                                img({
                                    src: `/Assets/shared/${rarity.toLowerCase()}.png`
                                })
                            )
                        }
                    })
                    : undefined
                ,

                props.filterOptions.cost && props.filterOptions.cost.length
                    ? rangeSlider({
                        label: translate("mana_cost"),
                        range: props.filterOptions.cost,
                        value: props.selectedFilters.cost && props.selectedFilters.cost.value,
                        onChange: value=>props.updateSelectedFilter("cost", { value })
                    })
                    : undefined
                ,

                props.filterOptions.type && props.filterOptions.type.length
                    ? checkbox({
                        label: translate("card_type"),
                        value: props.selectedFilters.type && props.selectedFilters.type.value || [],
                        onChange: selected=>{
                            props.updateSelectedFilter("type", { value: selected })
                            if (!selected.some(type=>type.toLowerCase() === "unit")){
                                props.updateSelectedFilter("health", { value: undefined })
                                props.updateSelectedFilter("attack", { value: undefined })
                            }
                        },
                        options: props.filterOptions.type,
                        renderOption: (type)=>div(
                            { className: "flex vhcenter clickable gutter-trbl-.5" },
                            type
                        )
                    })
                    : undefined
                ,

                props.filterOptions.spellSpeed && props.filterOptions.spellSpeed.length && Array.prototype.some.call((props.selectedFilters.type || {}).value || [], type=>type.toLowerCase() === "spell")
                    ? checkbox({
                        label: translate("speed"),
                        value: props.selectedFilters.spellSpeed && props.selectedFilters.spellSpeed.value || [],
                        onChange: selected=>{
                            props.updateSelectedFilter("spellSpeed", { value: selected })
                        },
                        options: props.filterOptions.spellSpeed,
                        renderOption: (speed, isChecked)=>
                            speed 
                                ? div(
                                    { className: "icon-checkbox flex vhcenter clickable gutter-trbl-.5" },
                                    KeywordImageCheck({
                                        isChecked,
                                        keywordName: speed.toLowerCase(),
                                    })
                                ) : undefined
                        ,
                    })
                    : undefined
                ,

                props.filterOptions.attack && props.filterOptions.attack.length && Array.prototype.some.call((props.selectedFilters.type || {}).value || [], type=>type.toLowerCase() === "unit")
                    ? rangeSlider({
                        label: translate("power"),
                        range: props.filterOptions.attack,
                        value: props.selectedFilters.attack && props.selectedFilters.attack.value,
                        onChange: value=>props.updateSelectedFilter("attack", { value }),
                    })
                    : undefined
                ,

                props.filterOptions.health && props.filterOptions.health.length && Array.prototype.some.call((props.selectedFilters.type || {}).value || [], type=>type.toLowerCase() === "unit")
                    ? rangeSlider({
                        label: translate("health"),
                        range: props.filterOptions.health,
                        value: props.selectedFilters.health && props.selectedFilters.health.value,
                        onChange: value=>props.updateSelectedFilter("health", { value })
                    })
                    : undefined
                ,

                props.filterOptions.keywords && props.filterOptions.keywords.length
                    ? checkbox({
                        label: translate("keyword"),
                        value: props.selectedFilters.keywords && props.selectedFilters.keywords.value || [],
                        onChange: selected=>{
                            props.updateSelectedFilter("keywords", { value: selected })
                        },
                        options: props.filterOptions.keywords,
                        renderOption: (keyword, isChecked)=>div(
                            { className: "icon-checkbox flex vhcenter clickable gutter-trbl-.5" },
                            KeywordImageCheck({
                                isChecked,
                                keywordName: keyword.toLowerCase(),
                            })
                        )
                    })
                    : undefined
                ,
            )
        )
    )
}

export default factory(filterCardListConfigurationComponent, cssLoaded)