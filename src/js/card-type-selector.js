(function(template){
	let controller = {}
	let view = proxymity(template, controller)

	controller.focus = function(){
		app.currentView = view
	}

	controller.focus()
	app.cardTypePicker = controller
})(`
<div class="flex hcenter">
	<h2>Create a...</h2>
</div>
<main class="gutter-trbl-.5 flex">
	<div class="gutter-trbl-.5 box-xs-12 box-s-6 box-l-3 flex column vhcenter">
		<strong>Champion Lv 1</strong>
		<div>
			<img src="./assets/champion/frame1gem.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-12 box-s-6 box-l-3 flex column vhcenter">
		<strong>Champion Lv 2</strong>
		<div>
			<img src="./assets/champion/frame2.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-12 box-s-6 box-l-3 flex column vhcenter">
		<strong>Spell</strong>
		<div>
			<img src="./assets/spell/frameslownone.png" />
		</div>
	</div>
	<div class="gutter-trbl-.5 box-xs-12 box-s-6 box-l-3 flex column vhcenter">
		<strong>Follower</strong>
		<div>
			<img src="./assets/follower/framegemless.png" />
		</div>
	</div>
</main>
`)