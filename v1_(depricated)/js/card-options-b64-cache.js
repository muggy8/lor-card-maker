// modified from https://cdn.jsdelivr.net/npm/image-to-base64@2.2.0/browser.min.js
(function(escope) {
    function base64ToBrowser(buffer) {
        return window.btoa([].slice.call(new Uint8Array(buffer)).map(function(bin) { return String.fromCharCode(bin); }).join(''));
    }

    function imageToBase64Browser(urlOrImage, param) {
        if (!('fetch' in window && 'Promise' in window)) {
            return Promise.reject('[*] image-to-base64 is not compatible with your browser.');
        }
		let contentType = ""
		function constructDisplayableImage(b64){
			return `data:${contentType};base64, ` + b64
		}

        return fetch(urlOrImage, param || {}).then(function(response) {
			contentType = response.headers.get("Content-Type")
            return response.arrayBuffer();
        }).then(base64ToBrowser).then(constructDisplayableImage);
    }

    if (typeof module !== 'undefined') {
        module.exports = imageToBase64Browser;
    } else {
        escope.imageToBase64 = imageToBase64Browser;
    }
})(this);

let iconCache = {};
iconCache.promise = Promise.all(Array.from(Object.keys(cardOptionsData.icons)).map(name=>{
	let fileName = cardOptionsData.icons[name]
	imageToBase64("./assets/symbol/" + fileName).then(b64=>iconCache[name] = b64)
}))