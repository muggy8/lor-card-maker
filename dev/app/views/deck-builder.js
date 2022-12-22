import factory, { div, strong, button, nav, section } from "/Utils/elements.js"
import { useState, useCallback, useRef, useEffect, useLayoutEffect, createElement } from "/cdn/react"
import { getRitoCards, patchRitoCards, getLatestRitoData, getCardList, getCard, saveCard, deleteCard } from "/Utils/service.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import useFilter from "/Utils/use-filter.js"
import listLimit from "/Components/list-limit.js"
import cardName from "/Components/deck/card-name.js"
import ritoCardsFiltersUi from "/Components/deck/rito-cards-filters-ui.js"
import deckView from "/Components/deck/deck-view.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import customCardsFiltersUi from "/Components/deck/custom-cards-filters-ui.js"
import debounceFunction from "/Utils/debounce-function.js"
import saveSvgAsPng from "/cdn/save-svg-as-png"
import { svgRefference } from "/Views/card-editor.js"
import { openUri } from "/Views/card-editor.js"
import { Globals } from "/Views/index.js"

const cssLoaded = loadCss("/Views/deck-builder.css")

function getRitoCardsFromDataDump({sets}){
	if (!sets){
		return
	}

	const cards = sets.map(expantion=>expantion.data).flat()
	cards.sort((a,b)=>{
		if (a.supertype.toLowerCase() === "champion" && b.supertype.toLowerCase() !== "champion"){
			return -1
		}
		if (a.supertype.toLowerCase() !== "champion" && b.supertype.toLowerCase() === "champion"){
			return 1
		}

		const costDiff = a.cost - b.cost
		if (costDiff){
			return costDiff
		}

		const collectableDiff = b.collectible - a.collectible
		if (collectableDiff){
			return collectableDiff
		}

		const nameDif = a.name.localeCompare(b.name)
		if (nameDif){
			return nameDif
		}

		return 0
	})

	return cards
}

function getOptionsFromCardsList(cardList){
	const options = cardList.reduce((variationCollector, card)=>{
		if (!card){
			return variationCollector
		}

		Object.keys(card).forEach(property=>{
			variationCollector[property] = variationCollector[property] || new Map()

			const value = card[property]
			if (Array.isArray(value)){
				value.forEach(actualValue=>{
					variationCollector[property].set(actualValue, true)
				})
				return
			}
			variationCollector[property].set(value, true)
		})

		return variationCollector
	}, {})

	Object.keys(options).forEach(property=>{
		const valueMap = options[property]
		options[property] = []
		valueMap.forEach((_value, key)=>{
			options[property].push(key)
		})
	})

	return options
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function deckBuilderComponenet(){

	const translate = useLang()

	const [selectedTab, updateSelectedTab] = useState("rito")

	// stuff we'll need for custom cards
	const customCards = useAssetCache(updateCustomcards=>{
		getCardList({exclude: ["keyword", "deck"]}).then(updateCustomcards)
	}, [])

	const [displayedCustomCards, updateCustomCardSource, currentCustomCardsFilters, patchCustomCardsFilters] = useFilter({
		name: {
			filter: (userSelectedName, name)=>{
				if (!userSelectedName){
					return true
				}
				return name.toLowerCase().includes(userSelectedName.toLowerCase())
			}
		},
		effect: {
			filter: (userSelectedDescription, descriptionRaw)=>{
				if (!userSelectedDescription){
					return true
				}
				return descriptionRaw.toLowerCase().includes(userSelectedDescription .toLowerCase())
			}
		},
		lvup: {
			filter: (userSelectedDescription, descriptionRaw)=>{
				if (!userSelectedDescription){
					return true
				}
				return descriptionRaw.toLowerCase().includes(userSelectedDescription .toLowerCase())
			}
		},
		clan: {
			filter: (userSelectedClan, clan)=>{
				if (!userSelectedClan){
					return true
				}
				return Array.prototype.some.call(clan, clanName=>{
					return clanName.toLowerCase().includes(userSelectedClan.toLowerCase())
				})
			}
		},
		keywords: {
			filter: (userSelectedKeywords, keywords)=>{
				if (!userSelectedKeywords || !userSelectedKeywords.length){
					return true
				}
				return keywords.some(keywordOnCard=>
					userSelectedKeywords.includes(keywordOnCard) ||
					userSelectedKeywords.some(keywordStringOrObject=>{
						if (typeof keywordStringOrObject === "string" || typeof keywordOnCard === "string"){
							return false
						}

						return keywordStringOrObject.id === keywordOnCard.id
					})
				)
			}
		},
		rarity: {
			filter: (userSelectedRarities, rarity)=>{
				if (!userSelectedRarities || !userSelectedRarities.length){
					return true
				}
				return userSelectedRarities.includes(rarity)
			}
		},
		type: {
			filter: (userSelectedCardTypes, cardType)=>{
				if (!userSelectedCardTypes || !userSelectedCardTypes.length){
					return true
				}
				return userSelectedCardTypes.includes(cardType)
			}
		},
		faction: {
			filter: (userSelectedFactions, cardFactions)=>{
				if (!userSelectedFactions || !userSelectedFactions.length){
					return true
				}
				return userSelectedFactions.some(userSelectedRegion=>cardFactions.includes(userSelectedRegion))
			}
		},
		speed: {
			filter: (userSelectedSpeeds, speed)=>{
				if (!userSelectedSpeeds || !userSelectedSpeeds.length){
					return true
				}
				return userSelectedSpeeds.includes(speed)
			}
		},
		mana: {
			filter: (userSelectedManaRange, mana)=>{
				if (!userSelectedManaRange || !userSelectedManaRange.length){
					return true
				}

				const [min, max] = userSelectedManaRange

				return mana <= max && mana >= min
			}
		},
		power: {
			filter: (userSelectedPowerRange, power, card)=>{
				if (!userSelectedPowerRange || !userSelectedPowerRange.length){
					return true
				}

				if ((card.type || "").toLowerCase() !== "unit"){
					return false
				}

				const [min, max] = userSelectedPowerRange

				return power <= max && power >= min
			}
		},
		health: {
			filter: (userSelectedHealthRange, health, card)=>{
				if (!userSelectedHealthRange || !userSelectedHealthRange.length){
					return true
				}

				if ((card.type || "").toLowerCase() !== "unit"){
					return false
				}

				const [min, max] = userSelectedHealthRange

				return health <= max && health >= min
			}
		},
	})

	// update custom card source data when needed
	useEffect(()=>{
		if (!customCards || !customCards.length){
			return updateCustomCardSource([])
		}

		updateCustomCardSource(customCards)

	}, [customCards])

	const patchCustomcardsFilter = useCallback((filterToPatch, patchSettings)=>{
		const patch = {}
		patch[filterToPatch] = patchSettings
		patchCustomCardsFilters(patch)
	}, [patchCustomCardsFilters])

	const customCardsFilterOptions = useAssetCache(updateFilterOptions=>{
		if (!customCards || !customCards.length || !displayedCustomCards || !displayedCustomCards.length){
			return
		}

		// who would have thought that there'd be a shit load of garbage data in user generated content ._.
		const baseOptions = getOptionsFromCardsList(customCards)
		baseOptions.health = baseOptions.health.filter(value=>typeof value !== "undefined" && value !== null)
		baseOptions.power = baseOptions.power.filter(value=>typeof value !== "undefined" && value !== null)
		const originalTypesList = baseOptions.type
		baseOptions.type = baseOptions.type.filter(type=>!type.toLowerCase().includes("champion")) // filter out all champion types so we can replace it with a genaric champion type for easier filtering
		originalTypesList.length !== baseOptions.type.length && baseOptions.type.push("champion") // add a genaric champion type back in if we sliced out something with the above logic

		const filteredResultsOptions = getOptionsFromCardsList(displayedCustomCards)
		const keywordsAlreadyAccountedFor = []
		filteredResultsOptions.keywords = filteredResultsOptions.keywords.filter(keyword=>{
			const keywordIdentifyer = keyword.id || keyword // if it's custom it'll have an id, otherwise it's just a string
			if (keywordsAlreadyAccountedFor.includes(keywordIdentifyer)){
				return false
			}

			keywordsAlreadyAccountedFor.push(keywordIdentifyer)
			return true
		})

		const trueOptions = {
			...baseOptions,
			keywords: filteredResultsOptions.keywords,
		}

		updateFilterOptions(trueOptions)
		// console.log(trueOptions, displayedCustomCards)
	}, [customCards, displayedCustomCards], {})

	// rito cards shinanagas because shinangas
	const [ritoCards, updateRitoCards] = useState()
	useEffect(()=>{
		getRitoCards().then(ritoData=>{
			updateRitoCards(getRitoCardsFromDataDump(ritoData))
		})
	}, [])

	const [ritoLoading, updateRitoLoading] = useState(false)
	const loadRitoData = useCallback(()=>{
		updateRitoLoading(true)
		getLatestRitoData().then(async ritoData => {
			await patchRitoCards(ritoData)
			updateRitoCards(getRitoCardsFromDataDump(ritoData))
			updateRitoLoading(false)
		})
	}, [])

	const [displayedRitoCards, updateRitoCardSource, currentRitoCardsFilters, patchRitoCardsFilters] = useFilter({
		collectible: {
			value: true,
			filter: (userSelectedCollectable, collectible)=>{
				return collectible === userSelectedCollectable
			}
		},
		name: {
			filter: (userSelectedName, name)=>{
				if (!userSelectedName){
					return true
				}
				return name.toLowerCase().includes(userSelectedName.toLowerCase())
			}
		},
		descriptionRaw: {
			filter: (userSelectedDescription, descriptionRaw, cardData)=>{
				if (!userSelectedDescription){
					return true
				}
				return descriptionRaw.toLowerCase().includes(userSelectedDescription.toLowerCase()) 
					|| cardData.levelupDescriptionRaw.toLowerCase().includes(userSelectedDescription.toLowerCase()) 
					|| cardData.description.toLowerCase().includes(userSelectedDescription.toLowerCase()) 
					|| cardData.levelupDescription.toLowerCase().includes(userSelectedDescription.toLowerCase()) 
			}
		},
		subtypes: {
			filter: (userSelectedSubtype, subtypes)=>{
				if (!userSelectedSubtype){
					return true
				}
				return Array.prototype.some.call(subtypes, subtypeName=>{
					return subtypeName.toLowerCase().includes(userSelectedSubtype.toLowerCase())
				})
			}
		},
		type: {
			filter: (userSelectedTypes, type)=>{
				if (!userSelectedTypes || !userSelectedTypes.length){
					return true
				}
				return userSelectedTypes.includes(type)
			}
		},
		set: {
			filter: (userSelectedSets, set)=>{
				if (!userSelectedSets || !userSelectedSets.length){
					return true
				}
				return userSelectedSets.includes(set)
			}
		},
		keywords: {
			filter: (userSelectedKeywords, keywords)=>{
				if (!userSelectedKeywords || !userSelectedKeywords.length){
					return true
				}
				return keywords.some(keywordOnCard=>userSelectedKeywords.includes(keywordOnCard))
			}
		},
		rarity: {
			filter: (userSelectedRarities, rarity)=>{
				if (!userSelectedRarities || !userSelectedRarities.length){
					return true
				}
				return userSelectedRarities.includes(rarity)
			}
		},
		regionRefs: {
			filter: (userSelectedRegions, cardRegions)=>{
				if (!userSelectedRegions || !userSelectedRegions.length){
					return true
				}
				return userSelectedRegions.some(userSelectedRegion=>cardRegions.includes(userSelectedRegion))
			}
		},
		spellSpeed: {
			filter: (userSelectedSpellSpeeds, spellSpeed)=>{
				if (!userSelectedSpellSpeeds || !userSelectedSpellSpeeds.length){
					return true
				}
				return userSelectedSpellSpeeds.includes(spellSpeed)
			}
		},
		cost: {
			filter: (userSelectedCostRange, cost)=>{
				if (!userSelectedCostRange || !userSelectedCostRange.length){
					return true
				}

				const [min, max] = userSelectedCostRange

				return cost <= max && cost >= min
			}
		},
		attack: {
			filter: (userSelectedAtttackRange, attack, card)=>{
				if (!userSelectedAtttackRange || !userSelectedAtttackRange.length){
					return true
				}

				if ((card.type || "").toLowerCase() !== "unit"){
					return false
				}

				const [min, max] = userSelectedAtttackRange

				return attack <= max && attack >= min
			}
		},
		health: {
			filter: (userSelectedHealthRange, health, card)=>{
				if (!userSelectedHealthRange || !userSelectedHealthRange.length){
					return true
				}

				if ((card.type || "").toLowerCase() !== "unit"){
					return false
				}

				const [min, max] = userSelectedHealthRange

				return health <= max && health >= min
			}
		},
	})

	useEffect(()=>{
		if (!ritoCards || !ritoCards.length){
			return updateRitoCardSource([])
		}

		updateRitoCardSource(ritoCards)
	}, [ritoCards])

	const patchRitocardsFilter = useCallback((filterToPatch, patchSettings)=>{
		const patch = {}
		patch[filterToPatch] = patchSettings
		patchRitoCardsFilters(patch)
	}, [patchRitoCardsFilters])

	const ritoCardsFilterOptions = useAssetCache(updateFilterOptions=>{
		if (!ritoCards || !ritoCards.length || !displayedRitoCards || !displayedRitoCards.length){
			return
		}

		const baseOptions = getOptionsFromCardsList(ritoCards)
		baseOptions.set.sort((a,b)=>a.localeCompare(b))
		const filteredResultsOptions = getOptionsFromCardsList(displayedRitoCards)
		const trueOptions = {
			...baseOptions,
			keywords: filteredResultsOptions.keywords,
		}

		updateFilterOptions(trueOptions)
		// console.log(trueOptions, displayedRitoCards)
	}, [ritoCards, displayedRitoCards], {})

	// whatever data that's needed for the cards to be rendered in a pretty UI
	const [deck, updateDeck] = useState({
		id: undefined,
		cards: []
	})
	const deckCardsToRender = deck.cards

	let unPatchedChanged = {}
	const patchDeck = useCallback((update)=>{
		unPatchedChanged = {...unPatchedChanged, ...update}

		updateDeck({
			...deck,
			...unPatchedChanged,
		})
	}, [deck])

	const deckCardsListOrder = useAssetCache(updateList=>{
		const listOrder = [
			...deckCardsToRender
		]

		listOrder.sort((a,b)=>{
			const aManaCost = Object.prototype.hasOwnProperty.call(a.card, "mana") ? a.card.mana : a.card.cost
			const bManaCost = Object.prototype.hasOwnProperty.call(b.card, "mana") ? b.card.mana : b.card.cost

			const aName = a.card.name.toLowerCase()
			const bName = b.card.name.toLowerCase()

			return (aManaCost - bManaCost) || aName.localeCompare(bName)
		})

		updateList(listOrder)
	}, [deckCardsToRender], [])

	// functionality for management of the decklist
	const selectedCards = useRef(new Map())
	const updateRenderedDeck = useCallback(()=>{
		const renderedDeck = []
		selectedCards.current.forEach((value)=>renderedDeck.push(value))
		renderedDeck.sort((a,b)=>{
			
			const aManaCost = Object.prototype.hasOwnProperty.call(a.card, "mana") ? a.card.mana : a.card.cost
			const bManaCost = Object.prototype.hasOwnProperty.call(b.card, "mana") ? b.card.mana : b.card.cost

			const aName = a.card.name.toLowerCase()
			const bName = b.card.name.toLowerCase()

			return (b.count - a.count) || (aManaCost - bManaCost) || aName.localeCompare(bName)
		})
		patchDeck({cards: renderedDeck})
	}, [])
	const addCard = useCallback(card=>{
		const cardId = card.id || card.cardCode

		let existingData = selectedCards.current.get(cardId)
		if (!existingData){
			existingData = {
				count: 0,
				card
			}

			selectedCards.current.set(cardId, existingData)
		}

		existingData.count ++ // we dont limit it at 3 because it's possible that somehow, the user wishes to put 4+ of the same card into the deck cuz PoC or some silly origin passive or something

		updateRenderedDeck()
	}, [])
	const removeCard = useCallback(card=>{
		const cardId = card.id || card.cardCode

		let existingData = selectedCards.current.get(cardId)
		if (!existingData){
			return
		}

		if (existingData.count){
			existingData.count--
		}

		if (existingData.count < 1){
			selectedCards.current.delete(cardId)
		}
		updateRenderedDeck()
	}, [])

	// copy paste more code for managing the preview view
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
            childList: true,
            subtree: true,
            attributes: ["style"]
        })

        return function(){
            window.removeEventListener("resize", setFixedDisplayDimentions)
            observer.disconnect()
        }
    }, [])

	// logic to do with exporting 
	const [svgRef, updateSvgRef] = useState(null)
	const [isExporting, setExporting] = useState(false)
	const exportCard = useCallback(()=>{
		if (isExporting){
			return
		}

		setExporting(true)
		saveSvgAsPng.svgAsPngUri(svgRef, {
			excludeUnusedCss: true,
			width: svgRef.width.baseVal.value,
			height: svgRef.height.baseVal.value,
		}).then(
			uri=>{
				openUri(uri, `${(deck.name || "export").toUpperCase()}.png`)
				setExporting(false)
			},
			()=>setExporting(false)
		)
	}, [svgRef, isExporting])

	// logic to do with saving
	const [canSave, setCanSave] = useState(!deck.id)
	const [isSaving, setisSaving] = useState(false)
	useEffect(()=>{
		setCanSave(true)
	}, Object.keys(deck).map(prop=>deck[prop]))
	const saveDeck = useCallback(()=>{
		if (!canSave || isSaving){
			return
		}
		setisSaving(true)
		function doneSaving(){
			setCanSave(false)
			setisSaving(false)
		}
		if (deck.id){
			return saveCard(deck.id, deck).then(doneSaving, doneSaving)
		}
		const newId = Date.now().toString()
		saveCard(newId, deck).then(doneSaving, doneSaving)
		patchDeck({id: newId})
	}, [!canSave || isSaving, deck, patchDeck])

	return section(
		{ id: "deck-builder", className: "flex hcenter gutter-t-2" },
		div(
			{ 
				className: "deck-preview box-xs-12 box-s-10 box-m-6",
				style: { paddingBottom: previewHeight + "px"}
			},
			div(
				{ 
					className: "preview-content gutter-rl-2", 
					ref: fixedDisplayRef, 
					style: {
						width: useableWidth + "px"
					} 
				},
				div({ className: "flex vhcenter" }, 
					div({ className: "gutter-rl" },
						translate("deck_size"),
						": ",
						deckCardsToRender.reduce((sum, cardMetaData)=>sum+cardMetaData.count, 0)
					),
				),
				createElement(
					svgRefference.Provider,
					{ value: {
						current: svgRef,
						setRef: updateSvgRef,
					} },
					deckView({ cards: deckCardsToRender, loading: isExporting }),
				),
				div({ className: "flex vhcenter gutter-b" }, 
					div(
						{ className: "gutter-rl-.5" },
						button(
							{
								className: `gutter-trbl-.5 ${deck.id ? "" : "hide"}`,
								onClick: ()=>{
									deleteCard(deck.id).then(()=>{
										document.location.reload()
									})
								}
							},
							strong(translate("delete_deck"))
						)
					),
					div(
						{ className: "gutter-rl-.5" },
						button(
							{
								className: "gutter-trbl-.5",
								[(canSave || !setisSaving ? "data-foo" : "disabled")]: true,
								onClick: saveDeck
							},
							strong(translate("save_deck"))
						)
					),
					div(
						{ className: "gutter-rl-.5" },
						button(
							{
								className: "gutter-trbl-.5",
								[(isExporting ? "disabled" : "data-foo")]: true,
								onClick: exportCard
							},
							strong(translate("export"))
						)
					),
				)
			),
		),
		div(
			{ className: "card-finder box-xs-12 box-s-10 box-m-6" },

			nav(
				{ className: "flex card-list-options gutter-t-.5" },
				div(
					{ 
						className: (selectedTab === "rito" ? "active " : "" ) + "tab-header box-4 gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("rito"),
					}, 
					translate("official_cards")
				),
				div(
					{ 
						className: (selectedTab === "custom" ? "active " : "" ) + "tab-header box-4 gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("custom"),
					}, 
					translate("custom_cards")
				),
				div(
					{ 
						className: (selectedTab === "inDeck" ? "active " : "" ) + "tab-header box-4 gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("inDeck"),
					}, 
					translate("currently_selected_cards")
				),
			),
			
			div(
				{ className: "tab-body" },

				selectedTab === "rito" 
					? div(
						{ className: "gutter-rl" },

						ritoCardsFiltersUi({
							refreshRitoData: loadRitoData,
							refreshRitoLoading: ritoLoading,
							filterOptions: ritoCardsFilterOptions,
							updateSelectedFilters: patchRitoCardsFilters,
							updateSelectedFilter: patchRitocardsFilter,
							selectedFilters: currentRitoCardsFilters
						}),

						div(
							{ className: "card-name-list" },

							listLimit(
								{ defaultSize: 24 },
								(displayedRitoCards || []).map(card=>card
									? div(
										{ className: "flex gutter-b", key: card.cardCode },
	
										cardName({ card, className: "box-9" }, card.name),
	
										div(
											{ className: "box-3 flex no-wrap" },
											button({ className: "grow gutter-trbl-.5", onClick: ()=>addCard(card) }, 
												div({ className: "icon" },
													div({ className: "add" }),
												)
											),
											div({ className: "gutter-rl-.25" }),
											button({ className: "grow gutter-trbl-.5", onClick: ()=>removeCard(card) }, 
												div({ className: "icon" },
													div({ className: "minus" }),
												)
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
											? div({ className: "icon" }, 
												div({ className: "loading" })
											)
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

				selectedTab === "custom" 
					? div(
						{ className: "gutter-rl" },

						customCardsFiltersUi({
							filterOptions: customCardsFilterOptions,
							updateSelectedFilters: patchCustomCardsFilters,
							updateSelectedFilter: patchCustomcardsFilter,
							selectedFilters: currentCustomCardsFilters,
						}),

						div(
							{ className: "card-name-list" },
							listLimit(
								{ defaultSize: 24 },
								(displayedCustomCards || []).map(card=>card
									? div(
										{ className: "flex gutter-b", key: card.id },

										cardName({ card, className: "box-9" }, card.name),

										div(
											{ className: "box-3 flex no-wrap" },
											button({ className: "grow gutter-trbl-.5", onClick: ()=>addCard(card) }, 
												div({ className: "icon" },
													div({ className: "add" }),
												)
											),
											div({ className: "gutter-rl-.25" }),
											button({ className: "grow gutter-trbl-.5", onClick: ()=>removeCard(card) }, 
												div({ className: "icon" },
													div({ className: "minus" }),
												)
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

				selectedTab === "inDeck" 
					? div(
						{ className: "gutter-rl" },

						div(
							{ className: "card-name-list gutter-t" },
							listLimit(
								{ defaultSize: 24 },
								(deckCardsListOrder || []).map(cardMeta=>cardMeta
									? div(
										{ className: "flex gutter-b", key: cardMeta.card.id || cardMeta.card.cardCode },
	
										cardName({ card: cardMeta.card, className: "box-9" }, cardMeta.card.name),
	
										div(
											{ className: "box-3 flex no-wrap" },
											button({ className: "grow gutter-trbl-.5", onClick: ()=>addCard(cardMeta.card) }, 
												div({ className: "icon" },
													div({ className: "add" }),
												)
											),
											div({ className: "gutter-rl-.25" }),
											button({ className: "grow gutter-trbl-.5", onClick: ()=>removeCard(cardMeta.card) }, 
												div({ className: "icon" },
													div({ className: "minus" }),
												)
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
			),
		)
	)
}

export default factory(deckBuilderComponenet, cssLoaded)
