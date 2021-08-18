(async function(template){
	let controller = {}

	let focus = controller.focus = function(){
		if (App.currentView === view){
			return
		}
		App.currentView = view
		history.replaceState({
			focus: "cardTypePicker"
		}, "LoR Card Makern")
	}

	await App.swReady
	controller.savedChampions1 = await App.storage.getSavedChampion1()
	controller.savedChampions2 = await App.storage.getSavedChampion2()
	controller.savedFollowers = await App.storage.getSavedFollower()
	controller.savedLandmarks = await App.storage.getSavedLandmark()
	controller.savedSpells = await App.storage.getSavedSpell()

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
			<img src="./assets/champion/frame1gem.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Champion Lv 2</strong>
		<div class="clickable"  onclick="App.championLv2Builder.focus()">
			<img src="./assets/champion/frame2.png" />
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

	<!-- key: "index" -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Edit</strong>
		<div class="clickable" onclick="App.championLv1Builder.focus().then(_=>{this.app.transferData(App.championLv1Builder.card, this.app.savedChampions1[this.index].cardData); App.championLv1Builder.cardId = this.app.savedChampions1[this.index].id})">
			{:App.championLv1Builder.createPreview(this.app.savedChampions1[this.index].cardData):}
		</div>
	</div>
	<!-- in: savedChampions1 -->

	<!-- key: "index" -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Edit</strong>
		<div class="clickable" onclick="App.championLv2Builder.focus().then(_=>{this.app.transferData(App.championLv2Builder.card, this.app.savedChampions2[this.index].cardData); App.championLv2Builder.cardId = this.app.savedChampions2[this.index].id})">
			{:App.championLv2Builder.createPreview(this.app.savedChampions2[this.index].cardData):}
		</div>
	</div>
	<!-- in: savedChampions2 -->

	<!-- key: "index" -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Edit</strong>
		<div class="clickable" onclick="App.landmarkBuilder.focus().then(_=>{this.app.transferData(App.landmarkBuilder.card, this.app.savedLandmarks[this.index].cardData); App.landmarkBuilder.cardId = this.app.savedLandmarks[this.index].id})">
			{:App.landmarkBuilder.createPreview(this.app.savedLandmarks[this.index].cardData):}
		</div>
	</div>
	<!-- in: savedLandmarks -->

	<!-- key: "index" -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Edit</strong>
		<div class="clickable" onclick="App.spellBuilder.focus().then(_=>{this.app.transferData(App.spellBuilder.card, this.app.savedSpells[this.index].cardData); App.spellBuilder.cardId = this.app.savedSpells[this.index].id})">
			{:App.spellBuilder.createPreview(this.app.savedSpells[this.index].cardData):}
		</div>
	</div>
	<!-- in: savedSpells -->

	<!-- key: "index" -->
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Edit</strong>
		<div class="clickable" onclick="App.followerBuilder.focus().then(_=>{this.app.transferData(App.followerBuilder.card, this.app.savedFollowers[this.index].cardData); App.followerBuilder.cardId = this.app.savedFollowers[this.index].id})">
			{:App.followerBuilder.createPreview(this.app.savedFollowers[this.index].cardData):}
		</div>
	</div>
	<!-- in: savedFollowers -->
</main>
`)
