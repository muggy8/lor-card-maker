(function(template){
	let controller = {}

	let focus = controller.focus = function(){
		App.currentView = view
		clearCard()
	}

	let card = controller.card = {}
	let clearCard = controller.clearCard = function(){
		card.name = ""
		card.effect = ""
		card.keywords = []
		card.mana = 0
		card.art = ""
	}
	clearCard()

	let createPreview = controller.createPreview = function(){

	}

	App.spellBuilder = controller
	let view = proxymity(template, controller)
})(`
	<main class="flex hcenter">
		<div class="card-preview box-xs-12 box-s-10 box-m-6 box-l-4 box-xl-3">
			{:this.app.createPreview():}|{card.name},{card.effect},{card.keywords.length},{card.mana},{card.art}|
		</div>
		<div class="card-configs box-xs-12 box-s-10 box-m-6 box-l-4 box-xl-3"></div>
	</main>
`)