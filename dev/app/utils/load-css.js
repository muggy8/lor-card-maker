export default function inlineAsset(url, configs = {}){
	return fetch(url)
		.then(res=>res.text())
		.then(text=>{
			const el = document.createElement(configs.element || "style")
			el.innerHTML = text
			document.head.appendChild(el)
		})
}
