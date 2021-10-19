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

	return controller
})()
