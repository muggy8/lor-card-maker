(function(template){
	let controller = {}

	let focus = controller.focus = function(){
		iconCache.promise.then(()=>{
			App.currentView = view
			clearCard()
			window.scroll(0,0)
		})
	}

	let card = controller.card = {}
	let cardEffectMinSize = 24
	let clearCard = controller.clearCard = function(){
		card.name = ""
		card.clan = ""
		card.effect = ""
		card.effectHeight = 0
		card.keywords = []
		card.mana = 0
		card.art = ""
		card.transform = {
			x: 0,
			y: 0,
			scale: 1,
		}
		card.power = 0
		card.health = 0
		card.rarity = "gemless"
		card.faction = ""
		card.blueWords = []
		card.orangeWords = []
		card.effectFontSize = 34 // min should be 24

		controller.exporting = false
	}
	clearCard()

	let createPreview = controller.createPreview = function(){
		let keywordSvgs = card.keywords.length > 1
			? card.keywords.map(word=>createMiniKeyword("/assets/symbol/" + cardOptionsData.icons[word]))
			: card.keywords.map(word=>createWideKeyword(word, "/assets/symbol/" + cardOptionsData.icons[word]))

		if (keywordSvgs.lenght <= 0){
			keywordSvgs = ""
		}
		else if (keywordSvgs.lenght === 1){
			keywordSvgs = `
			<gtransform="translate(${(680 / 2) - (keywordSvgs[0].width / 2)}, 565)">
				${keywordSvgs[0].content}
			</g>`
		}
		else{
			let sumWidth = keywordSvgs.reduce((sum, svg)=>sum + svg.width, 0)
			let startX = (680 / 2) - (sumWidth / 2)
			let xOffset = 0
			keywordSvgs = keywordSvgs.reduce((sum, svg)=>{
				let summation = sum + `
					<g transform="translate(${startX + xOffset}, 565)">
						${svg.content}
					</g>`
				xOffset += svg.width
				return summation
			}, "")
		}

		let updatedEffect = card.blueWords.reduce((cardEffect, blueWord)=>{
			if (!blueWord){
				return cardEffect
			}
			return cardEffect.split(blueWord).join(`<span style="color: #49a0f8" xmlns="http://www.w3.org/1999/xhtml">${blueWord}</span>`)
		}, card.effect)

		updatedEffect = card.orangeWords.reduce((cardEffect, orangeWord)=>{
			if (!orangeWord){
				return cardEffect
			}
			return cardEffect.split(orangeWord).join(`<span style="color: #fad65a" xmlns="http://www.w3.org/1999/xhtml">${orangeWord}</span>`)
		}, updatedEffect)

		Object.keys(cardOptionsData.icons).forEach(iconName=>{
			let expectedIconText = `<${iconName}/>`
			updatedEffect = updatedEffect.split(expectedIconText).join(`<div xmlns="http://www.w3.org/1999/xhtml" style="height: 0.8em; width: 1em; display:inline-block; background-repeat: no-repeat; background-size: contain; background-image: url('${iconCache[iconName]}');"></div>`)
		})

		updatedEffect = updatedEffect.split("\n").map(sentence=>`<div>${sentence}</div>`).join("")

		let svg = `
			<svg
				width="680" height="1024"
				xmlns="http://www.w3.org/2000/svg"
				viewbox="0 0 680 1024"
				class="{:this.app.cardInstance = this:}"
			>

				<clipPath id="art-mask">
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
						height="{:1024 * this.app.card.transform.scale:}|{card.transform.scale}|"
					/>`
					: ""
				}

				<image id="card-frame" width="680" height="1024" x="0" y="0" xlink:href="/assets/follower/frame${card.rarity}.png"/>

				${card.faction
					? `<image id="card-region" width="100" height="100" x="290" y="864" xlink:href="/assets/regions/${card.faction}.png"/>`
					: ""
				}

				${card.clan
					? `
						<image id="card-clan" width="360" height="84" x="160" y="14" xlink:href="/assets/follower/typing.png"/>
						<rect id="clan-text-area" width="200" height="46" x="240" y="32" opacity="0"/>
						<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff">${card.clan}</text>`
					: ""
				}

				<rect id="mana-cost" width="120" height="120" x="31" y="44" opacity="0"/>
				<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.mana}</text>

				<rect id="power" width="86" height="82" x="44" y="873" opacity="0"/>
				<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.power}</text>

				<rect id="health" width="86" height="82" x="552" y="873" opacity="0"/>
				<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${card.health}</text>

				<g id="group-moveable" transform="translate(0, {: 192 - this.app.card.effectHeight > 0 ? 192 - this.app.card.effectHeight : 0:}|{card.effectHeight}|)">
					<foreignObject id="effect" width="550" height="192" x="60" y="660">
						<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app.effectResize(this)).then(()=>this.app.card.effectHeight = this.scrollHeight):}">${updatedEffect}</div>
					</foreignObject>

					<!--<rect id="keywords" width="560" height="70" fill="#CFF" x="60" y="590" opacity="0.75"/>-->
					${keywordSvgs}

					<rect id="name" width="560" height="70" x="60" y="${card.keywords.length ? 515 : 515 + 70 }" opacity="0"/>
					${card.name ? `<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${card.name ? card.name.toUpperCase() : ""}</text>` : ''}
				</g>

				<g class="{:!this.app.card.art || this.app.exporting ? 'hide' : '' :}|{card.art},{exporting}|">
				<path d="
					M 340, 10
					l 35, 60
					h -70
					Z
				" fill="#fff" opacity="0.8" id="arrow-up" onclick="this.app.card.transform.y -= 10" class="clickable" />
				<path d="
					M 340, 980
					l 35, -60
					h -70
					Z
				" fill="#fff" opacity="0.8" id="arrow-down" onclick="this.app.card.transform.y += 10" class="clickable" />
				<path d="
					M 0, 550
					l 60, -35
					v 70
					Z
				" fill="#fff" opacity="0.8" id="arrow-left" onclick="this.app.card.transform.x -= 10" class="clickable" />
				<path d="
					M 680, 550
					l -60, -35
					v 70
					Z
				" fill="#fff" opacity="0.8" id="arrow-right" onclick="this.app.card.transform.x += 10" class="clickable" />

				<text font-size="156" x="180" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale += 0.05">+</text>
				<text font-size="156" x="440" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale -= 0.05">-</text>
			</g>
			</svg>
		`

		return proxymity(svg, controller)
	}

	let wrapText = controller.wrapText = function(textEle, resize, config = {}){
		let wrapCall = d3plus.textwrap()
			.container(d3.select(textEle))
			.resize(!!resize)

		if (config.align){
			wrapCall.align(config.align)
		}
		else{
			wrapCall.align("middle")
		}

		if (config.valign){
			wrapCall.valign(config.valign)
		}

		if (config.shape){
			wrapCall.shape(config.shape)
		}

		if (config.size){
			wrapCall.size(config.size)
		}

		wrapCall.draw()
	}

	let effectResize = controller.effectResize = async function(effectDiv){
		let useableHeight = effectDiv.offsetHeight
		while (effectDiv.scrollHeight > useableHeight && card.effectFontSize > cardEffectMinSize){
			card.effectFontSize--
			await proxymity.on.renderend
		}
	}

	let exportCard = controller.exportCard = async function(){
		let replaceJob = Array.from(controller.cardInstance.querySelectorAll("image"))
			.map(el=>
				getBase64FromImageUrl(el.href.baseVal)
				.then(uri=>
					el.setAttribute("xlink:href", uri)
				)
			)

		controller.exporting = true
		replaceJob.push(proxymity.on.renderend)

		await Promise.all(replaceJob)

		controller.cardInstance.querySelectorAll("foreignObject *").forEach(el=>el.removeAttribute("xmlns"))

		await saveSvgAsPng(controller.cardInstance, `${card.name || "lor-card"}.png`, {width: 680, height: 1024,})
		// await saveSvg(controller.cardInstance, `${card.name || "lor-card"}.svg`)

		controller.exporting = false
	}

	App.followerBuilder = controller
	let view = proxymity(template, controller)
})(`
	<main class="flex hcenter gutter-rl-.5">
		<div class="card-preview gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.createPreview():}|{card.name},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.transform.x},{card.transform.y},{card.transform.scale},{card.rarity},{card.faction},{card.clan},{card.blueWords.*},{card.orangeWords.*},{card.power},{card.health}|

			<div class="flex hcenter gutter-tb">
				<button onclick="this.app.exportCard()">Export</button>
			</div>

			<div class="gutter-b-3"></div>
		</div>
		<div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.cardOptionsController = App.cardOptions(this.app.card, [
				"gemless",
				"common",
				"rare",
				"epic",
			]):}
		</div>
	</main>
`)