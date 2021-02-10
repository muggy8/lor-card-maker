function createMiniKeyword(keywordImg){
	let svg = `
		<image class="keyword-frame" width="120" height="100" x="0" y="0" xlink:href="/assets/keyword/keywordmini.png"/>
		<image class="keyword-icon" width="45" height="37" x="18" y="16" xlink:href="${keywordImg}" transform="scale(1.5)"/>`

	return {width: 120, height: 100, content: svg, svg: `
		<svg
			width="120" height="100"
			xmlns="http://www.w3.org/2000/svg"
			viewbox="0 0 120 100"
			xmlns:xlink="http://www.w3.org/1999/xlink"
		>${svg}</svg>`
	}
}

function createWideKeyword(keyword, keywordImg){
	keyword = keyword.toUpperCase()

	let keywordLength = keywordImg ? 55 : 0
	for(let i = 0 ; i < keyword.length ; keywordLength += createMiniKeyword.textSizeMap[keyword[i++]] || 0);
	keywordLength = Math.ceil(keywordLength)

	let contentLength = 203
	let extentions = ""
	let extentionLength = 63

	for(let safety = 0; keywordLength > contentLength && safety < 20; safety++){
		if (keywordLength > (contentLength + extentionLength)){
			extentions += `<image id="card-frame-m-extention" width="63" height="104" x="${contentLength + 28}" y="0" xlink:href="/assets/keyword/keywordmiddleextend.png"/>`
			contentLength += extentionLength
		}
		else{
			let remanderLength = (keywordLength - contentLength)
			extentions += `<image id="card-frame-m-extention" width="${remanderLength}" height="104" x="${contentLength + 28}" y="0" xlink:href="/assets/keyword/keywordmiddleextend.png" preserveAspectRatio="xMidYMin slice"/>`
			contentLength += remanderLength
		}
	}

	let contentStart = 10
	if (keywordLength < contentLength){
		contentStart = 28 + (contentLength / 2) - (keywordLength / 2)
		if (keywordImg){
			contentStart -= 68 - 45
		}
	}

	let svg = `
		<image id="card-frame-r" width="28" height="104" x="0" y="0" xlink:href="/assets/keyword/keywordleft.png"/>
		<image id="card-frame-m" width="203" height="104" x="28" y="0" xlink:href="/assets/keyword/keywordmiddle.png"/>
		${extentions}
		<image id="card-frame-r" width="28" height="104" x="${contentLength + 28}" y="0" xlink:href="/assets/keyword/keywordright.png"/>

		${keywordImg
			? ((contentStart += 68), `<image id="keyword-icon" width="45" height="37" x="${contentStart - 68}" y="17" xlink:href="${keywordImg}" transform="scale(1.5)"/>`)
			: ""
		}
		<text y="70" x="${contentStart + (keywordImg ? 10 : 0)}" stroke="#EDCB75" fill="#EDCB75" font-size="48" class="key-text">${keyword}</text>`

	// return svg2dom(svg)
	return {width: contentLength + 28 + 28, height: 100, content: svg, svg: `
		<svg
			width="${contentLength + 28 + 28}" height="100"
			xmlns="http://www.w3.org/2000/svg"
			viewbox="0 0 ${contentLength + 28 + 28} 100"
			xmlns:xlink="http://www.w3.org/1999/xlink"
		>${svg}</svg>`
	}
}

createMiniKeyword.textSizeMap = {
	"'": 15.066666603088379,
	" ": 17.983333587646484,
	"A": 36,
	"B": 30.66666603088379,
	"C": 30.66666603088379,
	"D": 34.849998474121094,
	"E": 26.299999237060547,
	"F": 24.383333206176758,
	"G": 33.21666717529297,
	"H": 35.56666564941406,
	"I": 15.066666603088379,
	"J": 17.983333587646484,
	"K": 34,
	"L": 26.116666793823242,
	"M": 42.20000076293945,
	"N": 34.70000076293945,
	"O": 36.099998474121094,
	"P": 28.133333206176758,
	"Q": 38,
	"R": 30.616666793823242,
	"S": 25.91666603088379,
	"T": 31.100000381469727,
	"U": 33.5,
	"V": 35.41666793823242,
	"W": 50,
	"X": 34,
	"Y": 33,
	"Z": 29.183332443237305,
	" ": 0
}
