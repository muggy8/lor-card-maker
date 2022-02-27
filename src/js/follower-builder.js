(function(){
	let controller = Object.create(App.unitController)

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveFollower(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedFollower(context.cardId)
		window.location.reload()
	}

	App.followerBuilder = controller

	controller.gemOptions = [
		"gemless",
		"common",
		"rare",
		"epic",
	]

	controller.framePath = "/assets/follower/frame"

	let view = proxymity(controller.template, controller)

	controller.focus = controller.focusFactory(view, "followerBuilder", "Follower Builder")
})()
