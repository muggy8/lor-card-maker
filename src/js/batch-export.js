(function(template){

	let controller = App.batchExporter = Object.create(App.baseBuilderController)

	let includedCards = controller.includedCards = []
	controller.cardWidth = 680
	controller.cardHeight = 1024

	let view = proxymity(template, controller)

	controller.focus = function(){
		if (App.currentView === view){
			return
		}
		App.currentView = view
		window.scroll(0,0)
		history.pushState({
			focus: "batchExporter"
		}, "Batch Export")

		App.getSavedCards(controller)
	}

	controller.mbShowConfigs = false
	controller.toggleMBShow = function(){
		controller.mbShowConfigs = !controller.mbShowConfigs

		if (controller.mbShowConfigs === false){
			history.back()
		}
		else{
			history.pushState({}, "Configuring Card")
		}
	}

	controller.addToExport = function(cardTypeController, cardData, cardId){
		
		includedCards.push({
			hostController: cardTypeController,
			cardData: cardData,
			id: cardId,
		})
	}

	controller.createPreview = function(cardData, cardTypeController){
		
		let customeController = Object.create(Object.getPrototypeOf(cardTypeController))
		Object.assign(customeController, cardTypeController)
		customeController.clearCard()
		App.cardTypePicker.transferData(customeController.card, cardData)
		return customeController.createPreview()
	}

})(`
	<main class="flex hcenter">

		<div class="export-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			<svg
				width="{:this.app.cardWidth * (this.app.includedCards.length > 1 ? 2 : this.app.includedCards.length):}|{includedCards.len}|"
				height="{:this.app.cardHeight * Math.ceil(this.app.includedCards.length/2):}|{includedCards.len}|"
				xmlns="http://www.w3.org/2000/svg"
				viewbox="0 0 {:this.app.cardWidth * (this.app.includedCards.length > 1 ? 2 : this.app.includedCards.length):}|{includedCards.len}| {:this.app.cardHeight * Math.ceil(this.app.includedCards.length/2):}|{includedCards.len}|"
				data-init="{:this.app.cardInstance = this:}"
			>
				<!-- forEach: "index" -->
					<g transform="translate({: this.app.cardWidth * (this.index % 2) :}, {: this.app.cardHeight * (Math.floor(this.index / 2)) :})">
						{:this.app.createPreview(this.app.includedCards[this.index].cardData, this.app.includedCards[this.index].hostController) :}|{includedCards[this.index].id}|
					</g>
				<!-- in: includedCards -->
			</svg>
		</div>

		<div class="export-includes-choices gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			<div class="mobile-config-footer gutter-trbl flex hcenter clickable" onclick="this.app.toggleMBShow()" data-init="{: document.body.style.setProperty('--footer-height', this.offsetHeight + 'px') :}|{ mbShowConfigs }|">
				<strong>Select Exports</strong>
			</div>
			<div class="slide-up gutter-tb gutter-rl-.5 flex {:this.app.mbShowConfigs ? 'active' : '':}|{mbShowConfigs}|">

				<!-- forEach: "index" -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable"onclick="this.app.addToExport(App.championLv1Builder, this.app.savedChampions1[this.index].cardData, this.app.savedChampions1[this.index].id)">
					<strong>Include {: this.app.savedChampions1[this.index].cardData.name :}</strong>
					<div>
						{:this.app.createPreview(this.app.savedChampions1[this.index].cardData, App.championLv1Builder) :}|{savedChampions1[this.index].id}|
					</div>
				</div>
				<!-- in: savedChampions1 -->

			</div>
		</div>
	</main>

`)
