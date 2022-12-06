import factory, { div, button, strong, section } from "/Utils/elements.js"
import { useState, useCallback, useContext, createContext, useRef, useLayoutEffect, useEffect } from "/cdn/react"
import { getRitoCards, patchRitoCards, getLatestRitoData } from "/Utils/service.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"

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

	const [ritoCards, updateRitoCards] = useState()
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
			{ className: "deck-preview gutter-t-2 box-xs-12 box-s-10 box-m-8 box-l-9 box-xl-10" }
		),
		div(
			{ className: "card-finder gutter-t-2 box-xs-12 box-s-10 box-m-4 box-l-3 box-xl-2" },
			button({onClick: loadRitoData}, "Update LoR Game Data")
		)
	)
}

export default factory(deckBuilderComponenet, cssLoaded)
