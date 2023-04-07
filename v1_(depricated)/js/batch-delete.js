(function(template){
    let controller = App.batchDelete = Object.create(App.baseBuilderController)

    let view = proxymity(template, controller)

    let cardsToDelete = controller.cardsToDelete = {}

    controller.exporting = false

    controller.focus = function(){
		if (App.currentView === view){
			return
		}
		App.currentView = view
		window.scroll(0,0)
		history.pushState({
			focus: "batchDelete"
		}, "Batch Delete")

		App.getSavedCards(controller)
	}

    controller.createPreview = App.batchExporter.createPreview

    controller.toggleDelete = function(cardTypeController, cardWithMeta){
        let id = cardWithMeta.id

        if (cardsToDelete[id]){
            cardsToDelete[id] = false
            return
        }

        cardsToDelete[id] = {
            hostController: cardTypeController,
            cardData: cardWithMeta.cardData,
        }
    }

	controller.deleteSelected = async function(cardsToDelete){
		controller.exporting = true
        let deleteTask = Object.keys(cardsToDelete)
            .map(id=>{
                let card = cardsToDelete[id]
				if (!card){
					return Promise.resolve()
				}
                return card.hostController.deleteCard(id)
            })
        
        await Promise.all(deleteTask)
        controller.exporting = false
		window.location.reload()
	}
})(`
    <main class="flex hcenter">

        <div class="export-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
            <div class="gutter-rl-2 gutter-tb-4 box-12 flex vhcenter">
                <button class="box-12 clickable" onclick="this.app.deleteSelected(this.app.cardsToDelete)">
                    <div class="icon {:!this.app.exporting ? 'hide' : '' :}|{exporting}|">
                        <i class="loading"></i>
                    </div>
                    <span class="{:this.app.exporting ? 'hide' : '' :}|{exporting}|" >
                        {:App.lang[App.langChoice].delete_selected:}
                    </span>
                </button>
            </div>
        </div>

        <div class="gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
            <div class="gutter-tb gutter-rl-.5 flex">

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
                <!-- {:this.app.cardsToDelete[this.app.savedChampions1[this.index].id] = false:} -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: this.app.cardsToDelete[this.app.savedChampions1[this.index].id] ? '' : 'ghost' :}|{cardsToDelete[this.app.savedChampions1[this.index].id]}|" onclick="this.app.toggleDelete(App.championLv1Builder, this.app.savedChampions1[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedChampions1[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedChampions1[this.index].cardData, App.championLv1Builder, this.app.savedChampions1[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedChampions1 -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
                <!-- {:this.app.cardsToDelete[this.app.savedChampions2[this.index].id] = false:} -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: this.app.cardsToDelete[this.app.savedChampions2[this.index].id] ? '' : 'ghost' :}|{cardsToDelete[this.app.savedChampions2[this.index].id]}|" onclick="this.app.toggleDelete(App.championLv2Builder, this.app.savedChampions2[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedChampions2[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedChampions2[this.index].cardData, App.championLv2Builder, this.app.savedChampions2[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedChampions2 -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
                <!-- {:this.app.cardsToDelete[this.app.savedChampions3[this.index].id] = false:} -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: this.app.cardsToDelete[this.app.savedChampions3[this.index].id] ? '' : 'ghost' :}|{cardsToDelete[this.app.savedChampions3[this.index].id]}|" onclick="this.app.toggleDelete(App.championLv3Builder, this.app.savedChampions3[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedChampions3[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedChampions3[this.index].cardData, App.championLv3Builder, this.app.savedChampions3[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedChampions3 -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
                <!-- {:this.app.cardsToDelete[this.app.savedLandmarks[this.index].id] = false:} -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: this.app.cardsToDelete[this.app.savedLandmarks[this.index].id] ? '' : 'ghost' :}|{cardsToDelete[this.app.savedLandmarks[this.index].id]}|" onclick="this.app.toggleDelete(App.landmarkBuilder, this.app.savedLandmarks[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedLandmarks[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedLandmarks[this.index].cardData, App.landmarkBuilder, this.app.savedLandmarks[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedLandmarks -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
                <!-- {:this.app.cardsToDelete[this.app.savedSpells[this.index].id] = false:} -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: this.app.cardsToDelete[this.app.savedSpells[this.index].id] ? '' : 'ghost' :}|{cardsToDelete[this.app.savedSpells[this.index].id]}|" onclick="this.app.toggleDelete(App.spellBuilder, this.app.savedSpells[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedSpells[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedSpells[this.index].cardData, App.spellBuilder, this.app.savedSpells[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedSpells -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
                <!-- {:this.app.cardsToDelete[this.app.savedFollowers[this.index].id] = false:} -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: this.app.cardsToDelete[this.app.savedFollowers[this.index].id] ? '' : 'ghost' :}|{cardsToDelete[this.app.savedFollowers[this.index].id]}|" onclick="this.app.toggleDelete(App.followerBuilder, this.app.savedFollowers[this.index])">
					<strong>{:App.lang[App.langChoice].include:}  {: this.app.savedFollowers[this.index].cardData.name :}</strong>
					<div>
						{:this.app.attached && this.app.createPreview(this.app.savedFollowers[this.index].cardData, App.followerBuilder, this.app.savedFollowers[this.index].id) :}|{attached}|
					</div>
				</div>
				<!-- in: savedFollowers -->

				<!-- forEach: "index" -->
				<!-- key: function(item, index, whole){ return item.id } -->
                <!-- {:this.app.cardsToDelete[this.app.savedKeywords[this.index].id] = false:} -->
				<div class="gutter-trbl-.5 box-xs-4 box-sm-6 box-xl-4 flex column vhcenter clickable {: this.app.cardsToDelete[this.app.savedKeywords[this.index].id] ? '' : 'ghost' :}|{cardsToDelete[this.app.savedKeywords[this.index].id]}|" onclick="this.app.toggleDelete(App.keywordBuilder, this.app.savedKeywords[this.index])">
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