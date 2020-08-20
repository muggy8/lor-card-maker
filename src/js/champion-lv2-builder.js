(function(template){
	let controller = {}

	let focus = controller.focus = function(){
		iconCache.promise.then(()=>{
			App.currentView = view
			clearCard()
			window.scroll(0,0)
		})
	}

	let card = controller.card = {}
	let cardEffectMinSize = 24
	let clearCard = controller.clearCard = function(){
		card.name = ""
		card.clan = ""
		card.effect = ""
		card.keywords = []
		card.mana = 0
		card.art = ""
		card.transform = {
			x: 0,
			y: 0,
			scale: 1,
		}
		card.power = 0
		card.health = 0
		card.rarity = "none"
		card.faction = ""
		card.blueWords = []
		card.orangeWords = []
		card.effectFontSize = 34 // min should be 24
	}
	clearCard()

	let createPreview = controller.createPreview = function(){

	}

	App.championLv2Builder = controller
	let view = proxymity(template, controller)
})(`
	<main class="flex hcenter gutter-rl-.5">
		<div class="card-preview gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.createPreview():}|{card.name},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.transform.x},{card.transform.y},{card.transform.scale},{card.rarity},{card.faction},{card.clan},{card.blueWords.*},{card.orangeWords.*}|

			<div class="flex hcenter gutter-tb">
				<button onclick="this.app.exportCard()">Export</button>
			</div>

			<div class="gutter-b-3"></div>
		</div>
		<div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.cardOptionsController = App.cardOptions(this.app.card, [
				"gemless",
				"common",
				"rare",
				"epic",
			]):}
		</div>
	</main>
`)