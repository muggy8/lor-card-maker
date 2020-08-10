App.cardOptions = (function(template){
	return function(card){
		let controller = {}
		controller.card = card

		controller.mbShowConfigs = false
		return proxymity(template, controller)
	}
})(`
<div class="mobile-config-footer gutter-trbl flex hcenter clickable" onclick="this.app.mbShowConfigs = !this.app.mbShowConfigs">
	<strong>Card Configs</strong>
</div>
<div class="slide-up gutter-tb {:this.app.mbShowConfigs ? 'active' : '':}|{mbShowConfigs}|">
	<label>
		<div>
			<strong>Mana Cost</strong>
		</div>
		<div class="flex">
			<input
				class="box-12"
				name="mana-cost"
				type="number"
				data-value="{:this.app.card.mana:}|{card.mana}|"
				onchange="this.app.card.mana = this.valueAsNumber || 0"
				onkeyup="this.app.card.mana = this.valueAsNumber || 0"
			>
		</div>
	</label>
</div>
`)