export default function linkAsset(url, configs = {}){
	const el = document.createElement(configs.element || "link")
	el.setAttribute(configs.srcAttr || "href", url)
	el.setAttribute("rel", "stylesheet")
	const awaitable = new Promise(accept=>{
		el.addEventListener("load", accept)
	})
	document.head.appendChild(el)
	return awaitable
}
