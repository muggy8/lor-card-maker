(function(template){

	let controller = App.batchExporter = {}

	let view = proxymity(template, controller)

	controller.focus = function(){
			if (App.currentView === view){
				return
			}
			App.currentView = view
			window.scroll(0,0)
			history.pushState({
				focus: "batchExport"
			}, "Batch Export")
	}

})(`

`)
