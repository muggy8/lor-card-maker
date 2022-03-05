(function(){
	let controller = Object.create(App.unitController)
	controller.attached = false

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveChampion2(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedChampion2(context.cardId)
		window.location.reload()
	}

	App.championLv2Builder = controller

	controller.gemOptions = [
		"gemless",
		"gem",
	]

	controller.rendererOptions = {
		framePath: "/assets/champion/frame2",
		clan: {
			bgPath: "/assets/champion/typing.png"
		},
		region: {
			bgPath: "/assets/regions/champion2/regionbox",
		},
	}

	let view = controller.generateView()

	controller.focus = controller.focusFactory(view, "championLv2Builder", "Champion Lv2 Builder")
})()
