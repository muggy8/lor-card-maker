(function(){
	let controller = Object.create(App.unitController)

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveLandmark(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedLandmark(context.cardId)
		window.location.reload()
	}

	controller.gemOptions = [
		"gemless",
		"common",
		"rare",
		"epic",
	]

	controller.framePath = "/assets/landmark/frame"

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

	let view = proxymity(controller.template, controller)

	controller.focus = controller.focusFactory(view, "landmarkBuilder", "Landmark Builder")

	App.landmarkBuilder = controller
})()
