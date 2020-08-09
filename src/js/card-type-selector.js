(function(template){
	let controller = {}
	let view = proxymity(template, controller)

	let focus = controller.focus = function(){
		App.currentView = view
	}

	focus()
	App.cardTypePicker = controller
})(`
<div class="flex hcenter">
	<h2>I want to create a...</h2>
</div>
<main class="gutter-trbl-.5 flex">
	<div class="gutter-trbl-.5 box-xs-6 box-l-3 flex column vhcenter">
		<strong>Champion Lv 1</strong>
		<div class="clickable" onclick="App.championLv1Builder.focus()">
			<img src="./assets/champion/frame1gem.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Champion Lv 2</strong>
		<div class="clickable">
			<img src="./assets/champion/frame2.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Spell</strong>
		<div class="clickable">
			<img src="./assets/spell/frameslownone.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">
		<strong>Follower</strong>
		<div class="clickable">
			<img src="./assets/follower/framegemless.png" />
		</div>
	</div>
</main>
`)