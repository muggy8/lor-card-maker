import factory, { div, button, strong, section } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import React, { useState, useCallback, useContext, createContext, useRef, useLayoutEffect, useEffect } from "/cdn/react"
import { Globals } from "/Views/index.js"
import { getCard, saveCard, deleteCard } from "/Utils/service.js"
import setImmediate from "/Utils/set-immediate-batch.js"

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
import EditIcon from "/Components/card-config/edit-icon.js"
import EditCheckbox from "/Components/card-config/edit-checkbox.js"
import EditAssociatedCards from "/Components/card-config/edit-associated-cards.js"
import { defaultShade } from "/Views/list.js"
import useToggle from "/Utils/use-toggle.js"
import debounceFunction from "/Utils/debounce-function.js"
import exportFromApp from "/Components/export.js"

const cssLoaded = loadCss("/Views/card-editor.css")

function canShow(ifKeyExists, inThisObject){
    return Object.hasOwnProperty.call(inThisObject, ifKeyExists)
}

export const svgRefference = createContext({
    current: null,
    setRef: ()=>{},
})

export default function EditorViewFactory(cardRenderer, defaultCardData){
    const knownCardDataKeys = Object.keys(defaultCardData)
    knownCardDataKeys.sort()

    const component =  function EditorView(){
        const translate = useLang()

        const globalState = useContext(Globals)
        const globalStateRef = useRef()
        globalStateRef.current = globalState

        useEffect(()=>{
            const storedCallback = globalState.getAllowBack()

            globalStateRef.current.setAllowBack(()=>{
                if (document.documentElement.scrollTop > 100){
                    setImmediate(()=>window.scroll({
                        top: -document.documentElement.scrollTop,
                        left: 0,
                        behavior: "smooth",
                    }))
                    return false
                }
                else{
                    return storedCallback()
                }
            })

            return function(){
                globalStateRef.current.setAllowBack(storedCallback)
            }
        }, [])

        const [card, updateCard] = useState(defaultCardData)
        useEffect(()=>{
            globalState.state.cardId && getCard(globalState.state.cardId).then(updateCard)
            return ()=>{
                globalStateRef.current.patchState({cardId: ""})
            }
        }, [])

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

        const [isExporting, _toggleExporting, setExporting] = useToggle(false)

        const exportCard = useCallback(()=>{
            if (isExporting){
                return
            }

            setExporting(true)

            exportFromApp(card, svgRef, globalState).then(()=>setExporting(false), (err)=>console.warn(err) + setExporting(false))
        }, [svgRef, isExporting, globalState, card])

        const fixedDisplayRef = useRef()
        const [useableWidth, updateUseableWidth] = useState(0)
        const [previewHeight, updatePreviewHeight] = useState(0)
        useLayoutEffect(()=>{

            const setFixedDisplayDimentions = debounceFunction(function(){
                let useableWidth = fixedDisplayRef.current.parentNode.clientWidth
                const computedStyle = getComputedStyle(fixedDisplayRef.current.parentNode)

                useableWidth = useableWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)

                updateUseableWidth(useableWidth)
                updatePreviewHeight(fixedDisplayRef.current.offsetHeight)
            }, 250)
			requestAnimationFrame(setFixedDisplayDimentions)

            const observer = new MutationObserver(setFixedDisplayDimentions)

            window.addEventListener("resize", setFixedDisplayDimentions)
            observer.observe(fixedDisplayRef.current, {
                attributes: true,
                // childList: true,
                // subtree: true,
                // attributes: ["style"]
            })

            return function(){
                window.removeEventListener("resize", setFixedDisplayDimentions)
                observer.disconnect()
            }
        }, [])

        const [canSave, _toggleCanSave, setCanSave] = useToggle(true)
        const [isSaving, _toggleIsSaving, setisSaving] = useToggle(false)
        useEffect(()=>{
            setCanSave(true)
        }, knownCardDataKeys.map(key=>card[key]))

        return section(
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
                                loading: isExporting || isSaving,
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
                                        if (!canSave || isSaving){
                                            return
                                        }
                                        setisSaving(true)
                                        function doneSaving(){
                                            setCanSave(false)
                                            setisSaving(false)
                                        }
                                        if (card.id){
                                            return saveCard(card.id, card).then(doneSaving, doneSaving)
                                        }
                                        const newId = Date.now().toString()
                                        saveCard(newId, card).then(doneSaving, doneSaving)
                                        cardDataUpdaters.id(newId)
                                    },
                                    [(canSave || !setisSaving ? "data-foo" : "disabled")]: true
                                },
                                strong(translate("save_card"))
                            )
                        ),
                        div(
                            { className: "gutter-rl-.5" },
                            button(
                                {
                                    className: "gutter-trbl-.5",
                                    onClick: exportCard,
                                    [(isExporting ? "disabled" : "data-foo")]: true
                                },
                                strong(translate("share"))
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
                canShow("icons", defaultCardData)
                    ? div(
                        {className: "flex hcenter gutter-b-2"},
                        EditIcon({
                            value: card.icons,
                            updateValue: cardDataUpdaters.icons,
                        })
                    )
                    : undefined
                ,
                canShow("largerIcon", defaultCardData)
                    ? div(
                        {className: "gutter-b-2"},
                        EditCheckbox({
                            label: translate("larger_icon"),
                            value: card.largerIcon,
                            updateValue: cardDataUpdaters.largerIcon
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
                            label: translate("card_art"),
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
                        orangeWords: card.orangeWords,
                        updateOrangeWords: cardDataUpdaters.orangeWords,
                        blueWords: card.blueWords,
                        updateBlueWords: cardDataUpdaters.blueWords,
						label: translate("effect")
					})
                    : undefined
                ,
                canShow("lvup", defaultCardData)
                    ? EditEffect({
						value: card.lvup,
						updateValue: cardDataUpdaters.lvup,
                        orangeWords: card.orangeWords,
                        updateOrangeWords: cardDataUpdaters.orangeWords,
                        blueWords: card.blueWords,
                        updateBlueWords: cardDataUpdaters.blueWords,
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
                canShow("associatedCards", defaultCardData)
                    ? div(
                        {className: "gutter-b-2"},
                        EditAssociatedCards({
                            label: translate("associated_cards"),
                            value: card.associatedCards,
                            updateValue: cardDataUpdaters.associatedCards
                        })
                    )
                    : undefined
                ,
            ),

        )
    }

    return factory(component, cssLoaded)
}

export async function openUri(base64ImageData, fileName = "export.png") {
    const typeRegex = /data:([^;]+);(([^;]+);)*base64,/
    const matched = typeRegex.exec(base64ImageData)

    const [dataUriHeader, contentType] = matched
    const blob = await fetch(base64ImageData).then(res=>res.blob())
   
    const shareFile = new File([
            blob
        ],
        fileName,
        {
            type: blob.type
        }
    )

    if ("share" in navigator && "canShare" in navigator && navigator.canShare({files: [shareFile]})){
        navigator.share({
            files: [shareFile]
        })
        .catch((err)=>{
            // share failed so lets fall back to making a new page
            if (err.name === "AbortError" || err.message.toLowerCase() === "share canceled"){
				return
			}

            const blobUrl = URL.createObjectURL(blob)
            window.open(blobUrl, '_blank')
        })
    }
    else if(window.AndroidNativeInterface){
		const message = JSON.stringify({
			image: base64ImageData.substr(dataUriHeader.length),
			fileName
		})
		window.AndroidNativeInterface.postMessage(message)
	}
    else{
        const blobUrl = URL.createObjectURL(blob)
        window.open(blobUrl, '_blank')
    }

}
