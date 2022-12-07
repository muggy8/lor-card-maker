import factory, { div, button, strong, section } from "/Utils/elements.js"
import { useState, useCallback, useContext, createContext, useRef, useLayoutEffect, useEffect } from "/cdn/react"
import { getRitoCards, patchRitoCards, getLatestRitoData, getCardList } from "/Utils/service.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import listLimit from "/Components/list-limit.js"
import cardName from "/Components/deck/card-name.js"

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

	return section(
		{ id: "deck-builder", className: "flex hcenter" },
		div(
			{ className: "deck-preview gutter-t-2 box-xs-12 box-s-10 box-m-7 box-l-8" }
		),
		div(
			{ className: "card-finder gutter-t-2 box-xs-12 box-s-10 box-m-5 box-l-4" },
			div(
				{ className: "gutter-rl" },
				button({ onClick: loadRitoData }, "update"),
				listLimit(
					{ defaultSize: 24 },
					(ritoCards || []).map(card=>card 
						? div(
							{ className: "flex gutter-b", key: card.cardCode },

							cardName({ card, className: "box-9" }, card.name),

							div(
								{ className: "box-3 flex no-wrap" },
								button({ className: "grow gutter-trbl-.5" }, "+"),
								div({ className: "gutter-rl-.25" }),
								button({ className: "grow gutter-trbl-.5" }, "-"),
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
