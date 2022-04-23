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
		card.mana = 0
		card.art = ""
		card.textBgTint = [0,0,0,0]
		card.transform = {
			x: 0,
			y: 0,
			scale: 1,
		}
		card.rarity = "none"
		card.speed = "slow"
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
			class="{:(this.app.cardInstance = this), 'update app state to point to the correct svg instance':} {:this.app.calcBgTint(), 'calculate text area background tint continiousely':}|{card.art},{card.transform.x},{card.transform.y},{card.transform.scale}|"
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

			<image id="card-frame-${controller.cardId}" width="680" height="1024" x="0" y="0" xlink:href="/assets/spell/frame${card.speed}${card.clan ? 'token': card.rarity}.png"/>
			${card.faction.length
				? `
				<image id="card-region-box-${controller.cardId}" width="220" height="280" x="405" y="56" href="/assets/regions/spell/regionbox${card.faction.length < 3 ? card.faction.length : 3}.png"/>
				<image id="card-region-1-${controller.cardId}" width="90" height="90" x="445" y="84" href="/assets/regions/${card.faction[0]}.png"/>`
				: ""
			}

			${card.faction.length > 1 ? `<image id="card-region-1-${controller.cardId}" width="90" height="90" x="494" y="140" href="/assets/regions/${card.faction[1]}.png"/>` : "" }
			${card.faction.length > 2 ? `<image id="card-region-1-${controller.cardId}" width="90" height="90" x="521" y="214" href="/assets/regions/${card.faction[2]}.png"/>` : "" }

			<rect id="mana-cost-${controller.cardId}" width="120" height="120" x="31" y="44" opacity="0"/>
			<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.mana}</text>

			<rect id="name-${controller.cardId}" width="550" height="70" x="60" y="585" opacity="0"/>
			${card.name ? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${card.name ? card.name.toUpperCase() : ""}</text>` : ''}

			${card.clan
				? `
				<rect id="clan-text-area-${controller.cardId}" width="210" height="46" x="230" y="922"  fill="#CFF" opacity="0"/>
				<text class="bold caps {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff">${card.clan}</text>
				`
				: ''
			}

			<!-- <rect id="keywords-${controller.cardId}" width="550" height="70" fill="#CFF" x="60" y="655" opacity="0.75"/> -->
			${keywordSvgs}

			<foreignObject style="background-color: rgba(0,0,0,0);" id="effect-${controller.cardId}" width="550" height="145" x="60" y="740">
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

		let previewSVG = proxymity(svg, controller)
		previewSVG.when.detach(function(){
			previewSVG.unlink()
		})
		return previewSVG
	}

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveSpell(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedSpell(context.cardId)
		window.location.reload()
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

	App.spellBuilder = controller
	let view = proxymity(template, controller)

	controller.focus = controller.focusFactory(view, "spellBuilder", "Spell Builder")
})(`
	<main class="flex hcenter gutter-rl-.5">
		<div class="card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">

			{:this.app.attached && this.app.createPreview():}|{card.name},{card.clan},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.rarity},{card.faction.length},{card.speed},{card.artist},{card.blueWords.*},{card.orangeWords.*},{attached}|

			<div class="flex hcenter gutter-tb">
				<button onclick="this.app.exportCard()">Export</button>
				<div class="gutter-rl"></div>
				<button onclick="this.app.saveCard()">Save Card</button>
				<div class="gutter-rl"></div>
				<button onclick="this.app.deleteCard()" class="{:this.app.cardId ? '' : 'hide':}|{cardId}|">Delete Card</button>
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
