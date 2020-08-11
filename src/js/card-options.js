App.cardOptions = (function(template, subTemplates){
	return function(card){
		let controller = {subTemplates}
		controller.card = card

		let rarityOptions = controller.rarityOptions = cardOptionsData.rarityOptions
		let factionOptions = controller.factionOptions = cardOptionsData.factionOptions
		let keywords = controller.keywords = Object.keys(cardOptionsData.icons)
		console.log(keywords)

		controller.mbShowConfigs = false
		return proxymity(template, controller)
	}
})(`
<div class="mobile-config-footer gutter-trbl flex hcenter clickable" onclick="this.app.mbShowConfigs = !this.app.mbShowConfigs">
	<strong>Card Configs</strong>
</div>
<div class="slide-up gutter-tb {:this.app.mbShowConfigs ? 'active' : '':}|{mbShowConfigs}|">
	{:Object.prototype.hasOwnProperty.call(this.app.card, "mana") ? proxymity(this.app.subTemplates.manaCostUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "name") ? proxymity(this.app.subTemplates.cardNameUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "rarity") ? proxymity(this.app.subTemplates.raritySelectorUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "faction") ? proxymity(this.app.subTemplates.regionSelectorUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "keywords") ? proxymity(this.app.subTemplates.keywordChoiceUI, this.app) : undefined:}
</div>
`, {
	regionSelectorUI: `
		<label>
			<div>
				<strong>faction</strong>
			</div>
			<div class="flex gutter-b">
				<select name="rarity" class="box-12" onchange="this.app.card.faction = this.value" data-value="{:this.app.card.faction:}|{card.faction}|">
					<!-- key: "index" -->
						<option value="{:this.app.factionOptions[this.index]:}">{:this.app.factionOptions[this.index] || "none":}</option>
					<!-- in: factionOptions -->
				</select>
			</div>
		</label>
	`,
	raritySelectorUI: `
		<label>
			<div>
				<strong>Rarity</strong>
			</div>
			<div class="flex gutter-b">
				<select name="rarity" class="box-12" onchange="this.app.card.rarity = this.value" data-value="{:this.app.card.rarity:}|{card.rarity}|">
					<!-- key: "rarityIndex" -->
						<option value="{:this.app.rarityOptions[this.rarityIndex]:}">{:this.app.rarityOptions[this.rarityIndex]:}</option>
					<!-- in: rarityOptions -->
				</select>
			</div>
		</label>
	`,
	manaCostUI: `
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
	`,
	cardNameUI: `
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
	`,
	keywordChoiceUI: `
		<div>
			<div>
				<strong>Select Keywords</strong>
			</div>
			<div class="flex">
				<!--key: "index" -->
					<label class="box-2 flex column vhcenter gutter-trbl-.25 clickable">
						<div data-init="{:this.innerHTML = createMiniKeyword('./assets/symbol/' + cardOptionsData.icons[this.app.keywords[this.index]]):}"></div>
						{:this.app.keywords[this.index]:}
					</label>
				<!-- in: keywords -->
			</div>
		</div>
	`
})