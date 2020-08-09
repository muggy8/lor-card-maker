const App = (function(){
	let controller = {
		currentView: undefined,
	}
	let view = proxymity(document.body, controller)


	return controller
})()