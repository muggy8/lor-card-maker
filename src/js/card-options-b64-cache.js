let iconCache = {}
iconCache.promise = Promise.all(Array.from(Object.keys(cardOptionsData.icons)).map(name=>{
	let fileName = cardOptionsData.icons[name]
	getBase64FromImageUrl("/assets/symbol/" + fileName).then(b64=>iconCache[name] = b64)
}))

function getBase64FromImageUrl(url) {
	return new Promise(function(accept){
		var img = new Image();

	    img.setAttribute('crossOrigin', 'anonymous')

	    img.onload = function () {
	        var canvas = document.createElement("canvas")
	        canvas.width =this.width
	        canvas.height =this.height

	        var ctx = canvas.getContext("2d")
	        ctx.drawImage(this, 0, 0)

	        var dataURL = canvas.toDataURL("image/png")

	        accept(dataURL)
	    }

	    img.src = url
	})
}