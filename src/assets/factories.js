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

function createWideKeyword(keword, keywordImg){

}

