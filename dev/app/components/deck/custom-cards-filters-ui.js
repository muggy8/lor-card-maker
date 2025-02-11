import { useEffect, useContext, useRef } from "/cdn/react"
import factory, { div, strong, img, button, } from "/Utils/elements.js";
import { Globals } from "/Views/index.js"
import useToggle from "/Utils/use-toggle.js";
import useLang from "/Utils/use-lang.js";
import searchText from "/Components/deck/search-text.js";
import checkbox from "/Components/deck/checkbox.js";
import rangeSlider from "/Components/deck/range-slider.js";
import { KeywordImageCheck } from "/Components/card-config/edit-keywords.js";
import linkAsset from "/Utils/load-css.js";

// const cssLoaded = linkAsset("/Components/deck/custom-cards-filters-ui.css")

function customCardsFiltersComponent(props){
    const translate = useLang()
	const globalState = useContext(Globals)
    const lowSpecsMode = globalState.state.settings.lowSpecsMode === true
	const globalStateRef = useRef()
	globalStateRef.current = globalState

    const expandedState = useRef()
    const [expanded, toggleExpanded] = expandedState.current = useToggle(false)

    useEffect(()=>{
        const checkAllowGoBackAtStartup = globalState.getAllowBack()
		globalStateRef.current.setAllowBack(checkAllowGoBack)

		return function(){
            if (globalStateRef.current.getAllowBack() !== checkAllowGoBack){
                return 
                // this component isn't a top level component so there's no gaurentee of our release callbacks being called in order 
                // so we just chill if the allow back has already been changed to something else during view unload and when a user
                // initiated sub view change happenes, we can handle the allow go back callback management function.
            }
			globalStateRef.current.setAllowBack(checkAllowGoBackAtStartup)
		}

		function checkAllowGoBack(){
            const [expanded, toggleExpanded] = expandedState.current
			if (expanded){
				toggleExpanded(false)
				return false
			}
			else{
				return checkAllowGoBackAtStartup()
			}
		}
    }, [])

    return div(
        { className: `filter-slider gutter-b-1 ${expanded ? "expanded" : ""}` },
        div({ className: "flex no-wrap vcenter" }, 
            div({ className: "grow clickable gutter-rl-.5", onClick: toggleExpanded }, 
                strong(translate("filter"))
            ),
            div({
                className: `icon clickable ${lowSpecsMode ? "" : "animated"} ${expanded ? "minus" : "menu"}`, 
                onClick: toggleExpanded 
            }),
        ),

        div({ className: "options" },
            div({ className: "gutter-rbl-.5" },

                div(
                    { className: "flex gutter-b" },
                    button(
                        { 
                            onClick: ()=>{
                                props.updateSelectedFilters({
                                    name: { value: undefined },
                                    effect: { value: undefined },
                                    lvup: { value: undefined },
                                    clan: { value: undefined },
                                    keywords: { value: undefined },
                                    rarity: { value: undefined },
                                    type: { value: undefined },
                                    faction: { value: undefined },
                                    speed: { value: undefined },
                                    mana: { value: undefined },
                                    power: { value: undefined },
                                    health: { value: undefined },
                                })
                            },
                            className: "gutter-trbl-.5 grow",
                        }, 
                        translate("clear_filters"),
                    )
                ),
                
                props.filterOptions.name && props.filterOptions.name.length
                    ? searchText({
                        label: translate("name"),
                        value: props.selectedFilters.name? props.selectedFilters.name.value : "",
                        onChange: value=>props.updateSelectedFilter("name", { value })
                    })
                    : undefined 
                ,
                
                props.filterOptions.effect && props.filterOptions.effect.length
                    ? searchText({
                        label: translate("card_text"),
                        value: props.selectedFilters.effect? props.selectedFilters.effect.value : "",
                        onChange: value=>props.updateSelectedFilter("effect", { value })
                    })
                    : undefined
                ,
                
                props.filterOptions.lvup && props.filterOptions.lvup.length
                    ? searchText({
                        label: translate("lv_up_cond"),
                        value: props.selectedFilters.lvup? props.selectedFilters.lvup.value : "",
                        onChange: value=>props.updateSelectedFilter("lvup", { value })
                    })
                    : undefined
                ,
                
                props.filterOptions.clan && props.filterOptions.clan.length
                    ? searchText({
                        label: translate("clan"),
                        value: props.selectedFilters.clan? props.selectedFilters.clan.value : "",
                        onChange: value=>props.updateSelectedFilter("clan", { value })
                    })
                    : undefined
                ,

                props.filterOptions.faction && props.filterOptions.faction.length
                    ? checkbox({
                        label: translate("region"),
                        value: props.selectedFilters.faction && props.selectedFilters.faction.value || [],
                        onChange: selected=>{
                            props.updateSelectedFilter("faction", { value: selected })
                        },
                        options: props.filterOptions.faction,
                        renderOption: (faction, isChecked)=>{
                            if (!faction || faction.toLowerCase() === "none"){
                                return null
                            }
                            return div(
                                { className: (isChecked ? "" : "ghost ") + "icon-checkbox flex vhcenter clickable gutter-trbl-.5" },
                                img({
                                    src: `/Assets/region/${faction.toLowerCase()}.png`
                                })
                            )
                        }
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
                            if (!rarity || rarity.toLowerCase() === "none"){
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

                props.filterOptions.mana && props.filterOptions.mana.length
                    ? rangeSlider({
                        label: translate("mana_cost"),
                        range: props.filterOptions.mana,
                        value: props.selectedFilters.mana && props.selectedFilters.mana.value,
                        onChange: value=>props.updateSelectedFilter("mana", { value })
                    })
                    : undefined
                ,

                props.filterOptions.type && props.filterOptions.type.length
                    ? checkbox({
                        label: translate("card_type"),
                        value: props.selectedFilters.type && props.selectedFilters.type.value || [],
                        onChange: selected=>{
                            props.updateSelectedFilter("type", { value: selected })
                            if ( 
                                !selected.some(type=>type.toLowerCase() === "champion") ||
                                !selected.some(type=>type.toLowerCase() === "follower") ||
                                !selected.some(type=>type.toLowerCase() === "spell") 
                            ){
                                props.updateSelectedFilter("health", { value: undefined })
                                props.updateSelectedFilter("power", { value: undefined })
                            }
                            if (!selected.some(type=>type.toLowerCase() === "spell")){
                                props.updateSelectedFilter("speed", { value: undefined })
                            }
                        },
                        options: props.filterOptions.type,
                        renderOption: (type, isChecked)=>div(
                            { className: "icon-checkbox flex vhcenter clickable gutter-trbl-.5 capitalize" },
                            KeywordImageCheck({
                                isChecked,
                                keywordName: type.toLowerCase()
                            })
                        )
                    })
                    : undefined
                ,

                props.filterOptions.speed && props.filterOptions.speed.length && 
                    Array.prototype.some.call(
                        ( props.selectedFilters.type||{} ).value || [], 
                        type=>type.toLowerCase() === "spell"
                    )
                        ? checkbox({
                            label: translate("speed"),
                            value: props.selectedFilters.speed && props.selectedFilters.speed.value || [],
                            onChange: selected=>{
                                props.updateSelectedFilter("speed", { value: selected })
                            },
                            options: props.filterOptions.speed,
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

                props.filterOptions.power && props.filterOptions.power.length && 
                    Array.prototype.some.call(
                        ( props.selectedFilters.type||{} ).value || [], 
                        type=>type.toLowerCase() === "champion" || 
                            type.toLowerCase() === "follower" || 
                            type.toLowerCase() === "spell" 
                    )
                        ? rangeSlider({
                            label: translate("power"),
                            range: props.filterOptions.power,
                            value: props.selectedFilters.power && props.selectedFilters.power.value,
                            onChange: value=>props.updateSelectedFilter("power", { value }),
                        })
                        : undefined
                ,

                props.filterOptions.health && props.filterOptions.health.length && 
                    Array.prototype.some.call(
                        ( props.selectedFilters.type||{} ).value || [], 
                        type=>type.toLowerCase() === "champion" || 
                            type.toLowerCase() === "follower" || 
                            type.toLowerCase() === "spell" 
                    )
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
                        optionKey: value=>{
                            return value.id || value
                        },
                        renderOption: (keyword, isChecked)=>div(
                            { className: "icon-checkbox flex vhcenter clickable gutter-trbl-.5" },
                            keyword.toLowerCase 
                                ? KeywordImageCheck({
                                    isChecked,
                                    keywordName:  keyword.toLowerCase(),
                                })
                                : KeywordImageCheck({
                                    isChecked,
                                    keywordName:  keyword.name,
                                    icons: keyword.icons,
                                })
                            ,
                        )
                    })
                    : undefined
                ,

            )
        )
    )
}

export default factory(customCardsFiltersComponent)