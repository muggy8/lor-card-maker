const App = (function(){
	let controller = {
		currentView: undefined,
	}
	let view = proxymity(document.body, controller)

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
	}

	return controller
})()
