import concurrencyManagerFactory from "/Utils/concurrency-manager.js"

export function getCardList(){
    return fetch("/pseudo-api/card-list/").then(res=>res.json())
}

export function getCard(id){
    return fetch("/pseudo-api/card/" + id).then(res=>res.json())
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


export function getSettings(){
    return fetch("/pseudo-api/settings/").then(res=>res.json())
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

export function getRitoCards(){
	return fetch("/pseudo-api/game-data/card-list/").then(res=>res.json())
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

export async function getLatestRitoData(){
	const coreDataUrl = "https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon/core/data/globals-en_us.json"

	const coreData = await fetch(coreDataUrl).then(res=>res.json())

	console.log(coreData)

	const fetchJobs = coreData.sets.map(expantion=>{
		const setNameLowerCase = expantion.nameRef.toLowerCase()

		const expantionDataUrl = `https://cdn.jsdelivr.net/gh/InFinity54/LoR_DDragon_${setNameLowerCase}/data/${setNameLowerCase}-en_us.json`

		return fetch(expantionDataUrl)
			.then(res=>res.json())
			.then(data=>{
				expantion.data = data
			})
			.catch(()=>{})
	})

	await Promise.all(fetchJobs)

	coreData.sets.filter(expantion=>expantion.data)

	console.log(coreData)

	return coreData
}
