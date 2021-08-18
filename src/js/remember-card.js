(function(){
	App.storage = {
		saveFollower: cardSaverFactory("follower"),
		saveChampion1: cardSaverFactory("champion1"),
		saveChampion2: cardSaverFactory("champion2"),
		saveLandmark: cardSaverFactory("landmark"),
		saveSpell: cardSaverFactory("spell"),
		getSavedFollower: cardGetterFactory("follower"),
		getSavedChampion1: cardGetterFactory("champion1"),
		getSavedChampion2: cardGetterFactory("champion2"),
		getSavedLandmark: cardGetterFactory("landmark"),
		getSavedSpell: cardGetterFactory("spell"),
		delSavedFollower: cardDeleterFactory("follower"),
		delSavedChampion1: cardDeleterFactory("champion1"),
		delSavedChampion2: cardDeleterFactory("champion2"),
		delSavedLandmark: cardDeleterFactory("landmark"),
		delSavedSpell: cardDeleterFactory("spell"),
	}

	function cardSaverFactory(key){
		return async function(cardData, cardId){
			let storedCards
			try{
				storedCards = await fetch("./pseudo-api/card-list/" + key).then(res=>res.json())
			}
			catch(uwu){
				console.error(uwu)
				storedCards = []
			}

			let newCardId = Date.now().toString()

			if (!cardId){
				cardId = newCardId
				storedCards.push(cardId)
			}

			await fetch("./pseudo-api/card-list/" + key, {
				method: "POST",
				headers: {
		      'Content-Type': 'application/json'
		    },
				body: JSON.stringify(storedCards)
			})

			await fetch("./pseudo-api/card/" + cardId, {
				method: "POST",
				headers: {
		      'Content-Type': 'application/json'
		    },
				body: JSON.stringify(cardData)
			})

			return cardId
		}
	}

	function cardGetterFactory(key){
		return async function(){
			let storedCards
			try{
				storedCards = await fetch("./pseudo-api/card-list/" + key).then(res=>res.json())
			}
			catch(uwu){
				console.error(uwu)
				storedCards = []
			}

			console.log(storedCards)

			return Promise.all(storedCards.map(async function(cardId){
				return {
					id: cardId,
					cardData: await fetch("./pseudo-api/card/" + cardId).then(res=>res.json())
				}
			}))
		}

	}

	function cardDeleterFactory(key){
		return async function(id){
			let storedCards
			try{
				storedCards = await fetch("./pseudo-api/card-list/" + key).then(res=>res.json())
			}
			catch(uwu){
				console.error(uwu)
				storedCards = []
			}

			let storedIndex = storedCards.indexOf(id)

			if (storedIndex > -1){
				storedCards.splice(storedIndex, 1)
			}

			await fetch("./pseudo-api/card-list/" + key, {
				method: "POST",
				headers: {
		      'Content-Type': 'application/json'
		    },
				body: JSON.stringify(storedCards)
			})

			await fetch("./pseudo-api/card/" + id, {
				method: "DEL",
				headers: {
		      'Content-Type': 'application/json'
		    },
				body: JSON.stringify({key: key})
			})

			return !!storedIndex
		}

	}
})()
