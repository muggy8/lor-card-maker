window.App = window.App || {}; 
(function(controller){
	controller.currentView = undefined
	controller.showSidebar = false
	controller.langChoice = localStorage.getItem("lang") || "en"
	
	let view = proxymity(document.body, controller)

	proxymity.watch(controller, "currentView", function(attachedView, detachedView){
		attachedView && (attachedView.app.attached = true)
		detachedView &&( detachedView.app.attached = false)
	})

	window.addEventListener("popstate", function(ev){
		let state = ev.state

		state.focus && App[state.focus].focus()
	})

	window.addEventListener("resize", function(ev){
		controller.windowResize = !controller.windowResize
	})
	controller.windowResize = !controller.windowResize


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

		controller.loading.start()
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

			controller.loading.stop()
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

				controller.loading.start()
				let json = JSON.parse(reader.result)
				let startingPromise = Promise.resolve()
				let champions1Task = json.savedChampions1 ? json.savedChampions1.reduce(
					(lastTask, card)=>lastTask.then(
						_=>App.storage.saveChampion1(card.cardData, card.id)
					),
					startingPromise
				) : Promise.resolve()
				let champions2Task = json.savedChampions2 ? json.savedChampions2.reduce(
					(lastTask, card)=>lastTask.then(
						_=>App.storage.saveChampion2(card.cardData, card.id)
					),
					startingPromise
				) : Promise.resolve()
				let champions3Task = json.savedChampions3 ? json.savedChampions3.reduce(
					(lastTask, card)=>lastTask.then(
						_=>App.storage.saveChampion3(card.cardData, card.id)
					),
					startingPromise
				) : Promise.resolve()
				let followerTask = json.savedFollowers ? json.savedFollowers.reduce(
					(lastTask, card)=>lastTask.then(
						_=>App.storage.saveFollower(card.cardData, card.id)
					),
					startingPromise
				) : Promise.resolve()
				let landmarkTask = json.savedLandmarks ? json.savedLandmarks.reduce(
					(lastTask, card)=>lastTask.then(
						_=>App.storage.saveLandmark(card.cardData, card.id)
					),
					startingPromise
				) : Promise.resolve()
				let spellTask = json.savedSpells ? json.savedSpells.reduce(
					(lastTask, card)=>lastTask.then(
						_=>App.storage.saveSpell(card.cardData, card.id)
					),
					startingPromise
				) : Promise.resolve()
				let keywordTask = json.savedKeywords ? json.savedKeywords.reduce(
					(lastTask, card)=>lastTask.then(
						_=>App.storage.saveKeyword(card.cardData, card.id)
					),
					startingPromise
				) : Promise.resolve()

				let process = [champions1Task, champions2Task, champions3Task, followerTask, landmarkTask, spellTask, keywordTask]
				Promise.all(process).then(()=>{
					controller.loading.stop()
					document.location.reload()
				}).catch((uwu)=>{
					console.warn(uwu)
					controller.loading.stop()
					alert("corrupted file. please try a different file")
				})
			}
			catch(uwu){
				console.warn(uwu)
				controller.loading.stop()
				alert("corrupted file. please try a different file")
			}
		})

		if (file){
			reader.readAsText(file)
			controller.showSidebar = false
		}
	}

	controller.loading = {
		startingView:undefined,
		start: function(){
			if (controller.currentView === controller.loading.view){
				return
			}
			controller.loading.startingView = controller.currentView
			controller.currentView = controller.loading.view
		},
		stop: function(){
			if (!controller.loading.startingView){
				return
			}
			controller.currentView = controller.loading.startingView
			controller.loading.startingView = undefined
		},
		view: proxymity(`
			<main id="main-loading" class="flex vhcenter">
				<div class="icon">
					<div class="loading"></div>
				</div>
			</main>
		`, controller)
	}

	return controller
})(App)
