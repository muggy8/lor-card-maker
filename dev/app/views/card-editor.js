import { div, button } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { useState, useCallback } from "/cdn/react" 

import EditName from "/Components/card-config/edit-name.js"
import EditNumber from "/Components/card-config/edit-number.js"
import EditRegion from "/Components/card-config/edit-region.js"
import EditRarity from "/Components/card-config/edit-rarity.js"
import EditKeywords from "/Components/card-config/edit-keywords.js"

loadCss("/Views/card-editor.css")

function canShow(ifKeyExists, inThisObject){
    return Object.hasOwnProperty.call(inThisObject, ifKeyExists)
}

export default function EditorViewFactory(cardRenderer, defaultCardData){
    return function EditorView(props){
        const translate = useLang()

        const [card, updateCard] = useState(defaultCardData)
        
        const knownCardDataKeys = Object.keys(defaultCardData)
        const cardDataUpdaters = knownCardDataKeys.reduce((updaterCollection, key)=>{
            updaterCollection[key] = useCallback((updatedValue)=>{
                
                if (updatedValue.preventDefault){
                    updatedValue = updatedValue.target.value
                }

                if (updatedValue === card[key]){
                    return
                }

                const newData = {
                    ...card,
                }
                newData[key] = updatedValue
                updateCard(newData)
            }, knownCardDataKeys.map(key=>card[key]))
            return updaterCollection
        }, {})

        return div(
            { id: "card-editor", className: "flex hcenter" },
            div(
                { className: "card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3" },
                cardRenderer(card),
                div(
                    {className: "flex hcenter gutter-tb"},
                    button(
                        { className: card.id ? undefined : "hide" },
                        translate("delete_card")
                    ),
                    button(
                        translate("save_card")
                    ),
                    button(
                        translate("export")
                    ),
                )
            ),
            div(
                { className: "card-configs gutter-t-2 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3" },
                canShow("name", defaultCardData) 
                    ? div(
                        {className: "flex hcenter"},
                        EditName({
                            label: translate("name"),
                            value: card.name, 
                            updateValue: cardDataUpdaters.name
                        })
                    ) 
                    : undefined
                ,
                canShow("mana", defaultCardData)
                    ? EditNumber({
                        label: translate("mana_cost"),
                        value: card.mana,
                        updateValue: cardDataUpdaters.mana,
                    })
                    : undefined
                ,
                canShow("power", defaultCardData) && canShow("health", defaultCardData) && card.power !== null && card.health !== null
                    ? div(
                        {className: "flex no-wrap"},
                        EditNumber({
                            label: translate("power"),
                            value: card.power,
                            updateValue: cardDataUpdaters.power,
                        }),
                        EditNumber({
                            label: translate("health"),
                            value: card.health,
                            updateValue: cardDataUpdaters.health,
                        }),
                    )
                    : undefined
                ,
                canShow("faction", defaultCardData)
                    ? EditRegion({
                        value: card.faction,
                        updateValue: cardDataUpdaters.faction,
                    })
                    : undefined
                ,
                canShow("rarity", defaultCardData)
                    ? EditRarity({
                        value: card.rarity,
                        updateValue: cardDataUpdaters.rarity
                    })
                    : undefined
                ,
                canShow("clan", defaultCardData) 
                    ? div(
                        {className: "flex hcenter"},
                        EditName({
                            label: translate("clan"),
                            value: card.name, 
                            updateValue: cardDataUpdaters.name
                        })
                    ) 
                    : undefined
                ,
                canShow("keywords", defaultCardData) 
                    ? div(
                        {className: "flex hcenter"},
                        EditKeywords({
                            value: card.keywords, 
                            updateValue: cardDataUpdaters.keywords
                        })
                    ) 
                    : undefined
                ,
            ),
            
        )
    }
}