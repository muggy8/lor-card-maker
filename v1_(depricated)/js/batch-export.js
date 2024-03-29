(function(template){

	let controller = App.batchExporter = Object.create(App.baseBuilderController)
	controller.exporting = false
	controller.attached = false

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

	function mergeIfNotExist(target, source){
		Object.keys(source).forEach(function(prop){
			if (Object.prototype.hasOwnProperty.call(target, prop)){
				return
			}
			let sourceDescriptor = Object.getOwnPropertyDescriptor(source, prop)
			Object.defineProperty(target, prop, sourceDescriptor)
		})
	}

	controller.createPreview = function(cardData, cardTypeController, id, resize = false){
		//~ console.log(cardData)

		let random = id || proxymity.random.string(8)

		let customeController = Object.create(Object.getPrototypeOf(cardTypeController))
		cardTypeController.clearCard.call(customeController)
		mergeIfNotExist(customeController, cardTypeController)
		!resize && (customeController.effectResize = function(){ // override the effectResize function because that's time consuming but when were just rendering an output. it's not really useful
			return Promise.resolve()
		})
		App.cardTypePicker.transferData(customeController.card, cardData)
		customeController.exporting = true
		customeController.cardId = random

		return customeController.createPreview()
	}
})(`
	<main class="flex hcenter">

		<div class="export-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			<div class="gutter-rl-2 gutter-tb-4 box-12 flex vhcenter">
				<button class="box-12 clickable" onclick="!this.app.exporting && this.app.includedCards.length && this.app.exportCard(this.app.cardInstance)">
					<div class="icon {:!this.app.exporting ? 'hide' : '' :}|{exporting},{includedCards.length}|">
						<i class="loading"></i>
					</div>
					<span class="{:this.app.exporting ? 'hide' : '' :}|{exporting}|" >
						{:App.lang[App.langChoice].export_selection:}
					</span>
				</button>
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
						{:this.app && this.app.attached &&  this.app.includedCards[this.index] && this.app.createPreview(this.app.includedCards[this.index].cardData, this.app.includedCards[this.index].hostController, undefined, true) :}|{includedCards[this.index].id},{attached}|
					</g>
				<!-- in: includedCards -->
			</svg>

			<div class="{:this.app.includedCards.length ? 'hide' : '' :}|{includedCards.length}|">
				<div class="flex hcenter ghost">
					<h3>{:App.lang[App.langChoice].no_export_selected:}</h3>
				</div>
			</div>
		</div>

		<div class="export-includes-choices gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			<div class="mobile-config-footer gutter-trbl flex hcenter clickable" onclick="this.app.toggleMBShow()" data-init="{: document.body.style.setProperty('--footer-height', this.offsetHeight + 'px') :}|{ mbShowConfigs }|">
				<strong>{:App.lang[App.langChoice].select_exports:}</strong>
			</div>
			<div class="slide-up gutter-tb gutter-rl-.5 flex {:this.app.mbShowConfigs ? 'active' : '':}|{mbShowConfigs}|">

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedChampions1[this.index].included === 'object' || this.app.savedChampions1[this.index].included ? 'ghost' : '' :}|{savedChampions1[this.index].included}|" onclick="this.app.toggleExport(App.championLv1Builder, this.app.savedChampions1[this.index])">
					<strong>{:App.lang[App.langChoice].include:} {: this.app.savedChampions1[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedChampions1[this.index].cardData, App.championLv1Builder, this.app.savedChampions1[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedChampions1 -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedChampions2[this.index].included === 'object' || this.app.savedChampions2[this.index].included ? 'ghost' : '' :}|{savedChampions2[this.index].included}|" onclick="this.app.toggleExport(App.championLv2Builder, this.app.savedChampions2[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedChampions2[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedChampions2[this.index].cardData, App.championLv2Builder, this.app.savedChampions2[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedChampions2 -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedChampions3[this.index].included === 'object' || this.app.savedChampions3[this.index].included ? 'ghost' : '' :}|{savedChampions3[this.index].included}|" onclick="this.app.toggleExport(App.championLv3Builder, this.app.savedChampions3[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedChampions3[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedChampions3[this.index].cardData, App.championLv3Builder, this.app.savedChampions3[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedChampions3 -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedLandmarks[this.index].included === 'object' || this.app.savedLandmarks[this.index].included ? 'ghost' : '' :}|{savedLandmarks[this.index].included}|" onclick="this.app.toggleExport(App.landmarkBuilder, this.app.savedLandmarks[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedLandmarks[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedLandmarks[this.index].cardData, App.landmarkBuilder, this.app.savedLandmarks[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedLandmarks -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedSpells[this.index].included === 'object' || this.app.savedSpells[this.index].included ? 'ghost' : '' :}|{savedSpells[this.index].included}|" onclick="this.app.toggleExport(App.spellBuilder, this.app.savedSpells[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedSpells[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedSpells[this.index].cardData, App.spellBuilder, this.app.savedSpells[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedSpells -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedFollowers[this.index].included === 'object' || this.app.savedFollowers[this.index].included ? 'ghost' : '' :}|{savedFollowers[this.index].included}|" onclick="this.app.toggleExport(App.followerBuilder, this.app.savedFollowers[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedFollowers[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedFollowers[this.index].cardData, App.followerBuilder, this.app.savedFollowers[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedFollowers -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: typeof this.app.savedKeywords[this.index].included === 'object' || this.app.savedKeywords[this.index].included ? 'ghost' : '' :}|{savedKeywords[this.index].included}|" onclick="this.app.toggleExport(App.keywordBuilder, this.app.savedKeywords[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedKeywords[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedKeywords[this.index].cardData, App.keywordBuilder, this.app.savedKeywords[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedKeywords -->

			</div>
		</div>
	</main>

`)
