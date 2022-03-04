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

		includedCards.splice(0, includedCards.length)

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

	controller.toggleExport = function(cardTypeController, cardWithMeta){
		let existIndex = includedCards.findIndex(item=>{
			return item.id === cardWithMeta.id
		})

		if (existIndex > -1){
			includedCards.splice(existIndex, 1)
			cardWithMeta.included = true
		}
		else {
			includedCards.push({
				hostController: cardTypeController,
				cardData: cardWithMeta.cardData,
				id: cardWithMeta.id,
			})
			cardWithMeta.included = false
		}

		
	}

	controller.createPreview = function(cardData, cardTypeController){

		let customeController = Object.create(Object.getPrototypeOf(cardTypeController))
		Object.assign(customeController, cardTypeController)
		customeController.clearCard()
		App.cardTypePicker.transferData(customeController.card, cardData)
		customeController.exporting = true
		return customeController.createPreview()
	}

})(`
	<main class="flex hcenter">

		<div class="export-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			<div class="gutter-rl-2 gutter-tb-4 box-12 flex vhcenter">
				<button class="box-12" onclick="this.app.exportCard(this.app.cardInstance)">Export Selection</button>
			</div>
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
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedChampions1[this.index].included === 'object' || this.app.savedChampions1[this.index].included ? 'ghost' : '' :}|{savedChampions1[this.index].included}|" onclick="this.app.toggleExport(App.championLv1Builder, this.app.savedChampions1[this.index])">
					<strong>Include {: this.app.savedChampions1[this.index].cardData.name :}</strong>
					<div>
						{:this.app.createPreview(this.app.savedChampions1[this.index].cardData, App.championLv1Builder) :}|{savedChampions1[this.index].id}|
					</div>
				</div>
				<!-- in: savedChampions1 -->

				<!-- forEach: "index" -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedChampions2[this.index].included === 'object' || this.app.savedChampions2[this.index].included ? 'ghost' : '' :}|{savedChampions2[this.index].included}|" onclick="this.app.toggleExport(App.championLv2Builder, this.app.savedChampions2[this.index])">
					<strong>Include {: this.app.savedChampions2[this.index].cardData.name :}</strong>
					<div>
						{:this.app.createPreview(this.app.savedChampions2[this.index].cardData, App.championLv2Builder) :}|{savedChampions2[this.index].id}|
					</div>
				</div>
				<!-- in: savedChampions2 -->

				<!-- forEach: "index" -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedChampions3[this.index].included === 'object' || this.app.savedChampions3[this.index].included ? 'ghost' : '' :}|{savedChampions3[this.index].included}|" onclick="this.app.toggleExport(App.championLv3Builder, this.app.savedChampions3[this.index])">
					<strong>Include {: this.app.savedChampions3[this.index].cardData.name :}</strong>
					<div>
						{:this.app.createPreview(this.app.savedChampions3[this.index].cardData, App.championLv3Builder) :}|{savedChampions3[this.index].id}|
					</div>
				</div>
				<!-- in: savedChampions3 -->

				<!-- forEach: "index" -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedLandmarks[this.index].included === 'object' || this.app.savedLandmarks[this.index].included ? 'ghost' : '' :}|{savedLandmarks[this.index].included}|" onclick="this.app.toggleExport(App.landmarkBuilder, this.app.savedLandmarks[this.index])">
					<strong>Include {: this.app.savedLandmarks[this.index].cardData.name :}</strong>
					<div>
						{:this.app.createPreview(this.app.savedLandmarks[this.index].cardData, App.landmarkBuilder) :}|{savedLandmarks[this.index].id}|
					</div>
				</div>
				<!-- in: savedLandmarks -->

				<!-- forEach: "index" -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedSpells[this.index].included === 'object' || this.app.savedSpells[this.index].included ? 'ghost' : '' :}|{savedSpells[this.index].included}|" onclick="this.app.toggleExport(App.spellBuilder, this.app.savedSpells[this.index])">
					<strong>Include {: this.app.savedSpells[this.index].cardData.name :}</strong>
					<div>
						{:this.app.createPreview(this.app.savedSpells[this.index].cardData, App.spellBuilder) :}|{savedSpells[this.index].id}|
					</div>
				</div>
				<!-- in: savedSpells -->

				<!-- forEach: "index" -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedFollowers[this.index].included === 'object' || this.app.savedFollowers[this.index].included ? 'ghost' : '' :}|{savedFollowers[this.index].included}|" onclick="this.app.toggleExport(App.followerBuilder, this.app.savedFollowers[this.index])">
					<strong>Include {: this.app.savedFollowers[this.index].cardData.name :}</strong>
					<div>
						{:this.app.createPreview(this.app.savedFollowers[this.index].cardData, App.followerBuilder) :}|{savedFollowers[this.index].id}|
					</div>
				</div>
				<!-- in: savedFollowers -->

			</div>
		</div>
	</main>

`)
