import factory, { div, strong, img, button, } from "/Utils/elements.js";
import useToggle from "/Utils/use-toggle.js";
import useLang from "/Utils/use-lang.js";
import linkAsset from "/Utils/load-css.js";

const cssLoaded = linkAsset("/Components/deck/custom-cards-filters-ui.css")

function customCardsFiltersComponent(props){
    const [expanded, toggleExpanded] = useToggle(false)
    const translate = useLang()

    div(
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

                button(
                    { 
                        onClick: ()=>{
                            props.updateSelectedFilters({
                                name: { value: undefined },
                                descriptionRaw: { value: undefined },
                                subtypes: { value: undefined },
                                rarity: { value: undefined },
                                cost: { value: undefined },
                                type: { value: undefined },
                                health: { value: undefined },
                                attack: { value: undefined },
                                spellSpeed: { value: undefined },
                                keywords: { value: undefined },
                            })
                        },
                        className: "gutter-trbl-.5 grow",
                    }, 
                    translate("clear_filters"),
                )
            )
        )
    )
}

export default factory(customCardsFiltersComponent, cssLoaded)