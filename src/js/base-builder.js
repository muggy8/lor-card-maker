(function(){
	let cardEffectMinSize = 24
	let controller = App.baseBuilderController = {}

	let decorateText = controller.decorateText = function(textSource){
		let updatedEffect = textSource
		let context = this

		Object.keys(cardOptionsData.icons).forEach(iconName=>{
			let expectedIconText = `<${iconName}/>`
			updatedEffect = updatedEffect.split(expectedIconText).join(`<div xmlns="http://www.w3.org/1999/xhtml" style="height: 1.2em; width: 1.2em; display:inline-block; background-repeat: no-repeat; background-size: contain; background-image: url('${iconCache[iconName]}');vertical-align: middle;"></div>`)
		})

		updatedEffect = context.card.blueWords.reduce((cardEffect, blueWord)=>{
			if (!blueWord){
				return cardEffect
			}
			return cardEffect.split(blueWord).join(`<span style="color: #49a0f8" xmlns="http://www.w3.org/1999/xhtml">${blueWord}</span>`)
		}, updatedEffect)

		updatedEffect = context.card.orangeWords.reduce((cardEffect, orangeWord)=>{
			if (!orangeWord){
				return cardEffect
			}
			return cardEffect.split(orangeWord).join(`<span style="color: #fad65a" xmlns="http://www.w3.org/1999/xhtml">${orangeWord}</span>`)
		}, updatedEffect)

		updatedEffect = updatedEffect.split("\n").map(sentence=>`<div>${sentence}</div>`).join("")

		return updatedEffect
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

	let effectResize = controller.effectResize = async function(effectDiv, fontSizeProp){
		let useableHeight = effectDiv.offsetHeight
		while (effectDiv.scrollHeight > useableHeight && card[fontSizeProp] > cardEffectMinSize){
			card[fontSizeProp]--
			await proxymity.on.renderend
		}
	}

	let exportCard = controller.exportCard = async function(){
		let context = this
		let replaceJob = Array.from(context.cardInstance.querySelectorAll("image"))
			.map(el=>
				getBase64FromImageUrl(el.href.baseVal)
				.then(uri=>
					el.setAttribute("xlink:href", uri)
				)
			)

		context.exporting = true
		replaceJob.push(proxymity.on.renderend)

		await Promise.all(replaceJob)

		context.cardInstance.querySelectorAll("foreignObject *").forEach(el=>el.removeAttribute("xmlns"))

		await saveSvgAsPng(context.cardInstance, `${card.name || "lor-card"}.png`, {width: 680, height: 1024, scale: 1/(window.devicePixelRatio || 1)})
		// await saveSvg(controller.cardInstance, `${card.name || "lor-card"}.svg`)

		context.exporting = false
	}

	let saveCard = controller.saveCard = async function(){
		let context = this
		context.cardId = await App.storage.saveChampion1(context.card, context.cardId)
	}

	let deleteCard = controller.deleteCard = async function(){
		let context = this
		await App.storage.delSavedChampion1(context.cardId)
		window.location.reload()
	}

	let focusFactory = controller.focusFactory = function(view, focusName, pageTitle){
		let context = this

		return function(){
			return iconCache.promise.then(()=>{
				context.cardOptionsController.app.mbShowConfigs = false // where is this coming from O_O;
				if (App.currentView === view){
					return
				}
				App.currentView = view
				context.clearCard()
				window.scroll(0,0)
				history.pushState({
					focus: focusName
				}, pageTitle)
			})
		}
	}

})()
