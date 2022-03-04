(function(){
	let controller = Object.create(App.unitController)

	controller.clearCard = function(){
		App.unitController.clearCard.call(this)
		let card = controller.card
		delete card.power
		delete card.health
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

	controller.framePath = "/assets/landmark/frame"

	let view = controller.generateView()

	controller.focus = controller.focusFactory(view, "landmarkBuilder", "Landmark Builder")

	App.landmarkBuilder = controller
})()
