import { mergeDeep } from "./use-filter.js"
import concurrencyManagerFactory from "/Utils/concurrency-manager.js"

function createQueryString (query){
	const queryProps = Object.keys(query)
	if (!queryProps.length){
		return ""
	}

	const queryParamPairs = []
	queryProps.forEach(queryProp=>{
		let queryValue = query[queryProp]
		if (typeof queryValue === "undefined"){
			return
		}
		Array.isArray(queryValue) && (queryValue = queryValue.join(","))
		queryValue && queryParamPairs.push([queryProp, queryValue].join("="))
	})

	return "?" + queryParamPairs.join("&")
}

export function getCardList(query = {}){
    return fetch("/pseudo-api/card-list/" + createQueryString(query)).then(res=>res.json())
}

export function getBackup(query = {}){
    return fetch("/pseudo-api/backup/" + createQueryString(query)).then(res=>res.json())
}

export function getCard(id, query = {}){
    return fetch("/pseudo-api/card/" + id  + createQueryString(query)).then(res=>res.json())
}

export function saveCard(id, data){
    return fetch("/pseudo-api/card/" + id, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export function deleteCard(id){
    return fetch("/pseudo-api/card/" + id, {
        method: "DEL",
    })
}


export function getSettings(query = {}){
    return fetch("/pseudo-api/settings/" + createQueryString(query)).then(res=>res.json())
}

export function saveSettings(data){
    return fetch("/pseudo-api/settings/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export function getRitoCards(query = {}){
	return fetch("/pseudo-api/game-data/card-list/" + createQueryString(query)).then(res=>res.json())
}

const patchManager = concurrencyManagerFactory()
export function patchRitoCards(updatedData){
	return new Promise((accept, reject)=>{
		patchManager.sequential(async ()=>{
			const currentData = await getRitoCards()
			const newData = {
				...currentData,
				...updatedData,
			}

			return fetch("/pseudo-api/game-data/card-list/", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newData)
			}).then(accept, reject)
		})
	})
}

export async function getLatestRitoData(query = {}, language="en_us"){
	query.t = Date.now()
	const queryString = createQueryString(query)
	const coreDataUrl = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon/core/data/globals-${language}.json` + queryString

	const coreData = await fetch(coreDataUrl).then(res=>res.json())

	const fetchJobs = coreData.sets.map(expantion=>{
		const setNameLowerCase = expantion.nameRef.toLowerCase()

		const expantionDataUrl = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_${setNameLowerCase}/data/${setNameLowerCase}-${language}.json${queryString}`

		return fetch(expantionDataUrl)
			.then(res=>res.json())
			.then(data=>{
				expantion.data = data
			})
			.catch(()=>{})
	})

	await Promise.all(fetchJobs)

	coreData.sets.filter(expantion=>expantion.data)

	return coreData
}

export async function getRitoPoCItemRelic(query = {}, baseValue){
	return fetch("/pseudo-api/game-data/poc-item-relic-list/" + createQueryString(query))
		.then(res=>res.json())
		.then(relicItemData=>mergeDeep(baseValue, relicItemData))
}

export function patchRitoPocItemRelic(updatedData){
	return new Promise((accept, reject)=>{
		patchManager.sequential(async ()=>{
			const currentData = await getRitoPoCItemRelic()
			const newData = {
				...currentData,
				...updatedData,
			}

			return fetch("/pseudo-api/game-data/poc-item-relic-list/", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newData)
			}).then(accept, reject)
		})
	})
}

export async function getLatestPoCItemRelicData(query = {}, language="en_us"){
	query.t = Date.now()
	const queryString = createQueryString(query)

	const itemDataUrl = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_Adventure/data/items-${language}.json` + queryString
	const relicDataUrl = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_Adventure/data/relics-${language}.json` + queryString

	const [itemData, relicData] = await Promise.all([
		fetch(itemDataUrl).then(res=>res.json()),
		fetch(relicDataUrl).then(res=>res.json()),
	])

	Array.prototype.forEach.call(itemData, item=>{
		item.url = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_Adventure/img/items/${language}/${item.itemCode}.png${queryString}`
		item.urlFull = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_Adventure/img/items/${language}/${item.itemCode}-full.png${queryString}`
	})

	Array.prototype.sort.call(itemData, sortSticker)

	Array.prototype.forEach.call(relicData, relic=>{
		relic.url = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_Adventure/img/relics/${language}/${relic.relicCode}.png${queryString}`
		relic.urlFull = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_Adventure/img/relics/${language}/${relic.relicCode}-full.png${queryString}`
	})

	Array.prototype.sort.call(relicData, sortSticker)

	return {
		items: itemData,
		relics: relicData,
	}

	function sortSticker(itemA, itemB){
		return (getRarityPoints(itemA.rarityRef) - getRarityPoints(itemB.rarityRef)) || itemA.name.localeCompare(itemB.name)
	}

	function getRarityPoints(rarity){
		switch(rarity){
			case "common":
			case "Common":
			case "COMMON":
				return 1
			case "rare":
			case "Rare":
			case "RARE":
				return 2
			case "epic": 
			case "Epic": 
			case "EPIC": 
				return 3
			case "legendary":
			case "Legendary":
			case "LEGENDARY":
			case "champion":
			case "Champion":
			case "CHAMPION":
				return 4
			default: return Infinity
		}
	}
}

const ritoCardImageCache = {}
export function getRitoCardImage(setCode, cardCode, query = {}, language="en_us"){
	if (ritoCardImageCache[setCode] && ritoCardImageCache[setCode][cardCode]){
		return ritoCardImageCache[setCode][cardCode]
	}

	ritoCardImageCache[setCode] = ritoCardImageCache[setCode] || {}

	const setNameLowerCase = setCode.toLowerCase()
	query.t = Date.now()

	return ritoCardImageCache[setCode][cardCode] = fetch(`https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_${setNameLowerCase}/img/cards/${language}/${cardCode}.png?${createQueryString(query)}`)
        .then(res=>res.blob())
        .then(blob=>{
            const reader = new FileReader()
            return new Promise(accept=>{
                reader.addEventListener("load", () => {
                    accept(reader.result)
                }, false)
                reader.readAsDataURL(blob)
            })
        })
}

const ritoSetIconCache = {}
export function getRitoSetIconData(setId, query = {}, language="en_us"){
	if (ritoSetIconCache[setId]){
		return ritoSetIconCache[setId]
	}
	// const url = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon/core/img/sets/${setId.toLowerCase()}.png`
	query.t = Date.now()

	return ritoSetIconCache[setId] = new Promise(async (accept, reject)=>{
		const coreDataUrl = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon/core/data/globals-${language}.json` + createQueryString(query)
		const coreData = await fetch(coreDataUrl).then(res=>res.json())

		const selectedSetMetadata = Array.prototype.find.call(coreData.sets, setMetaData=>{
			return setMetaData.nameRef === setId
		})

		if (!selectedSetMetadata){
			delete ritoSetIconCache[setId]
			reject(new Error("Unknown Set"))
		}

		const pathMatch = /img\/sets\/([^\/\n]+)$/gmi.exec(selectedSetMetadata.iconAbsolutePath)
		const iconUrl = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon/core/${pathMatch[0].replace("_crispmip", "")}`

		const blob = await fetch(iconUrl).then(res=>res.blob())
		const reader = new FileReader()
		reader.addEventListener("load", () => {
			accept({
				url: reader.result,
				name: selectedSetMetadata.name
			})
		}, false)
		reader.readAsDataURL(blob)
	})
}