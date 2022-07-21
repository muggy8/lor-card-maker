App.cardOptions = (function(template, subTemplates){
	return function(card, rarityOptions){
		let controller = {subTemplates, rarityOptions}
		controller.card = card

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

		let toggleFaction = controller.toggleFaction = function(factionName){
			let wordIndex = card.faction.indexOf(factionName)
			if (wordIndex === -1){
				card.faction.push(factionName)
			}
			else{
				card.faction.splice(wordIndex, 1)
			}
		}

		function getCursorPos(input) {
			// function source: https://stackoverflow.com/questions/7745867/how-do-you-get-the-cursor-position-in-a-textarea
		    if ("selectionStart" in input && document.activeElement == input) {
		        return {
		            start: input.selectionStart,
		            end: input.selectionEnd
		        };
		    }
		    else if (input.createTextRange) {
		        var sel = document.selection.createRange();
		        if (sel.parentElement() === input) {
		            var rng = input.createTextRange();
		            rng.moveToBookmark(sel.getBookmark());
		            for (var len = 0;
		                     rng.compareEndPoints("EndToStart", rng) > 0;
		                     rng.moveEnd("character", -1)) {
		                len++;
		            }
		            rng.setEndPoint("StartToStart", input.createTextRange());
		            for (var pos = { start: 0, end: len };
		                     rng.compareEndPoints("EndToStart", rng) > 0;
		                     rng.moveEnd("character", -1)) {
		                pos.start++;
		                pos.end++;
		            }
		            return pos;
		        }
		    }
		    return -1;
		}

		function stringSplice(string, start, delCount, newSubStr) {
	        return string.slice(0, start) + newSubStr + string.slice(start + Math.abs(delCount));
	    };

		let insertEffectSymbol = controller.insertEffectSymbol = function(word){
			let cursorPos = controller.cursorPos
			if (cursorPos.start === cursorPos.end){
				card.effect = stringSplice(card.effect, cursorPos.start, 0, `<${word}/>`)
			}
		}

		controller.cursorPos = {start: 0, end: 0}
		let rememberCursorPosition = controller.rememberCursorPosition = function(){
			let foundCursorPos = getCursorPos(controller.effectInputArea)
			foundCursorPos !== -1 && (controller.cursorPos = foundCursorPos)
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

		controller.levelPos = {start: 0, end: 0}
		let rememberLevelCursorPosition = controller.rememberLevelCursorPosition = function(){
			let foundCursorPos = getCursorPos(controller.levelInputArea)
			foundCursorPos !== -1 && (controller.levelPos = foundCursorPos)
		}

		let insertLevelEffectSymbol = controller.insertLevelEffectSymbol = function(word){
			let cursorPos = controller.levelPos
			if (cursorPos.start === cursorPos.end){
				card.lvup = stringSplice(card.lvup, cursorPos.start, 0, `<${word}/>`)
			}
		}

		controller.mbShowConfigs = false
		controller.toggleMBShow = function(){
			controller.mbShowConfigs = ! controller.mbShowConfigs

			if (controller.mbShowConfigs === false){
				history.back()
			}
			else{
				history.pushState({}, "Configuring Card")
			}
		}
		return proxymity(template, controller)
	}
})(`
<div class="mobile-config-footer gutter-trbl flex hcenter clickable" onclick="this.app.toggleMBShow()" data-init="{: document.body.style.setProperty('--footer-height', this.offsetHeight + 'px') :}|{ mbShowConfigs }|">
	<strong>Card Configs</strong>
</div>
<div class="slide-up gutter-tb {:this.app.mbShowConfigs ? 'active' : '':}|{mbShowConfigs}|">
	{:Object.prototype.hasOwnProperty.call(this.app.card, "mana") ? proxymity(this.app.subTemplates.manaCostUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "name") ? proxymity(this.app.subTemplates.cardNameUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "clan") ? proxymity(this.app.subTemplates.cardClanUI, this.app) : undefined:}
	<!-- text break -->
	<div class="flex power-health">
		{:Object.prototype.hasOwnProperty.call(this.app.card, "power") ? proxymity(this.app.subTemplates.powerUI, this.app) : undefined:}
		<!-- text break -->
		{:Object.prototype.hasOwnProperty.call(this.app.card, "health") ? proxymity(this.app.subTemplates.healthUI, this.app) : undefined:}
	</div>
	{:Object.prototype.hasOwnProperty.call(this.app.card, "art") ? proxymity(this.app.subTemplates.artUploadUI, this.app) : undefined:}
	{:Object.prototype.hasOwnProperty.call(this.app.card, "artist") ? proxymity(this.app.subTemplates.cardArtistUI, this.app) : undefined:}

	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "keywords") ? proxymity(this.app.subTemplates.keywordChoiceUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "effect") ? proxymity(this.app.subTemplates.cardEffectUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "lvup") ? proxymity(this.app.subTemplates.cardLevelUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "blueWords") ? proxymity(this.app.subTemplates.blueWordsUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "orangeWords") ? proxymity(this.app.subTemplates.orangeWordsUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "rarity") && this.app.rarityOptions ? proxymity(this.app.subTemplates.raritySelectorUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "speed") ? proxymity(this.app.subTemplates.speedSelectorUI, this.app) : undefined:}
	<!-- text break -->
	{:Object.prototype.hasOwnProperty.call(this.app.card, "faction") ? proxymity(this.app.subTemplates.regionSelectorUI, this.app) : undefined:}
</div>
`, {
	regionSelectorUI: `
		<label>
			<div>
				<strong>faction</strong>
			</div>
			<div class="flex gutter-b-2">
				<!-- forEach: "index" -->
					<div class="box-3 gutter-trbl-.25 clickable flex column vhcenter {:this.app.card.faction.some(word=>word===this.app.factionOptions[this.index]) ? '' : 'ghost' :}|{card.faction.length}|" onclick="this.app.toggleFaction(this.app.factionOptions[this.index])">
						<img src="/assets/regions/{:this.app.factionOptions[this.index]:}.png" />
					</div>
				<!-- in: factionOptions -->
			</div>
		</label>`,
	raritySelectorUI: `
		<label>
			<div>
				<strong>Rarity</strong>
			</div>
			<div class="flex gutter-b-2">
				<select name="rarity" class="box-12" onchange="this.app.card.rarity = this.value" data-value="{:this.app.card.rarity:}|{card.rarity}|">
					<!-- forEach: "rarityIndex" -->
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
			<div class="flex gutter-b-2">
				<input
					class="box-12"
					name="mana-cost"
					type="number"
					data-value="{:this.app.card.mana:}|{card.mana}|"
					onchange="this.app.card.mana = this.valueAsNumber"
					onkeyup="this.app.card.mana = this.valueAsNumber"
				>
			</div>
		</label>
	`,
	powerUI: `
		<label class="grow">
			<div>
				<strong>Power</strong>
			</div>
			<div class="flex gutter-b-2">
				<input
					class="box-12"
					name="power"
					type="number"
					data-value="{:this.app.card.power:}|{card.power}|"
					onchange="this.app.card.power = this.valueAsNumber || 0"
					onkeyup="this.app.card.power = this.valueAsNumber || 0"
				>
			</div>
		</label>
	`,
	healthUI: `
		<label class="grow">
			<div>
				<strong>Health</strong>
			</div>
			<div class="flex gutter-b-2">
				<input
					class="box-12"
					name="power"
					type="number"
					data-value="{:this.app.card.health:}|{card.health}|"
					onchange="this.app.card.health = this.valueAsNumber || 0"
					onkeyup="this.app.card.health = this.valueAsNumber || 0"
				>
			</div>
		</label>
	`,
	cardNameUI: `
		<label>
			<div>
				<strong>Name</strong>
			</div>
			<div class="flex gutter-b-2">
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
	cardArtistUI: `
		<label>
			<div>
				<strong>Artist</strong>
			</div>
			<div class="flex gutter-b-2">
				<input
					class="box-12"
					name="card-artist"
					type="text"
					data-value="{:this.app.card.artist:}|{card.artist}|"
					onchange="this.app.card.artist = this.value || ''"
					onkeyup="this.app.card.artist = this.value || ''"
				>
			</div>
		</label>
	`,
	cardClanUI: `
		<label>
			<div>
				<strong>Clan (eg: Celestial)</strong>
			</div>
			<div class="flex gutter-b-2">
				<input
					class="box-12"
					name="card-name"
					type="text"
					data-value="{:this.app.card.clan:}|{card.clan}|"
					onchange="this.app.card.clan = this.value || ''"
					onkeyup="this.app.card.clan = this.value || ''"
				>
			</div>
		</label>
	`,
	cardEffectUI: `
		<label>
			<div>
				<strong>Effect</strong>
			</div>
			<div class="flex gutter-b-2">
				<div class="grow-wrap box-12">
					<textarea
						data-init="{:this.app.effectInputArea = this:}"
						name="card-effect"
						data-value="{:this.app.card.effect:}|{card.effect}|"
						onInput="this.parentNode.dataset.replicatedValue = this.value"
						onchange="this.app.card.effect = this.value || ''"
						onkeyup="this.app.rememberCursorPosition()"
						onclick="this.app.rememberCursorPosition()"
					></textarea>
				</div>
			</div>
		</label>
		<div>
			<div>
				<strong>Key Symobols to insert into effect text</strong>
			</div>
			<div class="flex">
				<!-- forEach: "index" -->
					<div class="box-2 flex column vhcenter gutter-trbl-.25 clickable" onclick="this.app.insertEffectSymbol(this.app.keywords[this.index])" data-init="{:this.innerHTML = createMiniKeyword('/assets/symbol/' + cardOptionsData.icons[this.app.keywords[this.index]]).svg:}"></div>
				<!-- in: keywords -->
			</div>
		</div>
	`,
	cardLevelUI: `
		<label>
			<div>
				<strong>Level Up Condition</strong>
			</div>
			<div class="flex gutter-b-2">
				<div class="grow-wrap box-12">
					<textarea
						data-init="{:this.app.levelInputArea = this:}"
						name="level-cond"
						data-value="{:this.app.card.lvup:}|{card.lvup}|"
						onInput="this.parentNode.dataset.replicatedValue = this.value"
						onchange="this.app.card.lvup = this.value || ''"
						onkeyup="this.app.rememberLevelCursorPosition()"
						onclick="this.app.rememberLevelCursorPosition()"
					></textarea>
				</div>
			</div>
		</label>
		<div>
			<div>
				<strong>Key Symobols to insert into level up text</strong>
			</div>
			<div class="flex">
				<!-- forEach: "index" -->
					<div class="box-2 flex column vhcenter gutter-trbl-.25 clickable" onclick="this.app.insertLevelEffectSymbol(this.app.keywords[this.index])" data-init="{:this.innerHTML = createMiniKeyword('/assets/symbol/' + cardOptionsData.icons[this.app.keywords[this.index]]).svg:}"></div>
				<!-- in: keywords -->
			</div>
		</div>
	`,
	keywordChoiceUI: `
		<div>
			<div>
				<strong>Select Keywords</strong>
			</div>
			<div class="flex">
				<!-- forEach: "index" -->
					<label class="box-3 flex column vhcenter gutter-trbl-.25 clickable {:this.app.card.keywords.some(word=>word===this.app.keywords[this.index]) ? '' : 'ghost' :}|{card.keywords.length}|" onclick="this.app.toggleKeyword(this.app.keywords[this.index])">
						<div data-init="{:this.innerHTML = createMiniKeyword('/assets/symbol/' + cardOptionsData.icons[this.app.keywords[this.index]]).svg:}"></div>
					</label>
				<!-- in: keywords -->
			</div>
		</div>
	`,
	speedSelectorUI: `
		<label>
			<div>
				<strong>Card Frame Type</strong>
			</div>
			<div class="flex gutter-b-2">
				<select name="rarity" class="box-12" onchange="this.app.card.speed = this.value" data-value="{:this.app.card.speed:}|{card.speed}|">
					<!-- forEach: "index" -->
						<option value="{:this.app.spellSpeedOptions[this.index]:}">{:this.app.spellSpeedOptions[this.index]:}</option>
					<!-- in: spellSpeedOptions -->
				</select>
			</div>
		</label>
	`,
	blueWordsUI: `
		<div class="gutter-t-.5 {:this.app.card.blueWords.length ? 'gutter-b-2-.5' : '' :}|{card.blueWords.length}|">
			<div class="flex gutter-b-2-.5">
				<div class="grow">
					<strong>Other Cards Mentioned in Effect</strong>
				</div>
				<button onclick="this.app.card.blueWords.push('')">Add Mention</button>
			</div>
			<!-- forEach: "index" -->
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
		<div class="gutter-t-.5 {:this.app.card.orangeWords.length ? 'gutter-b-2-.5' : '' :}|{card.orangeWords.length}|">
			<div class="flex gutter-b-2-.5">
				<div class="grow">
					<strong>Key Text mentioned in Effect</strong>
				</div>
				<button onclick="this.app.card.orangeWords.push('')">Add Mention</button>
			</div>
			<!-- forEach: "index" -->
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
		<strong>Card Art</strong>
		<label class="flex hcenter">
			<button class="gutter-trbl grow" onclick="document.getElementById('uplaod-art').click()">
				<strong>Upload Image</strong>
			</button>
			<input class="hide" type="file" id="uplaod-art" name="art" accept="image/*" onchange="this.app.processArtUpload(this)"/>
		</label>

		<div class="flex hcenter">or enter image URL</div>

		<label class="flex hcenter gutter-b-2">
			<input class="box-12" type="url" placeholder="image URL" onchange="this.app.card.art = this.value">
		</label>
	`,
})
