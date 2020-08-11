(function(template){
	let controller = {}

	let focus = controller.focus = function(){
		App.currentView = view
		clearCard()
		window.scroll(0,0)
	}

	let card = controller.card = {}
	let clearCard = controller.clearCard = function(){
		card.name = ""
		card.effect = ""
		card.keywords = []
		card.mana = 0
		card.art = ""
		card.rarity = "none"
		card.speed = "slow"
		card.faction = ""
	}
	clearCard()

	let createPreview = controller.createPreview = function(){
		let svg = `
		<svg
			width="680" height="1024"
			xmlns="http://www.w3.org/2000/svg"
			viewbox="0 0 680 1024"
		>
			<clipPath id="art-mask">
				<ellipse rx="240" ry="240" cx="340" cy="294"/>
			</clipPath>

			<image id="card-art" clip-path="url(#art-mask)" width="1360" height="1076" x="-430" y="-122" href="${card.art}" />

			<image id="card-background" width="634" height="470" x="23" y="463" href="/assets/spell/background.png"/>
			${card.faction
				? `<image id="card-region" width="100" height="100" x="285" y="836" href="./assets/regions/${card.faction}.png"/>`
				: ""
			}
			<image id="card-frame" width="680" height="1024" x="0" y="0" href="./assets/spell/frame${card.speed}${card.rarity}.png"/>

			<circle id="mana-cost" r="60" cx="91" cy="104" opacity="0"></circle>
			<text class="{:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="72" fill="#fff" stroke="#fff" font-style="bold">${card.mana}</text>

			<rect id="name" width="550" height="70" x="60" y="585" opacity="0"/>
			<text class="{:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="bold">${card.name ? card.name.toUpperCase() : ""}</text>

			<rect id="keywords" width="550" height="70" fill="#CFF" x="60" y="655" opacity="0.75"/>

			<rect id="effect" width="550" height="145" fill="#CFF" x="60" y="725" opacity="0.75"/>

		</svg>`

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

		wrapCall.draw()
	}

	App.spellBuilder = controller
	let view = proxymity(template, controller)
})(`
	<main class="flex hcenter gutter-rl-.5">
		<div class="card-preview gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.createPreview():}|{card.name},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.rarity},{card.faction},{card.speed}|
		</div>
		<div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.cardOptionsController = App.cardOptions(this.app.card):}
		</div>
	</main>
`)