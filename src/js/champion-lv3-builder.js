(function(){
	let controller = Object.create(App.unitController)

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveChampion3(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedChampion3(context.cardId)
		window.location.reload()
	}

	App.championLv3Builder = controller

	controller.gemOptions = undefined

	controller.framePath = "/assets/champion/frame3"

	let view = controller.generateView()

	controller.focus = controller.focusFactory(view, "championLv3Builder", "Champion Lv3 Builder")
})()
