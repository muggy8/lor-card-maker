(function(){
	let cardEffectMinSize = 24
	let controller = App.baseBuilderController = {}

	controller.clearCard = controller.createPreview = controller.saveCard = controller.deleteCard = function(){
		console.warn("oops, you called a stub... probs should fix");
	}

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

	let effectResize = controller.effectResize = async function(effectDiv, fontSizeProp = "effectFontSize"){
		let context = this
		let useableHeight = effectDiv.offsetHeight
		while (effectDiv.scrollHeight > useableHeight && context.card[fontSizeProp] > cardEffectMinSize){
			context.card[fontSizeProp]--
			await proxymity.on.renderend
		}
	}

	let exportCard = controller.exportCard = async function(cardInstance){
		let context = this
		cardInstance = cardInstance || context.cardInstance
		let replaceJob = Array.from(cardInstance.querySelectorAll("image"))
			.map(el=>(el.href.baseVal && !isBase64(el.href.baseVal)) 
				? imageToBase64(el.href.baseVal)
					.then(uri=>{
						console.log(el.href.baseVal)
						el.removeAttribute("href")
						el.removeAttribute(":xlinkhref")
						el.setAttribute("xlink:href", uri)
					})
				: Promise.resolve()
			)

		context.exporting = true
		replaceJob.push(proxymity.on.renderend)

		console.log("awaiting replace job", replaceJob.length)
		try{
			await Promise.all(replaceJob)
		}
		catch(uwu){
			console.warn(uwu)
		}
		console.log("replace job complete")

		cardInstance.querySelectorAll("foreignObject *").forEach(el=>el.removeAttribute("xmlns"))

		console.log("awaiting PNG generation", cardInstance)
		let cardUri = await svgAsPngUri(
			cardInstance,
			// `${context.card.name || "lor-card"}.png`,
			{
				width: cardInstance.viewBox.baseVal.width,
				height: cardInstance.viewBox.baseVal.height,
				scale: 1/(window.devicePixelRatio || 1)
			},
		)
		console.log("PNG generation complete")

		context.exporting = false

		openUri(cardUri)
	}

	function openUri(base64ImageData) {
		const typeRegex = /data:([^;]+);base64,/
		const matched = typeRegex.exec(base64ImageData)

		const contentType = matched[1];

		const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
		    const slice = byteCharacters.slice(offset, offset + 1024);

		    const byteNumbers = new Array(slice.length);
		    for (let i = 0; i < slice.length; i++) {
		        byteNumbers[i] = slice.charCodeAt(i);
		    }

		    const byteArray = new Uint8Array(byteNumbers);

		    byteArrays.push(byteArray);
		}
		const blob = new Blob(byteArrays, {type: contentType});
		const blobUrl = URL.createObjectURL(blob);

		window.open(blobUrl, '_blank');
	}

	function isBase64(str) {
		if (str ==='' || str.trim() ===''){ return false; }
		try {
			return btoa(atob(str)) == str;
		} catch (err) {
			return false;
		}
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
