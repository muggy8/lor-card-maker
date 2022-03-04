(function(){
	let controller = Object.create(App.unitController)

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveChampion1(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedChampion1(context.cardId)
		window.location.reload()
	}

	App.championLv1Builder = controller

	controller.gemOptions = [
		"gemless",
		"gem",
	]

	controller.rendererOptions = {
		framePath: "/assets/champion/frame1",
		clan: {
			bgPath: "/assets/champion/typing.png"
		},
		region: {
			bgPath: "/assets/regions/champion1/regionbox",
		},
	}

	let view = controller.generateView()

	controller.focus = controller.focusFactory(view, "championLv1Builder", "Champion Lv1 Builder")
})()
