import factory, { div, button, strong, section } from "/Utils/elements.js"
import { useState, useCallback, useContext, createContext, useRef, useLayoutEffect, useEffect } from "/cdn/react"
import { getRitoCards, patchRitoCards, getLatestRitoData } from "/Utils/service.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"

function deckBuilderComponenet(props){

	const [ritoCards, updateRitoCards] = useState()
	useEffect(()=>{
		getRitoCards(updateRitoCards)
	}, [])

	const loadRitoData = useCallback(()=>{
		getLatestRitoData().then(async ritoData => {
			await patchRitoCards(ritoData)
			updateRitoCards(ritoData)
		})
	}, [])

	return div(
		button({onClick: loadRitoData}, "Update LoR Game Data")
	)
}

export default factory(deckBuilderComponenet)
