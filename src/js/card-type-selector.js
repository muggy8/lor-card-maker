(async function(template){
	let controller = {}
	controller.attached = false

	let focus = controller.focus = function(){
		if (App.currentView === view){
			return
		}
		App.currentView = view
		history.replaceState({
			focus: "cardTypePicker"
		}, "LoR Card Makern")
		App.getSavedCards(controller)
	}

	controller.savedChampions1 = []
	controller.savedChampions2 = []
	controller.savedChampions3 = []
	controller.savedFollowers = []
	controller.savedLandmarks = []
	controller.savedSpells = []
	controller.savedKeywords = []

	controller.transferData = function(target, source){
		Object.keys(source).forEach(function(key){
			target[key] = source[key]
		})
	}

	App.cardTypePicker = controller
	let view = proxymity(template, controller)
	focus()
})(`
<div class="flex hcenter">
	<h2>I want to create a...</h2>
</div>
<main class="gutter-trbl-.5 flex">
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Champion Lv 1</strong>
		<div class="clickable" onclick="App.championLv1Builder.focus()">
			<img src="./assets/champion/frame1gemless.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Champion Lv 2</strong>
		<div class="clickable"  onclick="App.championLv2Builder.focus()">
			<img src="./assets/champion/frame2gemless.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Champion Lv 3</strong>
		<div class="clickable"  onclick="App.championLv3Builder.focus()">
			<img src="./assets/champion/frame3gemless.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Landmark</strong>
		<div class="clickable"  onclick="App.landmarkBuilder.focus()">
			<img src="./assets/landmark/framegemless.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Spell</strong>
		<div class="clickable"  onclick="App.spellBuilder.focus()">
			<img src="./assets/spell/frameslownone.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Follower</strong>
		<div class="clickable" onclick="App.followerBuilder.focus()">
			<img src="./assets/follower/framegemless.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Keyword (beta)</strong>
		<div class="clickable" onclick="App.keywordBuilder.focus()">
			<img src="./assets/keyword/frame5.png" />
		</div>
	</div>

	<div class="gutter-rl-2 gutter-tb-4 box-12 flex vhcenter">
		<button class="box-12" onclick="App.batchExporter.focus()">Batch Export (Beta)</button>
	</div>

	<div class="flex hcenter box-12">
		<h2>I want to edit...</h2>
	</div>

	<!-- forEach: "index" -->
	<!-- key: function(item, index, whole){ return item.id } -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.championLv1Builder.focus().then(_=>{this.app.transferData(App.championLv1Builder.card, this.app.savedChampions1[this.index].cardData); App.championLv1Builder.cardId = this.app.savedChampions1[this.index].id})">
		<strong>Edit {: this.app.savedChampions1[this.index].cardData.name :}</strong>
		<div>
			{:
				this.app.attached && App.batchExporter.createPreview(
					this.app.savedChampions1[this.index].cardData,
					App.championLv1Builder,
					this.app.savedChampions1[this.index].id,
				)
			:}|{attached}|
		</div>
	</div>
	<!-- in: savedChampions1 -->

	<!-- forEach: "index" -->
	<!-- key: function(item, index, whole){ return item.id } -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.championLv2Builder.focus().then(_=>{this.app.transferData(App.championLv2Builder.card, this.app.savedChampions2[this.index].cardData); App.championLv2Builder.cardId = this.app.savedChampions2[this.index].id})">
		<strong>Edit {: this.app.savedChampions2[this.index].cardData.name :}</strong>
		<div>
			{:
				this.app.attached && App.batchExporter.createPreview(
					this.app.savedChampions2[this.index].cardData,
					App.championLv2Builder,
					this.app.savedChampions2[this.index].id,
				)
			:}|{attached}|
		</div>
	</div>
	<!-- in: savedChampions2 -->

	<!-- forEach: "index" -->
	<!-- key: function(item, index, whole){ return item.id } -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.championLv3Builder.focus().then(_=>{this.app.transferData(App.championLv3Builder.card, this.app.savedChampions3[this.index].cardData); App.championLv3Builder.cardId = this.app.savedChampions3[this.index].id})">
		<strong>Edit {: this.app.savedChampions3[this.index].cardData.name :}</strong>
		<div>
			{:
				this.app.attached && App.batchExporter.createPreview(
					this.app.savedChampions3[this.index].cardData,
					App.championLv3Builder,
					this.app.savedChampions3[this.index].id,
				)
			:}|{attached}|
		</div>
	</div>
	<!-- in: savedChampions3 -->

	<!-- forEach: "index" -->
	<!-- key: function(item, index, whole){ return item.id } -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.landmarkBuilder.focus().then(_=>{this.app.transferData(App.landmarkBuilder.card, this.app.savedLandmarks[this.index].cardData); App.landmarkBuilder.cardId = this.app.savedLandmarks[this.index].id})">
		<strong>Edit {: this.app.savedLandmarks[this.index].cardData.name :}</strong>
		<div>
			{:
				this.app.attached && App.batchExporter.createPreview(
					this.app.savedLandmarks[this.index].cardData,
					App.landmarkBuilder,
					this.app.savedLandmarks[this.index].id,
				)
			:}|{attached}|
		</div>
	</div>
	<!-- in: savedLandmarks -->

	<!-- forEach: "index" -->
	<!-- key: function(item, index, whole){ return item.id } -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.spellBuilder.focus().then(_=>{this.app.transferData(App.spellBuilder.card, this.app.savedSpells[this.index].cardData); App.spellBuilder.cardId = this.app.savedSpells[this.index].id})">
		<strong>Edit {: this.app.savedSpells[this.index].cardData.name :}</strong>
		<div>
			{:
				this.app.attached && App.batchExporter.createPreview(
					this.app.savedSpells[this.index].cardData,
					App.spellBuilder,
					this.app.savedSpells[this.index].id,
				)
			:}|{attached}|
		</div>
	</div>
	<!-- in: savedSpells -->

	<!-- forEach: "index" -->
	<!-- key: function(item, index, whole){ return item.id } -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.followerBuilder.focus().then(_=>{this.app.transferData(App.followerBuilder.card, this.app.savedFollowers[this.index].cardData); App.followerBuilder.cardId = this.app.savedFollowers[this.index].id})">
		<strong>Edit {: this.app.savedFollowers[this.index].cardData.name :}</strong>
		<div>
			{:
				this.app.attached && App.batchExporter.createPreview(
					this.app.savedFollowers[this.index].cardData,
					App.followerBuilder,
					this.app.savedFollowers[this.index].id,
				)
			:}|{attached}|
		</div>
	</div>
	<!-- in: savedFollowers -->

	<!-- forEach: "index" -->
	<!-- key: function(item, index, whole){ return item.id } -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.keywordBuilder.focus().then(_=>{this.app.transferData(App.keywordBuilder.card, this.app.savedKeywords[this.index].cardData); App.keywordBuilder.cardId = this.app.savedKeywords[this.index].id})">
		<strong>Edit {: this.app.savedKeywords[this.index].cardData.name :}</strong>
		<div>
			{:
				this.app.attached && App.batchExporter.createPreview(
					this.app.savedKeywords[this.index].cardData,
					App.keywordBuilder,
					this.app.savedKeywords[this.index].id,
				)
			:}|{attached}|
		</div>
	</div>
	<!-- in: savedKeywords -->
</main>
`)
