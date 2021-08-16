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
		return function(cardData, cardId){
			let storedCards = localStorage.getItem(key)
			storedCards = storedCards 
				? JSON.parse(storedCards) 
				: []

			let newCardId = Date.now().toString()

			if (!cardId){
				storedCards.push(newCardId)
				cardId = newCardId
			}

			localStorage.setItem(key, JSON.stringify(storedCards))

			localStorage.setItem(cardId, JSON.stringify(cardData))

			return cardId
		}
	}

	function cardGetterFactory(key){
		return function(){
			let storedCards = localStorage.getItem(key)
			storedCards = storedCards 
				? JSON.parse(storedCards) 
				: []

			return storedCards.map(function(cardId){
				return {
					id: cardId,
					cardData: JSON.parse(localStorage.getItem(cardId))
				}
			})
		}

	}

	function cardDeleterFactory(key){
		return function(id){
			let storedCards = localStorage.getItem(key)
			storedCards = storedCards 
				? JSON.parse(storedCards) 
				: []

			let storedIndex = storedCards.indexOf(id)
			
			if (storedIndex > -1){
				storedCards.splice(storedIndex, 1)
			}

			localStorage.setItem(key, JSON.stringify(storedCards))

			localStorage.removeItem(id)

			return !!storedIndex
		}

	}
})()