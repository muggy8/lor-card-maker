function createMiniKeyword(keywordImg){
	console.log(";~;")

	let svg = `
	<svg
		width="120" height="100"
		xmlns="http://www.w3.org/2000/svg"
		viewbox="0 0 120 100"
	>
		<image id="keyword-frame" width="120" height="100" x="0" y="0" href="./keyword/keywordmini.png"/>
		<image id="keyword-icon" width="45" height="37" x="18" y="16" href="${keywordImg}" transform="scale(1.5)"/>
	</svg>`

	return svg2dom(svg)
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
			extentions += `<image id="card-frame-m-extention" width="63" height="104" x="${contentLength + 28}" y="0" href="./keyword/keywordmiddleextend.png"/>`
			contentLength += extentionLength
		}
		else{
			let remanderLength = (keywordLength - contentLength)
			extentions += `<image id="card-frame-m-extention" width="${remanderLength}" height="104" x="${contentLength + 28}" y="0" href="./keyword/keywordmiddleextend.png" preserveAspectRatio="xMidYMin slice"/>`
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
	<svg
		width="500" height="100"
		xmlns="http://www.w3.org/2000/svg"
	>
		<image id="card-frame-r" width="28" height="104" x="0" y="0" href="./keyword/keywordleft.png"/>
		<image id="card-frame-m" width="203" height="104" x="28" y="0" href="./keyword/keywordmiddle.png"/>
		${extentions}
		<image id="card-frame-r" width="28" height="104" x="${contentLength + 28}" y="0" href="./keyword/keywordright.png"/>

		${keywordImg
			? ((contentStart += 68), `<image id="keyword-icon" width="45" height="37" x="${contentStart - 68}" y="17" href="${keywordImg}" transform="scale(1.5)"/>`)
			: ""
		}
		<text y="70" x="${contentStart + (keywordImg ? 10 : 0)}" stroke="#EDCB75" fill="#EDCB75" font-size="48" class="lor-font">${keyword}</text>
	</svg>`

	return svg2dom(svg)
}

createMiniKeyword.textSizeMap = {
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