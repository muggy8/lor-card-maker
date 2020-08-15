App.cardOptions = (function(template, subTemplates){
	return function(card){
		let controller = {subTemplates}
		controller.card = card

		let rarityOptions = controller.rarityOptions = cardOptionsData.rarityOptions
		let factionOptions = controller.factionOptions = cardOptionsData.factionOptions
		let spellSpeedOptions = controller.spellSpeedOptions = cardOptionsData.spellSpeedOptions
		let keywords = controller.keywords = Object.keys(cardOptionsData.icons)

		let toggleKeyword = controller.toggleKeyword = function(word){
			let wordIndex = card.keywords.indexOf(word)
			if (wordIndex === -1){
				card.keywords.push(word)
			}
			else{
				card.keywords.splice(wordIndex, 1)
			}
		}

		let processArtUpload = controller.processArtUpload = function(imgInput){
			let reader = new FileReader()
			let file = imgInput.files[0]

			reader.addEventListener("load", function(){
				card.art = reader.result
			})

			if (file){
				console.log(file)
				reader.readAsDataURL(file)
			}
		}

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
	{:Object.prototype.hasOwnProperty.call(this.app.card, "art") ? proxymity(this.app.subTemplates.artUploadUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "effect") ? proxymity(this.app.subTemplates.cardEffectUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "blueWords") ? proxymity(this.app.subTemplates.blueWordsUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "orangeWords") ? proxymity(this.app.subTemplates.orangeWordsUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "rarity") ? proxymity(this.app.subTemplates.raritySelectorUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "speed") ? proxymity(this.app.subTemplates.speedSelectorUI, this.app) : undefined:}
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
		</label>`,
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
	cardEffectUI: `
		<label>
			<div>
				<strong>Card Effect</strong>
			</div>
			<div class="flex gutter-b">
				<textarea
					class="box-12"
					name="card-name"
					type="text"
					data-value="{:this.app.card.effect:}|{card.effect}|"
					onchange="this.app.card.effect = this.value || ''"
				></textarea>
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
					<label class="box-2 flex column vhcenter gutter-trbl-.25 clickable {:this.app.card.keywords.some(word=>word===this.app.keywords[this.index]) ? '' : 'ghost' :}|{card.keywords.length}|" onclick="this.app.toggleKeyword(this.app.keywords[this.index])">
						<div data-init="{:this.innerHTML = createMiniKeyword('./assets/symbol/' + cardOptionsData.icons[this.app.keywords[this.index]]).svg:}"></div>
						{:this.app.keywords[this.index]:}
					</label>
				<!-- in: keywords -->
			</div>
		</div>
	`,
	speedSelectorUI: `
		<label>
			<div>
				<strong>Speed</strong>
			</div>
			<div class="flex gutter-b">
				<select name="rarity" class="box-12" onchange="this.app.card.speed = this.value" data-value="{:this.app.card.speed:}|{card.speed}|">
					<!-- key: "index" -->
						<option value="{:this.app.spellSpeedOptions[this.index]:}">{:this.app.spellSpeedOptions[this.index]:}</option>
					<!-- in: spellSpeedOptions -->
				</select>
			</div>
		</label>
	`,
	blueWordsUI: `
		<div class="gutter-t-.5 {:this.app.card.blueWords.length ? 'gutter-b-.5' : '' :}|{card.blueWords.length}|">
			<div class="flex gutter-b-.5">
				<div class="grow">
					<strong>Other Cards Mentioned in Effect Text</strong>
				</div>
				<button onclick="this.app.card.blueWords.push('')">Add Mention</button>
			</div>
			<!-- key: "index" -->
				<label class="flex gutter-tb-.5">
					<div class="grow flex gutter-r">
						<input
							class="box-12"
							name="mentions-{:this.index:}"
							data-value="{:this.app.card.blueWords[this.index]:}|{card.blueWords[this.index]}|"
							onchange="this.app.card.blueWords[this.index] = this.value"
							onkeyup="this.app.card.blueWords[this.index] = this.value"
						/>
					</div>
					<button onclick="this.app.card.blueWords.splice(this.index, 1)">X</button>
				</label>
			<!-- in: card.blueWords -->
		</div>
	`,
	orangeWordsUI: `
		<div class="gutter-t-.5 {:this.app.card.orangeWords.length ? 'gutter-b-.5' : '' :}|{card.orangeWords.length}|">
			<div class="flex gutter-b-.5">
				<div class="grow">
					<strong>Key Words and Special Text mentioned in Effect Text</strong>
				</div>
				<button onclick="this.app.card.orangeWords.push('')">Add Mention</button>
			</div>
			<!-- key: "index" -->
				<label class="flex gutter-tb-.5">
					<div class="grow flex gutter-r">
						<input
							class="box-12"
							name="mentions-{:this.index:}"
							data-value="{:this.app.card.orangeWords[this.index]:}|{card.orangeWords[this.index]}|"
							onchange="this.app.card.orangeWords[this.index] = this.value"
							onkeyup="this.app.card.orangeWords[this.index] = this.value"
						/>
					</div>
					<button onclick="this.app.card.orangeWords.splice(this.index, 1)">X</button>
				</label>
			<!-- in: card.orangeWords -->
		</div>
	`,
	artUploadUI: `
		<label class="flex hcenter">
			<div class="gutter-trbl">
				<strong>Upload Image</strong>
			</div>
			<input class="hide" type="file" id="uplaod-art" name="art" accept="image/*" onchange="this.app.processArtUpload(this)"/>
		</label>
	`,
})