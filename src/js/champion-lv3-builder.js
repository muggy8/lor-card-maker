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

	controller.rendererOptions = {
		framePath: "/assets/champion/frame3",
		clan: {
			bgPath: "/assets/champion/typing.png"
		},
		region: {
			bgPath: "/assets/regions/champion3/regionbox",
			offsetBottom: 11,
			offsetRight: 6,
		},
	}

	let view = controller.generateView()

	controller.focus = controller.focusFactory(view, "championLv3Builder", "Champion Lv3 Builder")
})()
