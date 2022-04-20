const App = (function(){
	let controller = {
		currentView: undefined,
		showSidebar: false,
	}
	let view = proxymity(document.body, controller)

	proxymity.watch(controller, "currentView", function(attachedView, detachedView){
		attachedView && (attachedView.app.attached = true)
		detachedView &&( detachedView.app.attached = false)
	})

	window.addEventListener("popstate", function(ev){
		let state = ev.state

		state.focus && App[state.focus].focus()
	})

	if ('serviceWorker' in navigator) {
	  controller.swReady = navigator.serviceWorker.register('./service-worker.js', {
		  scope: document.location.pathname,
	  })
		  .then(function(registration) {
		    console.log('Registration successful, scope is:', registration.scope);
		  })
		  .catch(function(error) {
		    console.log('Service worker registration failed, error:', error);
		  });
	}

	controller.getSavedCards = function(controller){
		App.storage.getSavedChampion1().then(data=>controller.savedChampions1 = data)
		App.storage.getSavedChampion2().then(data=>controller.savedChampions2 = data)
		App.storage.getSavedChampion3().then(data=>controller.savedChampions3 = data)
		App.storage.getSavedFollower().then(data=>controller.savedFollowers = data)
		App.storage.getSavedLandmark().then(data=>controller.savedLandmarks = data)
		App.storage.getSavedSpell().then(data=>controller.savedSpells = data)
		App.storage.getSavedKeyworkd().then(data=>controller.savedKeywords = data)
	}

	controller.exportSavedData = function(){
		Promise.all([
			App.storage.getSavedChampion1(),
			App.storage.getSavedChampion2(),
			App.storage.getSavedChampion3(),
			App.storage.getSavedFollower(),
			App.storage.getSavedLandmark(),
			App.storage.getSavedSpell(),
			App.storage.getSavedKeyworkd(),
		])
		.then(savedCards=>{
			let json = {}
			json.savedChampions1 = savedCards[0]
			json.savedChampions2 = savedCards[1]
			json.savedChampions3 = savedCards[2]
			json.savedFollowers = savedCards[3]
			json.savedLandmarks = savedCards[4]
			json.savedSpells = savedCards[5]
			json.savedKeywords = savedCards[6]

			let jsonText = JSON.stringify(json)

			downloadFile(jsonText, "card-data.json", "application/json")

		})

		controller.showSidebar = false
	}

	let downloadFile = controller.downloadFile = function(content, fileName, contentType) {
		var a = document.createElement("a");
		var file = new Blob([content], {type: contentType});
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	}

	controller.importCardDataJson = function(inputElement){
		let reader = new FileReader()
		let file = inputElement.files[0]

		reader.addEventListener("load", function(){
			//~ card.art = reader.result
			try {
				let json = JSON.parse(reader.result)
				let champions1Task = json.savedChampions1.map(card=>App.storage.saveChampion1(card.cardData, card.id))
				let champions2Task = json.savedChampions2.map(card=>App.storage.saveChampion2(card.cardData, card.id))
				let champions3Task = json.savedChampions3.map(card=>App.storage.saveChampion3(card.cardData, card.id))
				let followerTask = json.savedFollowers.map(card=>App.storage.saveFollower(card.cardData, card.id))
				let landmarkTask = json.savedLandmarks.map(card=>App.storage.saveLandmark(card.cardData, card.id))
				let spellTask = json.savedSpells.map(card=>App.storage.saveSpell(card.cardData, card.id))
				let keywordTask = json.savedKeywords.map(card=>App.storage.saveKeyword(card.cardData, card.id))

				let process = [champions1Task, champions2Task, champions3Task, followerTask, landmarkTask, spellTask, keywordTask].flat()
				Promise.all(process).then(()=>{
					document.location.reload()
				}).catch(()=>{
					alert("corrupted file. please try a different file")
				})
			}
			catch(uwu){
				alert("corrupted file. please try a different file")
			}
		})

		if (file){
			reader.readAsText(file)
			controller.showSidebar = false
		}
	}

	return controller
})()
