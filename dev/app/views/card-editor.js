import factory, { div, button, strong } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import React, { useState, useCallback, useContext, createContext, useRef, useLayoutEffect, useEffect } from "/cdn/react"
import saveSvgAsPng from "/cdn/save-svg-as-png"
import { Globals } from "/Views/index.js"
import { getCard, saveCard, deleteCard } from "/Utils/service.js"


import EditName from "/Components/card-config/edit-name.js"
import EditNumber from "/Components/card-config/edit-number.js"
import EditRegion from "/Components/card-config/edit-region.js"
import EditRarity from "/Components/card-config/edit-rarity.js"
import EditKeywords from "/Components/card-config/edit-keywords.js"
import EditEffect from "/Components/card-config/edit-effect.js"
import EditSpeed from "/Components/card-config/edit-speed.js"
import EditColorText from "/Components/card-config/edit-colored-text.js"
import EditArt from "/Components/card-config/edit-art.js"
import EditShade from "/Components/card-config/edit-shade.js"
import { defaultShade } from "/Views/list.js"

const cssLoaded = loadCss("/Views/card-editor.css")

function canShow(ifKeyExists, inThisObject){
    return Object.hasOwnProperty.call(inThisObject, ifKeyExists)
}

export const svgRefference = createContext({
    current: null,
    setRef: ()=>{},
})

export default function EditorViewFactory(cardRenderer, defaultCardData){
    const component =  function EditorView(){
        const translate = useLang()

        const globalState = useContext(Globals)
        const globalStateRef = useRef()
        globalStateRef.current = globalState

        const [card, updateCard] = useState(defaultCardData)

        useEffect(()=>{
            globalState.state.cardId && getCard(globalState.state.cardId).then(updateCard)
            return ()=>{
                globalStateRef.current.patchState({cardId: ""})
            }
        }, [])

        const knownCardDataKeys = Object.keys(defaultCardData)
        let accumulatedCardUpdates = {...card}
        const cardDataUpdaters = knownCardDataKeys.reduce((updaterCollection, key)=>{
            updaterCollection[key] = useCallback((updatedValue)=>{

                if (updatedValue && updatedValue.preventDefault){
                    updatedValue = updatedValue.target.value
                }

                if (updatedValue === card[key]){
                    return
                }

                const newData = {
                    ...accumulatedCardUpdates,
                }
                newData[key] = updatedValue
                accumulatedCardUpdates = newData
                updateCard(newData)
            }, knownCardDataKeys.map(key=>card[key]))
            return updaterCollection
        }, {})

        const [svgRef, updateSvgRef] = useState(null)

        const exportCard = useCallback(()=>{
            saveSvgAsPng.svgAsPngUri(svgRef, {
                excludeUnusedCss: true,
                width: svgRef.width.baseVal.value,
                height: svgRef.height.baseVal.value,
            }).then(uri=>{
                openUri(uri)
            })
        }, [svgRef])

        const fixedDisplayRef = useRef()
        const [useableWidth, updateUseableWidth] = useState(0)
        const [previewHeight, updatePreviewHeight] = useState(0)
        useLayoutEffect(()=>{
            window.scroll(0,0)
            
            function setFixedDisplayDimentions(){
                let useableWidth = fixedDisplayRef.current.parentNode.clientWidth
                const computedStyle = getComputedStyle(fixedDisplayRef.current.parentNode)

                useableWidth = useableWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)

                updateUseableWidth(useableWidth)
                updatePreviewHeight(fixedDisplayRef.current.offsetHeight)
            }
			requestAnimationFrame(setFixedDisplayDimentions)

            const observer = new MutationObserver(setFixedDisplayDimentions)

            window.addEventListener("resize", setFixedDisplayDimentions)
            observer.observe(fixedDisplayRef.current, {
                attributes: true
            })

            return function(){
                window.removeEventListener("resize", setFixedDisplayDimentions)
                observer.disconnect()
            }
        }, [])

        return div(
            { id: "card-editor", className: "flex hcenter" },
            div(
                { className: "card-preview gutter-t-2 box-xs-12 box-s-8 box-m-6 box-l-5 box-xl-4", style: { paddingBottom: previewHeight + "px"}},
                div(
                    {className: "preview-content", ref: fixedDisplayRef, style: {
                        width: useableWidth + "px"
                    }},
                    div(
                        { className: "gutter-rl-2" },
                        React.createElement(
                            svgRefference.Provider,
                            { value: {
                                current: svgRef,
                                setRef: updateSvgRef,
                            } },
                            cardRenderer({
                                ...card,
                                cardDataUpdaters,
                                updateTransform: card.art && globalState.state.moveableArt ? cardDataUpdaters.transform : undefined,
                            }),
                        )
                    ),
                    div(
                        {className: "flex hcenter gutter-tb"},
                        div(
                            { className: "gutter-rl-.5" },
                            button(
                                { 
                                    className: `gutter-trbl-.5 ${card.id ? undefined : "hide"}` ,
                                    onClick: ()=>{
                                        deleteCard(card.id).then(()=>{
                                            document.location.reload()
                                        })
                                    }
                                },
                                strong(translate("delete_card"))
                            )
                        ),
                        div(
                            { className: "gutter-rl-.5" },
                            button(
                                {
                                    className: "gutter-trbl-.5",
                                    onClick: ()=>{
                                        if (card.id){
                                            return saveCard(card.id, card) 
                                        }
                                        const newId = Date.now().toString()
                                        saveCard(newId, card)
                                        cardDataUpdaters.id(newId)
                                    }
                                },
                                strong(translate("save_card"))
                            )
                        ),
                        div(
                            { className: "gutter-rl-.5" },
                            button(
                                { className: "gutter-trbl-.5", onClick: exportCard },
                                strong(translate("export"))
                            )
                        ),
                    )
                ),
            ),
            div(
                { className: "card-configs gutter-tb-4 gutter-rl box-xs-12 box-s-8 box-m-6 box-l-5 box-xl-4" },
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
                    ? div(
                        { className: "gutter-b-2" },
                        EditNumber({
                            label: translate("mana_cost"),
                            value: card.mana,
                            updateValue: cardDataUpdaters.mana,
                        })
                    )
                    : undefined
                ,
                canShow("speed", defaultCardData)
                    ? EditSpeed({
						value: card.speed,
						updateValue: cardDataUpdaters.speed
					})
                    : undefined
                ,
                canShow("power", defaultCardData) && canShow("health", defaultCardData) && card.power !== null && card.health !== null
                    ? div(
                        {className: "flex-l no-wrap"},
                        EditNumber({
                            className: "block gutter-b-2",
                            label: translate("power"),
                            value: card.power,
                            updateValue: cardDataUpdaters.power,
                        }),
                        EditNumber({
                            className: "block gutter-b-2",
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
                canShow("art", defaultCardData)
                    ? div(
                        {className: "gutter-b-2"},
                        EditArt({
                            value: card.art,
                            updateValue: cardDataUpdaters.art,
                        })
                    )
                    : undefined
                ,
                canShow("shade", defaultCardData)
                    ? div(
                        {className: "gutter-b-2"},
                        EditShade({
                            value: card.shade || defaultShade,
                            updateValue: cardDataUpdaters.shade,
                        })
                    )
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

    return factory(component, cssLoaded)
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
