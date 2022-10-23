import { div, button } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import React, { useState, useCallback, createContext, useContext } from "/cdn/react"
import saveSvgAsPng from "/cdn/save-svg-as-png"

import EditName from "/Components/card-config/edit-name.js"
import EditNumber from "/Components/card-config/edit-number.js"
import EditRegion from "/Components/card-config/edit-region.js"
import EditRarity from "/Components/card-config/edit-rarity.js"
import EditKeywords from "/Components/card-config/edit-keywords.js"
import EditEffect from "/Components/card-config/edit-effect.js"
import EditSpeed from "/Components/card-config/edit-speed.js"
import EditColorText from "/Components/card-config/edit-colored-text.js"


loadCss("/Views/card-editor.css")

function canShow(ifKeyExists, inThisObject){
    return Object.hasOwnProperty.call(inThisObject, ifKeyExists)
}

export const svgRefference = createContext({
    current: null,
    setRef: ()=>{},
})

export default function EditorViewFactory(cardRenderer, defaultCardData){
    return function EditorView(){
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

        const [svgRef, updateSvgRef] = useState(null)

        const exportCard = useCallback(()=>{
            saveSvgAsPng.svgAsPngUri(svgRef, {
                excludeUnusedCss: true,
                width: 680,
                height: 1024,
            }).then(uri=>{
                openUri(uri)
            })
        }, [svgRef])

        return div(
            { id: "card-editor", className: "flex hcenter" },
            div(
                { className: "card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3" },
                React.createElement(
                    svgRefference.Provider,
                    { value: {
                        current: svgRef,
                        setRef: updateSvgRef,
                    } },
                    cardRenderer(card),
                ),
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
                        { onClick: exportCard },
                        translate("export")
                    ),
                )
            ),
            div(
                { className: "card-configs gutter-t-2 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3" },
                canShow("name", defaultCardData)
                    ? div(
                        {className: "flex hcenter gutter-b-2"},
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
                canShow("keywords", defaultCardData)
                    ? EditKeywords({
						value: card.keywords,
						updateValue: cardDataUpdaters.keywords
					})
                    : undefined
                ,
                canShow("speed", defaultCardData)
                    ? EditSpeed({
						value: card.speed,
						updateValue: cardDataUpdaters.speed
					})
                    : undefined
                ,
                canShow("effect", defaultCardData)
                    ? EditEffect({
						value: card.effect,
						updateValue: cardDataUpdaters.effect,
						label: translate("effect")
					})
                    : undefined
                ,
                canShow("lvup", defaultCardData)
                    ? EditEffect({
						value: card.lvup,
						updateValue: cardDataUpdaters.lvup,
						label: translate("lv_up")
					})
                    : undefined
                ,
                canShow("blueWords", defaultCardData)
                    ? EditColorText({
						label: translate("other_card_mentioned"),
						subLabel: translate("other_card_example"),
						value: card.blueWords,
						updateValue: cardDataUpdaters.blueWords
					})
                    : undefined
                ,
                canShow("orangeWords", defaultCardData)
                    ? EditColorText({
						label: translate("key_text_mentioned"),
						subLabel: translate("key_text_example"),
						value: card.orangeWords,
						updateValue: cardDataUpdaters.orangeWords
					})
                    : undefined
                ,
                canShow("clan", defaultCardData)
                    ? div(
                        {className: "gutter-b-2"},
                        EditName({
                            label: translate("clan"),
                            value: card.clan,
                            updateValue: cardDataUpdaters.clan
                        })
                    )
                    : undefined
                ,
            ),

        )
    }
}

function openUri(base64ImageData) {
    const typeRegex = /data:([^;]+);base64,/
    const matched = typeRegex.exec(base64ImageData)

    const contentType = matched[1];

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
}