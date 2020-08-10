App.cardOptions = (function(template, subTemplates){
	return function(card){
		let controller = {subTemplates}
		controller.card = card

		let rarityOptions = this.rarityOptions = [
			"none",
			"common",
			"rare",
			"epic"
		]

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
		<div class="flex gutter-b">
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
	<label>
		<div>
			<strong>Card Name</strong>
		</div>
		<div class="flex gutter-b">
			<input
				class="box-12"
				name="card-name"
				type="text"
				data-value="{:this.app.card.name:}|{card.name}|"
				onchange="this.app.card.name = this.value || ''"
				onkeyup="this.app.card.name = this.value || ''"
			>
		</div>
	</label>
	{:Object.prototype.hasOwnProperty.call(this.app.card, "rarity") ? proxymity(this.app.subTemplates.raritySelectorUI, this.app) : undefined:}
</div>
`, {
	raritySelectorUI: `
		<label>
			<div>
				<strong>Rarity</strong>
			</div>
			<div class="flex">

			</div>
		</label>
	`
})