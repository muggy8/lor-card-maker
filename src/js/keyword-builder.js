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
		card.effect = ""
		// card.art = ""
		card.transform = {
			x: 0,
			y: 0,
			scale: 1,
		}
		card.blueWords = []
		card.orangeWords = []
		card.effectFontSize = 34 // min should be 24
		// card.artist = ""
        card.frameType = 0

	}
	controller.clearCard()

    let contentValues = controller.contentValues = {
        "frame0": {
            nameY: 146,
            effectY: 210
        },
        "frame1": {
            nameY: 126,
            effectY: 190,
        },
        "frame2": {
            nameY: 106,
            effectY: 170,
        },
        "frame3": {
            nameY: 86,
            effectY: 150,
        },
        "frame4": {
            nameY: 66,
            effectY: 130,
        },
        "frame5": {
            nameY: 46,
            effectY: 110,
        },
    }

    controller.resetText = function(textSource){
		let contentReplacement = new Text(textSource.textContent)
		textSource.replaceChildren(contentReplacement)
		textSource.removeAttribute("x")
		textSource.removeAttribute("y")
		textSource.removeAttribute("transform")
		textSource.removeAttribute("style")
		textSource.removeAttribute("text-anchor")
	}

    controller.createPreview = function(cardData){
        let controller = this
		let card = cardData || controller.card
		card.effectFontSize = 34

        let svg = `
        <svg
            width="524" height="373"
            xmlns="http://www.w3.org/2000/svg"
            viewbox="0 0 524 373"
        >
            <image id="frame-bg-${controller.cardId}" width="524" height="373" x="0" y="0" href="/assets/keyword/frame{:this.app.card.frameType:}|{card.frameType}|.png"/>
            <rect id="name-text-area-${controller.cardId}" width="450" height="56" x="37" y="{:this.app.contentValues['frame' + this.app.card.frameType].nameY:}|{card.frameType}|" fill="#FFF" opacity="0"/>
            ${card.name ? `<text class="{:this.app.resetText(this); proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}|{card.frameType}|" font-size="36" fill="#fad65a" stroke="#fad65a" font-style="900">${card.name ? card.name.toUpperCase() : ""}</text>` : ''}

            <foreignObject style="background-color: rgba(0,0,0,0);" id="effect-${controller.cardId}" width="450" height="210" x="37" y="{:this.app.contentValues['frame' + this.app.card.frameType].effectY:}|{card.frameType}|">
				<div xmlns="http://www.w3.org/1999/xhtml"  class="key-text" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app && this.app.effectResize(this)).then(()=>this.app && this.app.reselectFrame(this)):}">${controller.decorateText(card.effect)}</div>
			</foreignObject>

            <rect id="artist-area-${controller.cardId}" width="220" height="30" fill="#FFF" x="20" y="350" opacity="0"/>
            ${card.artist ? `<text class="{:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {align:'left'})).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">✍: ${card.artist ? card.artist : ""}</text>` : ''}
        </svg>
        `

        let previewSVG = proxymity(svg, controller)
		previewSVG.when.detach(function(){
			previewSVG.unlink()
		})

		return previewSVG
    }

    controller.reselectFrame = function(effectContainer){
        let controller = this

        if (!effectContainer.isConnected){
			return
		}

		return new Promise(accept=>setTimeout(function(){

			controller.card.frameType = Math.floor(effectContainer.scrollHeight/controller.card.effectFontSize)

			if (controller.card.frameType > 5){
				controller.card.frameType = 5
			}

			accept()
		}, 1))

    }

    let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveKeyword(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedKeyword(context.cardId)
		window.location.reload()
	}

	App.keywordBuilder = controller
	let view = proxymity(template, controller)

	controller.focus = controller.focusFactory(view, "keywordBuilder", "keyword Builder")

})(`
    <main class="flex hcenter gutter-rl-.5">
		<div class="card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.attached && this.app.createPreview():}|{card.name},{card.effect},{card.blueWords.*},{card.orangeWords.*},{attached}|

			<div class="flex hcenter gutter-tb">
				<button onclick="this.app.deleteCard()" class="{:this.app.cardId ? '' : 'hide':}|{cardId}|">{:App.lang[App.langChoice].delete_keyword:}</button>
				<div class="gutter-rl"></div>
				<button onclick="this.app.saveCard()">{:App.lang[App.langChoice].save_keyword:}</button>
				<div class="gutter-rl"></div>
				<button onclick="this.app.exportCard()">{:App.lang[App.langChoice].export:}</button>
			</div>

			<div class="gutter-b-3"></div>
		</div>
		<div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">
			{:this.app.cardOptionsController = App.cardOptions(this.app.card):}
		</div>
	</main>
`)
