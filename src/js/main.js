const App = (function(){
	let controller = {
		currentView: undefined,
	}
	let view = proxymity(document.body, controller)

	window.addEventListener("popstate", function(ev){
		let state = ev.state

		state.focus && App[state.focus].focus()
	})

	return controller
})()
