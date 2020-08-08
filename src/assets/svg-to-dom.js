function svg2dom(svgString){
	let domparser = new DOMParser()
	let doc = domparser.parseFromString(svgString, "image/svg+xml")
	return doc.firstElementChild
}