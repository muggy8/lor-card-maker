(function(template){
	let controller = App.unitController = Object.create(App.baseBuilderController)

	controller.clearCard = function(){
		let controller = this
		let card = controller.card = controller.card || {}
		controller.cardId = ""

		card.name = ""
		card.clan = ""
		card.effect = ""
		card.effectHeight = 0
		card.lvup = ""
		card.lvupHeight = 0
		card.keywords = []
		card.mana = 0
		card.art = ""
		card.transform = {
			x: 0,
			y: 0,
			scale: 1,
		}
		card.rarity = "gemless"
		card.power = 0
		card.health = 0
		card.faction = []
		card.blueWords = []
		card.orangeWords = []
		card.effectFontSize = 34 // min should be 24
		card.levelFontSize = 34 // min should be 24
		card.artist=""

		controller.exporting = false
		controller.cardId = ""
	}

	controller.createPreview = function(cardData){
		let controller = this
		let card = cardData || controller.card
		card.effectFontSize = 34
		card.levelFontSize = 34
		let keywordSvgs = card.keywords.length > 1
			? card.keywords.map(word=>createMiniKeyword("/assets/symbol/" + cardOptionsData.icons[word]))
			: card.keywords.map(word=>createWideKeyword(word, "/assets/symbol/" + cardOptionsData.icons[word]))

		if (keywordSvgs.lenght <= 0){
			keywordSvgs = ""
		}
		else if (keywordSvgs.lenght === 1){
			keywordSvgs = `
			<gtransform="translate(${(680 / 2) - (keywordSvgs[0].width / 2)}, 425)">
				${keywordSvgs[0].content}
			</g>`
		}
		else{
			let sumWidth = keywordSvgs.reduce((sum, svg)=>sum + svg.width, 0)
			let startX = (680 / 2) - (sumWidth / 2)
			let xOffset = 0
			keywordSvgs = keywordSvgs.reduce((sum, svg)=>{
				let summation = sum + `
					<g transform="translate(${startX + xOffset}, 425)">
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
			>

				${controller.artMask}

				${card.art
				? `
					<image
						id="card-art-${controller.cardId}"
						clip-path="url(#art-mask-${controller.cardId})"
						xlink:href="${card.art}"
						x="{:this.app.card.transform.x:}|{card.transform.x}|"
						y="{:this.app.card.transform.y:}|{card.transform.y}|"
						preserveAspectRatio="xMidYMid meet"
						width="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"
						height="{:1024 * this.app.card.transform.scale:}|{card.transform.scale}|"
					/>`
					: ""
				}

				<image id="art-shade-${controller.cardId}" clip-path="url(#art-mask-${controller.cardId})" width="680" height="1024" x="0" y="0" xlink:href="/assets/common/theencrouchingdarkness.png"/>
				<image id="card-frame-${controller.cardId}" width="680" height="1024" x="0" y="0" xlink:href="${controller.rendererOptions.framePath}${card.rarity}.png"/>

				${card.faction.length
					? `
						<image id="card-region-box-${controller.cardId}" width="120" height="360" x="${550 + (controller.rendererOptions.region.offsetLeft || 0) - (controller.rendererOptions.region.offsetRight || 0)}" y="${37 + (controller.rendererOptions.region.offsetTop || 0) - (controller.rendererOptions.region.offsetBottom || 0)}" href="${controller.rendererOptions.region.bgPath}${card.faction.length < 3 ? card.faction.length : 3}.png"/>
						<image id="card-region-1-${controller.cardId}" width="90" height="90" x="${567 + (controller.rendererOptions.region.offsetLeft || 0) - (controller.rendererOptions.region.offsetRight || 0)}" y="${66 + (controller.rendererOptions.region.offsetTop || 0) - (controller.rendererOptions.region.offsetBottom || 0)}" href="/assets/regions/${card.faction[0]}.png"/>`
					: ""
				}

				${card.faction.length > 1 ? `<image id="card-region-1-${controller.cardId}" width="90" height="90" x="${567 + (controller.rendererOptions.region.offsetLeft || 0) - (controller.rendererOptions.region.offsetRight || 0)}" y="${156 + (controller.rendererOptions.region.offsetTop || 0) - (controller.rendererOptions.region.offsetBottom || 0)}" href="/assets/regions/${card.faction[1]}.png"/>` : "" }

				${card.faction.length > 2 ? `<image id="card-region-1-${controller.cardId}" width="90" height="90" x="${567 + (controller.rendererOptions.region.offsetLeft || 0) - (controller.rendererOptions.region.offsetRight || 0)}" y="${246 + (controller.rendererOptions.region.offsetTop || 0) - (controller.rendererOptions.region.offsetBottom || 0)}" href="/assets/regions/${card.faction[2]}.png"/>` : ""}

				${card.clan
					? `
						<image id="card-clan-${controller.cardId}" width="360" height="84" x="160" y="14" xlink:href="${controller.rendererOptions.clan.bgPath}"/>
						<rect id="clan-text-area-${controller.cardId}" width="200" height="46" x="240" y="32" opacity="0"/>
						<text class="clan-text caps {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="36" fill="#bbb" stroke="#bbb">${card.clan}</text>`
					: ""
				}

				<rect id="mana-cost-${controller.cardId}" width="120" height="120" x="31" y="44" opacity="0"/>
				${typeof card.mana === 'number' && !isNaN(card.mana)
					? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.mana}</text>`
					: ""
				}


				${Object.prototype.hasOwnProperty.call(card, "power")
					? `<rect id="power-${controller.cardId}" width="86" height="82" x="44" y="873" opacity="0"/>
					<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.power}</text>`
					: ""
				}

				${Object.prototype.hasOwnProperty.call(card, "health")
					? `<rect id="health-${controller.cardId}" width="86" height="82" x="552" y="873" opacity="0"/>
					<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.health}</text>`
					: ""
				}

				<g id="all-text-group-${controller.cardId}" transform="translate(0, {: ${!!card.lvup} ? ( 130 - this.app.card.lvupHeight > 0 ? 130 - this.app.card.lvupHeight : 0 ) : 174 :}|{card.lvupHeight}|)">
					<foreignObject style="background-color: rgba(0,0,0,0);" id="level-up-condition-${controller.cardId}" width="510" height="130" x="85" y="720">
						<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.levelFontSize:}|{card.levelFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #d6946b" data-init="{:proxymity.on.renderend.then(()=>this.app && this.app.effectResize(this, 'levelFontSize')).then(()=>this.app && (this.app.card.lvupHeight = this.scrollHeight || this.app.card.lvupHeight)):}">${controller.decorateText(card.lvup)}</div>
					</foreignObject>

					${
						card.lvup
						? '<image id="card-level-bar-${controller.cardId}" width="680" height="44" x="0" y="680" xlink:href="/assets/champion/levelupbar.png"/>'
						: ""
					}

					<g id="effect-group-${controller.cardId}" transform="translate(0, {: 162 - this.app.card.effectHeight > 0 ? 162 - this.app.card.effectHeight : 0:}|{card.effectHeight}|)">
						<foreignObject style="background-color: rgba(0,0,0,0);" id="effect-${controller.cardId}" width="510" height="162" x="85" y="520">
							<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app && this.app.effectResize(this, 'effectFontSize')).then(()=>this.app && (this.app.card.effectHeight = this.scrollHeight || this.app.card.effectHeight) ):}">${controller.decorateText(card.effect)}</div>
						</foreignObject>

						<!-- <rect id="keywords-${controller.cardId}" width="560" height="70" fill="#CFF" x="60" y="450" opacity="0.75"/> -->
						${keywordSvgs}

						<rect id="name-${controller.cardId}" width="510" height="70" x="85" y="${card.keywords.length ? 380 : 380 + 70 }" opacity="0"/>
						${card.name ? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${card.name ? card.name.toUpperCase() : ""}</text>` : ''}
					</g>
				</g>

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
						M 340, 980
						l 35, -60
						h -70
						Z
					" fill="#fff" opacity="0.8" id="arrow-down-${controller.cardId}" onclick="this.app.card.transform.y += 10" class="clickable" />
					<path d="
						M 0, 550
						l 60, -35
						v 70
						Z
					" fill="#fff" opacity="0.8" id="arrow-left-${controller.cardId}" onclick="this.app.card.transform.x -= 10" class="clickable" />
					<path d="
						M 680, 550
						l -60, -35
						v 70
						Z
					" fill="#fff" opacity="0.8" id="arrow-right-${controller.cardId}" onclick="this.app.card.transform.x += 10" class="clickable" />

					<text font-size="156" x="180" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale += 0.05">+</text>
					<text font-size="156" x="440" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale -= 0.05">-</text>
				</g>
			</svg>`

		try{
			let templateEl = document.createElement("template")
			templateEl.innerHTML = svg.trim()
			let svgEl = templateEl.content.querySelector("svg")

			let previewSVG = proxymity(svgEl, controller)
			previewSVG.when.detach(async function(){
				previewSVG.unlink()
			})
			previewSVG.when.append(function(){
				controller.cardInstance = svgEl
			})
			return previewSVG
		}
		catch(uwu){
			// whatever. we'll re-render real-fast again anyways so who cares
			console.warn(uwu)
		}
	}

	controller.gemOptions = undefined

	controller.template = template

	Object.defineProperty(controller, "artMask", {
		configurable: true,
		enumerable: true,
		get: function(){
			let controller = this
			return `
				<clipPath id="art-mask-${controller.cardId}">
					<path
						d="
							M 25, 50
							h 630
							v 900
							l -315, 15
							l -315, -15
							Z
						"
					/>
				</clipPath>
			`
		}
	})



	controller.generateView = function(){
		let controller = this

		controller.clearCard()

		let card = controller.card

		// generates the watcher subscriptions based on which props of hte watcherList exists on card
		let watchersToSubscribe = Object.keys(controller.generateView.watcherList)
			.map(potentiallyWatcheableProp=>{
				if (Object.prototype.hasOwnProperty.call(card, potentiallyWatcheableProp)){
					return `{${controller.generateView.watcherList[potentiallyWatcheableProp]}}`
				}
				return null
			})

		watchersToSubscribe.push("{attached}")

		watchersToSubscribe
			.filter(i=>!!i)
			.join(",")


		let template = `
			<main class="flex hcenter">
				<div class="card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">

					{:this.app.attached && this.app.createPreview(undefined, this):}|${watchersToSubscribe}|

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
					{:this.app.cardOptionsController = App.cardOptions(this.app.card, ${JSON.stringify(controller.gemOptions)}):}
				</div>
			</main>
		`

		return proxymity(template, controller)
	}
	controller.generateView.watcherList = {
		name: "card.name",
		effect: "card.effect",
		lvup: "card.lvup",
		keywords: "card.keywords.length",
		mana: "card.mana",
		art: "card.art",
		rarity: "card.rarity",
		faction: "card.faction.length",
		clan: "card.clan",
		blueWords: "card.blueWords.*",
		orangeWords: "card.orangeWords.*",
		power: "card.power",
		health: "card.health",
		artist: "card.artist",
	}
})()
