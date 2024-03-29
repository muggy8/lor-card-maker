(function(){
	let controller = Object.create(App.unitController)
	controller.attached = false

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveFollower(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(id){
		let context = this
		await App.storage.delSavedFollower(id || context.cardId)
		!id && window.location.reload()
	}

	controller.gemOptions = [
		"gemless",
		"common",
		"rare",
		"epic",
	]

	controller.rendererOptions = {
		framePath: "/assets/follower/frame",
		clan: {
			bgPath: "/assets/follower/typing.png"
		},
		region: {
			bgPath: "/assets/regions/follower/regionbox",
			offsetRight: -7
		},
	}

	let view = controller.generateView()

	controller.focus = controller.focusFactory(view, "followerBuilder", "Follower Builder")

	App.followerBuilder = controller
})()
