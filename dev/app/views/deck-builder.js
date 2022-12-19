import factory, { div, button, strong, section } from "/Utils/elements.js"
import { useState, useCallback, useContext, createContext, useRef, useLayoutEffect, useEffect } from "/cdn/react"
import { getRitoCards, patchRitoCards, getLatestRitoData, getCardList } from "/Utils/service.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import useFilter from "/Utils/use-filter.js"
import listLimit from "/Components/list-limit.js"
import cardName from "/Components/deck/card-name.js"
import filterSlider from "/Components/deck/filter-slider.js"

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

function getOptionsFromRitoCardsList(cardList){
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

function deckBuilderComponenet(){

	const translate = useLang()

	const [customCards, updateCustomcards] = useState()
	useEffect(()=>{
		getCardList().then(updateCustomcards)
	}, [])

	const [ritoCards, updateRitoCards] = useState([])
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

	const [displayedRitoCards, updateRitoCardSource, currentFilters, patchFilters] = useFilter({
		collectible: {
			value: true,
			filter: (userSelectedCollectable, collectible)=>{
				return collectible === userSelectedCollectable
			}
		},
		name: {
			filter: (userSelectedName, name)=>{
				return name.toLowerCase().includes(userSelectedName.toLowerCase())
			}
		},
		descriptionRaw: {
			filter: (userSelectedDescription, descriptionRaw)=>{
				return descriptionRaw.toLowerCase().includes(userSelectedDescription.toLowerCase())
			}
		},
		subtypes: {
			filter: (userSelectedSubtype, subtypes)=>{
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

	const patchFilter = useCallback((filterToPatch, patchSettings)=>{
		const patch = {}
		patch[filterToPatch] = patchSettings
		patchFilters(patch)
	}, [patchFilters])

	const [filterOptions, updateFilterOptions] = useState({})

	useEffect(()=>{
		if (!ritoCards || !ritoCards.length){
			return
		}

		updateRitoCardSource(ritoCards)

		if (!displayedRitoCards || !displayedRitoCards.length){
			return
		}

		const baseOptions = getOptionsFromRitoCardsList(ritoCards)
		const filteredResultsOptions = getOptionsFromRitoCardsList(displayedRitoCards)
		const trueOptions = {
			...baseOptions,
			keywords: filteredResultsOptions.keywords,
		}

		updateFilterOptions(trueOptions)
		// console.log(options, ritoCards)
	}, [ritoCards, displayedRitoCards])

	return section(
		{ id: "deck-builder", className: "flex hcenter" },
		div(
			{ className: "deck-preview box-xs-12 box-s-10 box-m-7 box-l-8" }
		),
		div(
			{ className: "card-finder box-xs-12 box-s-10 box-m-5 box-l-4" },
			div(
				{ className: "gutter-rl" },

				filterSlider({
					refreshRitoData: loadRitoData,
					refreshRitoLoading: ritoLoading,
					filterOptions,
					updateSelectedFilters: patchFilters,
					updateSelectedFilter: patchFilter,
					selectedFilters: currentFilters
				}),

				listLimit(
					{ defaultSize: 24 },
					(displayedRitoCards || []).map(card=>card
						? div(
							{ className: "flex gutter-b", key: card.cardCode },

							cardName({ card, className: "box-9" }, card.name),

							div(
								{ className: "box-3 flex no-wrap" },
								button({ className: "grow gutter-trbl-.5" }, 
									div({ className: "icon" },
										div({ className: "add" }),
									)
								),
								div({ className: "gutter-rl-.25" }),
								button({ className: "grow gutter-trbl-.5" }, 
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
			div(),
		)
	)
}

export default factory(deckBuilderComponenet, cssLoaded)
