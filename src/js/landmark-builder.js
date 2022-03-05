(function(){
	let controller = Object.create(App.unitController)
	controller.attached = false

	controller.clearCard = function(){
		let controller = this
		App.unitController.clearCard.call(controller)
		let card = controller.card
		delete card.power
		delete card.health
		card.keywords.push("landmark")
	}

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveLandmark(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedLandmark(context.cardId)
		window.location.reload()
	}

	controller.artMask = `
		<clipPath id="art-mask">
			<path
				d="
					M 50, 60
					h 580
					v 830
					l -290, 65
					l -290, -65
					Z
				"
			/>
		</clipPath>
	`

	controller.gemOptions = [
		"gemless",
		"common",
		"rare",
		"epic",
	]

	controller.rendererOptions = {
		framePath: "/assets/landmark/frame",
		clan: {
			bgPath: "/assets/landmark/typing.png"
		},
		region: {
			bgPath: "/assets/regions/landmark/regionbox",
		},
	}

	let view = controller.generateView()

	controller.focus = controller.focusFactory(view, "landmarkBuilder", "Landmark Builder")

	App.landmarkBuilder = controller
})()
