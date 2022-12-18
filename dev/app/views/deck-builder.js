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

function deckBuilderComponenet(){

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

	const loadRitoData = useCallback(()=>{
		getLatestRitoData().then(async ritoData => {
			await patchRitoCards(ritoData)
			updateRitoCards(getRitoCardsFromDataDump(ritoData))
		})
	}, [])

	const [displayedRitoCards, updateRitoCardSource, currentFilters, patchFilters] = useFilter({
		collectible: {
			value: true,
			filter: (userSelectedValue, filteredPropertyValue)=>{
				return filteredPropertyValue === userSelectedValue
			}
		},
		name: {
			filter: (userSelectedValue, filteredPropertyValue)=>{
				return filteredPropertyValue.toLowerCase().includes(userSelectedValue.toLowerCase())
			}
		},
		descriptionRaw: {
			filter: (userSelectedValue, filteredPropertyValue)=>{
				return filteredPropertyValue.toLowerCase().includes(userSelectedValue.toLowerCase())
			}
		}
	})

	const patchFilter = useCallback((filterToPatch, patchSettings)=>{
		const patch = {}
		patch[filterToPatch] = patchSettings
		patchFilters(patch)
	}, [patchFilters])

	const [filterOptions, updateFilterOptions] = useState({})

	useEffect(()=>{
		updateRitoCardSource(ritoCards)

		const options = ritoCards.reduce((variationCollector, card)=>{
			if (!card){
				return variationCollector
			}

			Object.keys(card).forEach(property=>{
				variationCollector[property] = variationCollector[property] || new Map()

				const value = card[property]
				variationCollector[property].set(value, true)
			})

			return variationCollector
		}, {})


		Object.keys(options).forEach(property=>{
			const valueMap = options[property]
			options[property] = []
			valueMap.forEach((value, key)=>{
				options[property].push(key)
			})
		})

		updateFilterOptions(options)
	}, [ritoCards])

	return section(
		{ id: "deck-builder", className: "flex hcenter" },
		div(
			{ className: "deck-preview box-xs-12 box-s-10 box-m-7 box-l-8" }
		),
		div(
			{ className: "card-finder box-xs-12 box-s-10 box-m-5 box-l-4" },
			div(
				{ className: "gutter-rl" },
				// button({ onClick: loadRitoData }, "update"),

				filterSlider({
					refreshRitoData: loadRitoData,
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
				)
			),
			div(),
		)
	)
}

export default factory(deckBuilderComponenet, cssLoaded)
