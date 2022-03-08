(function(){
	App.storage = {
		saveFollower: cardSaverFactory("follower"),
		saveChampion1: cardSaverFactory("champion1"),
		saveChampion2: cardSaverFactory("champion2"),
		saveChampion3: cardSaverFactory("champion3"),
		saveLandmark: cardSaverFactory("landmark"),
		saveKeyword: cardSaverFactory("keyword"),
		saveSpell: cardSaverFactory("spell"),

		getSavedFollower: cardGetterFactory("follower"),
		getSavedChampion1: cardGetterFactory("champion1"),
		getSavedChampion2: cardGetterFactory("champion2"),
		getSavedChampion3: cardGetterFactory("champion3"),
		getSavedLandmark: cardGetterFactory("landmark"),
		getSavedKeyworkd: cardGetterFactory("keyword"),
		getSavedSpell: cardGetterFactory("spell"),
		
		delSavedFollower: cardDeleterFactory("follower"),
		delSavedChampion1: cardDeleterFactory("champion1"),
		delSavedChampion2: cardDeleterFactory("champion2"),
		delSavedChampion3: cardDeleterFactory("champion3"),
		delSavedLandmark: cardDeleterFactory("landmark"),
		delSavedKeyword: cardDeleterFactory("keyword"),
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

			let cleanProcess = storedCards.map(async function(cardId){
				try{
					let existingCard = await fetch("./pseudo-api/card/" + cardId).then(res=>res.json())
					if (existingCard.name){
						return cardId
					}
					return false
				}
				catch(uwu){
					return false
				}
			})

			storedCards = (await Promise.all(cleanProcess)).filter(id=>!!id)

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

			storedCards = await Promise.all(storedCards.map(async function(cardId){
				return {
					id: cardId,
					cardData: await fetch("./pseudo-api/card/" + cardId).then(res=>res.json()).then(cardData=>{
						// here we convert old data if we need to.
						if (typeof cardData.faction === "string"){
							cardData.faction = [cardData.faction]
						}
						return cardData
					})
				}
			}))

			return storedCards.filter(card=>card.cardData.name)

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
