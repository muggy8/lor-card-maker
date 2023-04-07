(function(template){
	let controller = Object.create(App.baseBuilderController)
	controller.attached = false

	controller.cardId = ""

	let card = controller.card = {}

	let clearCard = controller.clearCard = function(){
		let controller = this
		let card = controller.card = controller.card || {}
		controller.cardId = ""
		controller.exporting = false


		card.name = ""
		card.clan = ""
		card.effect = ""
		card.keywords = []
		card.mana = NaN
		card.art = ""
		card.textBgTint = [0,0,0,0]
		card.transform = {
			x: 0,
			y: 0,
			scale: 1,
		}
		card.rarity = "none"
		card.power = NaN
		card.health = NaN
		card.speed = "none"
		card.faction = []
		card.blueWords = []
		card.orangeWords = []
		card.effectFontSize = 34 // min should be 24
		card.artist = ""

	}
	controller.clearCard()

	let createPreview = controller.createPreview = function(cardData){

		let controller = this
		let card = cardData || controller.card
		card.effectFontSize = 34
		let keywordSvgs = card.keywords.length > 1
			? card.keywords.map(word=>createMiniKeyword("/assets/symbol/" + cardOptionsData.icons[word]))
			: card.keywords.map(word=>createWideKeyword(word, "/assets/symbol/" + cardOptionsData.icons[word]))

		if (keywordSvgs.lenght <= 0){
			keywordSvgs = ""
		}
		else if (keywordSvgs.lenght === 1){
			keywordSvgs = `
			<gtransform="translate(${(680 / 2) - (keywordSvgs[0].width / 2)}, 635)">
				${keywordSvgs[0].content}
			</g>`
		}
		else{
			let sumWidth = keywordSvgs.reduce((sum, svg)=>sum + svg.width, 0)
			let startX = (680 / 2) - (sumWidth / 2)
			let xOffset = 0
			keywordSvgs = keywordSvgs.reduce((sum, svg)=>{
				let summation = sum + `
					<g transform="translate(${startX + xOffset}, 635)">
						${svg.content}
					</g>`
				xOffset += svg.width
				return summation
			}, "")
		}

		let svg = `
		<svg
			width="680" height="1024"
			xmlns="http://www.w3.org/2000/svg"
			viewbox="0 0 680 1024"
			class="{:this.app.calcBgTint(), 'calculate text area background tint continiousely':}|{card.art},{card.transform.x},{card.transform.y},{card.transform.scale}|"
		>
		<foreignObject style="background-color: rgba(0,0,0,0);" id="cropper-${controller.cardId}" width="680" height="1024" x="0" y="0">
			<canvas id="cropper-canvas-${controller.cardId}" width="680" height="1024"></canvas>
		</foreignObject>

			<clipPath id="art-mask-${controller.cardId}">
				<ellipse rx="240" ry="240" cx="340" cy="294"/>
			</clipPath>

			${card.art
				? `
					<image
						id="card-art"
						clip-path="url(#art-mask-${controller.cardId})"
						xlink:href="${card.art}"
						x="{:this.app.card.transform.x:}|{card.transform.x}|"
						y="{:this.app.card.transform.y:}|{card.transform.y}|"
						preserveAspectRatio="xMidYMid meet"
						width="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"
						height="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"
					/>
					<image id="card-background-${controller.cardId}" width="634" height="470" x="23" y="463" xlink:href="/assets/spell/background.png"/>
					<path class="color-mixer" id="card-text-color-mix" d="
						M 20,500
						l 110,-50
						a 240 200 0 0 0 420, 0
						l 110,50
						v 410
						l -320,30
						l -320,-30
						Z
					" fill="rgba({:this.app.card.textBgTint.join(','):}|{card.textBgTint}|)"/>
					`
					: `<image id="card-background-${controller.cardId}" width="634" height="470" x="23" y="463" xlink:href="/assets/spell/background-inverted.png"/>`
			}

			<image id="card-frame-${controller.cardId}" width="680" height="1024" x="0" y="0" xlink:href="/assets/spell/frame${card.speed}${
				card.speed === "none"
					? ("")
					: (card.clan ? 'token': card.rarity)
			}.png"/>
			${card.faction.length
				? `
				<image id="card-region-box-${controller.cardId}" width="220" height="280" x="405" y="56" href="/assets/regions/spell/regionbox${card.faction.length < 3 ? card.faction.length : 3}.png"/>
				<image id="card-region-1-${controller.cardId}" width="90" height="90" x="445" y="84" href="/assets/regions/${card.faction[0]}.png"/>`
				: ""
			}

			${card.faction.length > 1 ? `<image id="card-region-1-${controller.cardId}" width="90" height="90" x="494" y="140" href="/assets/regions/${card.faction[1]}.png"/>` : "" }
			${card.faction.length > 2 ? `<image id="card-region-1-${controller.cardId}" width="90" height="90" x="521" y="214" href="/assets/regions/${card.faction[2]}.png"/>` : "" }

			<rect id="mana-cost-${controller.cardId}" width="120" height="120" x="31" y="44" opacity="0"/>
			${typeof card.mana === 'number' && !isNaN(card.mana)
				? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.mana}</text>`
				: ""
			}

			<rect id="name-${controller.cardId}" width="550" height="70" x="60" y="585" opacity="0"/>
			${card.name ? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${card.name ? card.name.toUpperCase() : ""}</text>` : ''}

			<rect id="power" width="106" height="92" x="47" y="430" fill="#CFF" opacity="0"/>
			${ typeof card.power === 'number' &&  !isNaN(card.power) ? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.power}</text>` : undefined }

			<rect id="health" width="106" height="92" x="522" y="430" fill="#CFF" opacity="0"/>
			${ typeof card.health === 'number' &&  !isNaN(card.health) ? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.health}</text>` : undefined}

			${card.clan
				? `
				<rect id="clan-text-area-${controller.cardId}" width="210" height="46" x="230" y="922"  fill="#CFF" opacity="0"/>
				<text class="clan-text caps {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="36" fill="#bbb" stroke="#bbb">${card.clan}</text>
				`
				: ''
			}

			<!-- <rect id="keywords-${controller.cardId}" width="550" height="70" fill="#CFF" x="60" y="655" opacity="0.75"/> -->
			${keywordSvgs}

			<foreignObject style="background-color: rgba(0,0,0,0);" id="effect-${controller.cardId}" width="550" height="${145 + (keywordSvgs ? 0 : 70)}" x="60" y="${keywordSvgs ? 740 : 655}">
				<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app && this.app.effectResize(this)):}">${controller.decorateText(card.effect)}</div>
			</foreignObject>

			<rect id="artist-${controller.cardId}" width="280" height="30" fill="#FFF" x="12" y="990" opacity="0"/>
			${card.artist ? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {align:'left'})).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">✍: ${card.artist ? card.artist : ""}</text>` : ''}

			<g class="{:!${!!card.art} || this.app.exporting ? 'hide' : '' :}|{exporting}|">
				<path d="
					M 340, 10
					l 35, 60
					h -70
					Z
				" fill="#fff" opacity="0.8" id="arrow-up-${controller.cardId}" onclick="this.app.card.transform.y -= 10" class="clickable" />
				<path d="
					M 340, 575
					l 35, -60
					h -70
					Z
				" fill="#fff" opacity="0.8" id="arrow-down-${controller.cardId}" onclick="this.app.card.transform.y += 10" class="clickable" />
				<path d="
					M 55, 300
					l 60, -35
					v 70
					Z
				" fill="#fff" opacity="0.8" id="arrow-left-${controller.cardId}" onclick="this.app.card.transform.x -= 10" class="clickable" />
				<path d="
					M 625, 300
					l -60, -35
					v 70
					Z
				" fill="#fff" opacity="0.8" id="arrow-right-${controller.cardId}" onclick="this.app.card.transform.x += 10" class="clickable" />

				<text font-size="156" x="180" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale += 0.05">+</text>
				<text font-size="156" x="440" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale -= 0.05">-</text>
			</g>

		</svg>`

		let templateEl = document.createElement("template")
		templateEl.innerHTML = svg.trim()
		let svgEl = templateEl.content.querySelector("svg")

		let previewSVG = proxymity(svgEl, controller)
		previewSVG.when.detach(function(){
			previewSVG.unlink()
		})
		previewSVG.when.append(function(){
			controller.cardInstance = svgEl
		})
		return previewSVG
	}

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveSpell(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(id){
		let context = this
		await App.storage.delSavedSpell(id || context.cardId)
		!id && window.location.reload()
	}

	let calcBgTint = controller.calcBgTint = async function(){
		let controller = this
		if (!controller.card.art){
			return
		}

		let canvasId = `cropper-canvas-${controller.cardId}`
		let canvas = controller.cardInstance.getElementById(canvasId)
		let ctx = canvas.getContext('2d')
		let image = new Image();
		let fac = new FastAverageColor()

		// image.src = controller.card.art
		let cardArtBase64 = controller.card.art
		if (!cardArtBase64.trim().startsWith("data:")){ // if it's not a base 64 string, then it's a URL so we gotta convert it cuz shit's werid
			cardArtBase64 = await imageToBase64(cardArtBase64)
		}

		image.src = cardArtBase64

		image.onload = function(){

			let
				// the stats of the image and where on the image to render
				ix = -card.transform.x,
                iy = -card.transform.y,
                // iWidth = image.width,
                // iHeight = image.height,

                scale = card.transform.scale,

				// control location of the draw frame on the image: this ammounts to a square of 100 units on each side at the center of the spell's circle
                dx = 290,
                dy = 244,
                dWidth = 100,
                dHeight = 100,

				// control scale of the drawing
                sx = (ix / scale) + (dx / scale),
                sy = (iy / scale) + (dy / scale),
                sWidth = 100 / scale,
                sHeight = 100 / scale

			ctx.drawImage(image, sx, sy, sWidth, sHeight) // fallback if the next call fails for some reason
			ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

			let imageData = ctx.getImageData(dx, dy, dWidth, dHeight);

			controller.card.textBgTint = fac.getColorFromArray4(imageData.data)

			fac.destroy()
		}
	}

	function removeItemFromArray(array, item) {
		let i = array.length;
	
		while (i--) {
			if (array[i] === item) {
				array.splice(i, 1);
			}
		}
	}

	function clearSpellSpeedKeywords(card){
		cardOptionsData.spellSpeedOptions.forEach(keyword=>removeItemFromArray(card.keywords, keyword))
	}
	let automateFrametype = controller.automateFrametype = function(card, prop){
		
		switch(prop){
			case "speed": 
				clearSpellSpeedKeywords(card)
				if (card.speed !== 'none'){
					card.keywords.push(card.speed)
				}
				if (card.speed !== 'equipment'){
					card.power = NaN
					card.health = NaN
				}
				return;
			case "health":
				if (!isNaN(card.health) && typeof card.health === "number"){
					card.speed = 'equipment'
				} 
				return;
			case "power": 
				if (!isNaN(card.power) && typeof card.power === "number"){
					card.speed = 'equipment'
				} 
				return;
			case "keywords": 
				let firstSpeedKeywordIndex = cardOptionsData.spellSpeedOptions
					.map(keyword=>card.keywords.indexOf(keyword)) // find first instance of each speed as a keyword
					.filter(index=>index > -1)	// cut out all the unfound ones
					.sort((a,b)=>a-b) // sort the list from earliest to latest
					[0] // get the first index of it.

				if (firstSpeedKeywordIndex !== undefined){
					card.speed = card.keywords[firstSpeedKeywordIndex]
					if (card.speed === 'equipment'){
						card.power = card.power || 0,
						card.health = card.health || 0
					}
				}
				else{
					card.speed = 'none'
				}
				return 
		}
	}

	App.spellBuilder = controller
	let view = proxymity(template, controller)

	controller.focus = controller.focusFactory(view, "spellBuilder", "Spell Builder")
})(`
	<main class="flex hcenter gutter-rl-.5">
		<div class="card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">

			<!-- {:this.app.automateFrametype(this.app.card, "speed"):}|{card.speed}| -->
			<!-- {:this.app.automateFrametype(this.app.card, "health"):}|{card.health}| -->
			<!-- {:this.app.automateFrametype(this.app.card, "power"):}|{card.power}| -->
			<!-- {:this.app.automateFrametype(this.app.card, "keywords"):}|{card.keywords.length}| -->

			{:this.app.attached && this.app.createPreview():}|{card.name},{card.clan},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.rarity},{card.faction.length},{card.speed},{card.artist},{card.blueWords.*},{card.orangeWords.*},{attached},{card.health},{card.power}|

			<div class="flex hcenter gutter-tb">
				<button onclick="this.app.deleteCard()" class="{:this.app.cardId ? '' : 'hide':}|{cardId}|">{:App.lang[App.langChoice].delete_card:}</button>
				<div class="gutter-rl"></div>
				<button onclick="this.app.saveCard()">{:App.lang[App.langChoice].save_card:}</button>
				<div class="gutter-rl"></div>
				<button onclick="this.app.exportCard()">{:App.lang[App.langChoice].export:}</button>
			</div>

			<div class="gutter-b-3"></div>
		</div>
		<div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.cardOptionsController = App.cardOptions(this.app.card, [
				"none",
				"common",
				"rare",
				"epic"
			]):}
		</div>
	</main>
`)
