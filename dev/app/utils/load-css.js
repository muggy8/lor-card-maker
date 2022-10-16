export default function linkAsset(url, configs = {}){
	const el = document.createElement(configs.element || "link")
	el.setAttribute(configs.srcAttr || "href", url)
	el.setAttribute("rel", "stylesheet")
	document.head.appendChild(el)
}
