import factory, { div, label, strong, input, nav, button } from "/Utils/elements.js"
import { useCallback, useState, useEffect, useRef, useContext } from "/cdn/react"
import { Globals } from "/Views/index.js"
import useLang from "/Utils/use-lang.js"
import loadCss from "/Utils/load-css.js"
import useToggle from "/Utils/use-toggle.js"
import listLimit from "/Components/list-limit.js"
import { getRitoCardsFromDataDump } from "/Components/deck/hooks/use-filterable-rito-card-list.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import { getRitoCards, patchRitoCards, getLatestRitoData, getCardList, getCard, saveCard, deleteCard } from "/Utils/service.js"
import cardName from "/Components/deck/card-name.js"
import objectHash from "/cdn/object-hash"

const cssLoaded = loadCss("/Components/card-config/edit-associated-cards.css")

function editAssociatedCardsComponent(props){

    const translate = useLang()

    const globalState = useContext(Globals)
    const lowSpecsMode = globalState.state.settings.lowSpecsMode === true

    const [expanded, toggleExpanded] = useToggle(false)

    const [selectedTab, updateSelectedTab] = useState("custom")

    const knownCards = useRef({})

    // data related to rito's official cards
    const [ritoCards, updateRitoCards] = useState()
	useEffect(()=>{
		getRitoCards().then(ritoData=>{
            let ritoCards
			updateRitoCards(ritoCards = getRitoCardsFromDataDump(ritoData))
            Array.prototype.forEach.call(ritoCards || [], card=>{
                if (!card){
                    return
                }
                knownCards.current[card.cardCode] = card
            })
		})
	}, [])

    const [ritoLoading, updateRitoLoading] = useState(false)
	const loadRitoData = useCallback(()=>{
        if (ritoLoading){
            return
        }
		updateRitoLoading(true)
		getLatestRitoData({}, globalState.state.settings.lang).then(async ritoData => {
			await patchRitoCards(ritoData)
			updateRitoCards(getRitoCardsFromDataDump(ritoData))
			updateRitoLoading(false)
		})
	}, [ritoLoading])

    const [displayedRitoCards, updateDisplayedRitoCards] = useState([])
    const [searchRitoTerm, updateSearchRitoTerm] = useState("")
    useEffect(()=>{
        if (!Array.isArray(ritoCards)){
            return
        }

        const displayedCards = ritoCards.filter(card=>{
            return card && card.name.toLowerCase().includes(searchRitoTerm)
        })

        updateDisplayedRitoCards(displayedCards)
    }, [searchRitoTerm, ritoCards])

    // data related to custom cards
    const customCards = useAssetCache(updateCustomcards=>{
		getCardList({exclude: ["deck"]}).then(customCards=>{
            updateCustomcards(customCards)
            Array.prototype.forEach.call(customCards, card=>{
                knownCards.current[card.id] = card
            })
        })
	}, [])

    const [displayedCustomCards, updateDisplayedCustomCards] = useState([])
    const [searchCustomTerm, updateSearchCustomTerm] = useState("")    
    useEffect(()=>{
        if (!Array.isArray(customCards)){
            return
        }

        const displayedCards = customCards.filter(card=>{
            return card && card.name && card.name.toLowerCase().includes(searchRitoTerm)
        })


        updateDisplayedCustomCards(displayedCards)
    }, [searchCustomTerm, customCards])

    // stuff related to managing the associated cards
    const associatedCard = useCallback((card)=>{
        const storedData = {
            id: card.id,
            cardCode: card.cardCode,
            artUrl: card.url,
        }

        const hashData = storedData // for now, we just use this set of data as the source of the hash, but in the future, if we need to change anything, we'll extract this part out and make sure we're hashing only the right parts.
        const hash = objectHash(hashData) // the reason we're using a hash is because potentially we'll be compairing this value to tons of items, so this value should be as small as possiable to reduce computation time.

        storedData.key = hash

        let currentValue = props.value || []
        if (!Array.isArray(currentValue)){
            currentValue = []
        }
        const alreadylinked = currentValue.some(linkedCard => linkedCard.key === hash)
        if (alreadylinked){
            return
        }
        const updatedData = [
            storedData,
            ...currentValue
        ]

        props.updateValue(updatedData)
    }, [props.value, props.updateValue])

    // stuff related to displaying the associated cards
    const associatedCardsData = useAssetCache(updateAssociatedCardsData=>{
        const displayData = (props.value || []).map(cardKeys=>{
            return knownCards.current[cardKeys.id] || knownCards.current[cardKeys.cardCode] || cardKeys
        })

        updateAssociatedCardsData(displayData)
    }, [props.value, customCards, ritoCards], [])

    return div(
        { className: "associated-cards" },
        label(
            { onClick: toggleExpanded, className: "flex clickable" },
            div(
                { className: "grow flex vcenter" },
                strong(props.label)
            ),
            button(
                { className: "gutter-trbl-.5 flex vcenter" },
                div({ className: `icon ${lowSpecsMode ? "" : "animated"} ${expanded ? "multiply" : "chevron-down"}` })
            ),
        ),
        div(
            { className: `gutter-b-2 accordian ${expanded ? "expanded" : ""}` },
            nav(
                { className: "flex no-wrap tabs gutter-t-.5" },
                
                div(
					{ 
						className: (selectedTab === "custom" ? "active " : "" ) + "tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("custom"),
					}, 
					translate("custom_cards")
				),
                
                div(
					{ 
						className: (selectedTab === "rito" ? "active " : "" ) + "tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("rito"),
					}, 
					translate("official_cards")
				),
                
                div(
					{ 
						className: (selectedTab === "associated" ? "active " : "" ) + "tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("associated"),
					}, 
					props.label
				),

            ),
            div(
                { className: "tab-body gutter-t" },

                selectedTab === "custom" 
					? div(
						{ className: "gutter-rl" },

						div(
							listLimit(
								{ defaultSize: lowSpecsMode ? 8 : 24 },
								(displayedCustomCards || []).map(card=>card
									? div(
										{ className: "flex gutter-b", key: card.id },

										cardName({ card, className: "box-9" }, card.name),

										div(
											{ className: "box-3 flex no-wrap" },
											button({ className: "grow gutter-trbl-.5", onClick: ()=>associatedCard(card) }, 
                                                div({ className: "icon link" })
											),
										),
									)
									:undefined
								)
							)
						),
					)
					: undefined
				,

                selectedTab === "rito" 
                    ? div(
                        { className: "gutter-rl" },

                        div(

                            listLimit(
                                { defaultSize: lowSpecsMode ? 8 : 24 },
                                (displayedRitoCards || []).map(card=>card
                                    ? div(
                                        { className: "flex gutter-b", key: card.cardCode },

                                        cardName({ card, className: "box-9" }, card.name),

                                        div(
											{ className: "box-3 flex no-wrap" },
											button({ className: "grow gutter-trbl-.5", onClick: ()=>associatedCard(card) }, 
												div({ className: "icon link" })
											),
										),
                                    )
                                    :undefined
                                )
                            ),

                            !ritoCards || !ritoCards.length 
                                ? div(
                                    { className: "flex" },
                                    button(
                                        { 
                                            onClick: loadRitoData,
                                            className: "gutter-trbl-.5 grow",
                                        }, 
                                        ritoLoading 
                                            ? div({ className: "icon loading" })
                                            : translate("load_rito_data")
                                        ,
                                    )
                                )
                                : undefined 
                            , 

                        ),

                    ) 
                    : undefined
                ,

                selectedTab === "associated" 
					? div(
						{ className: "gutter-rl" },

						(associatedCardsData || []).map(card=>card
                            ? div(
                                { className: "flex gutter-b", key: card.id || card.cardCode || card.url },

                                cardName({ card, className: "box-9" }, card.name),

                                div(
                                    { className: "box-3 flex no-wrap" },
                                    button({ className: "grow gutter-trbl-.5" }, 
                                        div({ className: "icon multiply" })
                                    ),
                                ),
                            )
                            :undefined
                        )
					)
					: undefined
				,

            ),
        )
    )
}

export default factory(editAssociatedCardsComponent, cssLoaded)