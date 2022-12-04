import factory, { div, button, strong, section } from "/Utils/elements.js"
import { useState, useCallback, useContext, createContext, useRef, useLayoutEffect, useEffect } from "/cdn/react"
import { getRitoCards, patchRitoCards } from "/Utils/service.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import {
	BlobReader,
	ZipReader,
} from "/cdn/zip.js"

const lorDataCoreUrl = "https://dd.b.pvp.net/latest/core-en_us.zip"

function deckBuilderComponenet(props){

	const [ritoCards, updateRitoCards] = useState()
	useEffect(()=>{
		getRitoCards(updateRitoCards)
	}, [])

	const loadRitoData = useCallback(()=>{
		fetch(lorDataCoreUrl)
			.then(res=>res.blob())
			.then(async blob=>{
				const zipFileReader = new BlobReader(blob)
				const zipReader = new ZipReader(zipFileReader)
				const entries = await zipReader.getEntries()

				console.log(entries)
			})
	}, [])

	return div(
		button({onClick: loadRitoData}, "Update LoR Game Data")
	)
}

export default factory(deckBuilderComponenet)
