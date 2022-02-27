(function(){
	let controller = Object.create(App.unitController)

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

	controller.framePath = "/assets/champion/frame2"

	let view = proxymity(controller.template, controller)

	controller.focus = controller.focusFactory(view, "championLv2Builder", "Champion Lv2 Builder")
})()
