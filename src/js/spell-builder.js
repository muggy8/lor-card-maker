(function(template){
	let controller = Object.create(App.baseBuilderController)

	controller.cardId = ""

	let card = controller.card = {}

	let clearCard = controller.clearCard = function(){
		card.name = ""
		card.effect = ""
		card.keywords = []
		card.mana = 0
		card.art = ""
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

		controller.exporting = false
	}
	clearCard()

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
			class="{:this.app.cardInstance = this:}"
		>
			<clipPath id="art-mask">
				<ellipse rx="240" ry="240" cx="340" cy="294"/>
			</clipPath>

			${card.art
				? `
				<image
					id="card-art"
					clip-path="url(#art-mask)"
					xlink:href="${card.art}"
					x="{:this.app.card.transform.x:}|{card.transform.x}|"
					y="{:this.app.card.transform.y:}|{card.transform.y}|"
					preserveAspectRatio="xMidYMid meet"
					width="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"
					height="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"
				/>`
				: ""
			}

			<image id="card-background" width="634" height="470" x="23" y="463" xlink:href="/assets/spell/background-inverted.png"/>
			<image id="card-frame" width="680" height="1024" x="0" y="0" xlink:href="/assets/spell/frame${card.speed}${card.rarity}.png"/>
			${card.faction.length
				? `
				<image id="card-region-box" width="220" height="280" x="405" y="56" href="/assets/regions/spell/regionbox${card.faction.length < 3 ? card.faction.length : 3}.png"/>
				<image id="card-region-1" width="90" height="90" x="445" y="84" href="/assets/regions/${card.faction[0]}.png"/>`
				: ""
			}

			${card.faction.length > 1 ? `<image id="card-region-1" width="90" height="90" x="494" y="140" href="/assets/regions/${card.faction[1]}.png"/>` : "" }
			${card.faction.length > 2 ? `<image id="card-region-1" width="90" height="90" x="521" y="214" href="/assets/regions/${card.faction[2]}.png"/>` : "" }

			<rect id="mana-cost" width="120" height="120" x="31" y="44" opacity="0"/>
			<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.mana}</text>

			<rect id="name" width="550" height="70" x="60" y="585" opacity="0"/>
			${card.name ? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${card.name ? card.name.toUpperCase() : ""}</text>` : ''}

			<!-- <rect id="keywords" width="550" height="70" fill="#CFF" x="60" y="655" opacity="0.75"/> -->
			${keywordSvgs}

			<foreignObject style="background-color: rgba(0,0,0,0);" id="effect" width="550" height="145" x="60" y="740">
				<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app.effectResize(this)):}">${controller.decorateText(card.effect)}</div>
			</foreignObject>

			<g class="{:!${!!card.art} || this.app.exporting ? 'hide' : '' :}|{exporting}|">
				<path d="
					M 340, 10
					l 35, 60
					h -70
					Z
				" fill="#fff" opacity="0.8" id="arrow-up" onclick="this.app.card.transform.y -= 10" class="clickable" />
				<path d="
					M 340, 575
					l 35, -60
					h -70
					Z
				" fill="#fff" opacity="0.8" id="arrow-down" onclick="this.app.card.transform.y += 10" class="clickable" />
				<path d="
					M 55, 300
					l 60, -35
					v 70
					Z
				" fill="#fff" opacity="0.8" id="arrow-left" onclick="this.app.card.transform.x -= 10" class="clickable" />
				<path d="
					M 625, 300
					l -60, -35
					v 70
					Z
				" fill="#fff" opacity="0.8" id="arrow-right" onclick="this.app.card.transform.x += 10" class="clickable" />

				<text font-size="156" x="180" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale += 0.05">+</text>
				<text font-size="156" x="440" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale -= 0.05">-</text>
			</g>

		</svg>`

		return proxymity(svg, controller)
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


	App.spellBuilder = controller
	let view = proxymity(template, controller)

	controller.focus = controller.focusFactory(view, "spellBuilder", "Spell Builder")
})(`
	<main class="flex hcenter gutter-rl-.5">
		<div class="card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.createPreview():}|{card.name},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.rarity},{card.faction.length},{card.speed},{card.blueWords.*},{card.orangeWords.*}|

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
