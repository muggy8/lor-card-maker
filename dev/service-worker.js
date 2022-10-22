const swFolder = location.pathname.replace(/[^\/]+\.js$/, "")
const indexUrl = location.origin + swFolder
const urlRoot = location.origin + "/"
const CACHE_NAME = "react-cache"

const esmshQueryConfigs = {
	target: "es2018",
	"no-dts": true,
}

if (indexUrl.includes("localhost")){
	esmshQueryConfigs.dev = true
}

const pathMap = {
	cdn: {
		react: {
			url: "https://esm.sh/react@18.2.0",
			query: esmshQueryConfigs,
		},
		"react-dom": {
			url: "https://esm.sh/react-dom@18.2.0",
			query: {
				...esmshQueryConfigs,
				deps: "react@18.2.0"
			},
		},
		"flex-box": "https://cdn.jsdelivr.net/gh/muggy8/flex-box@f1c7d23fad7ece8fc7538b152ac393a29b65669b",
		fitty: {
			url: "https://esm.sh/fitty@2.3.6",
			query: {...esmshQueryConfigs, bundle: true},
		},
		setimmediate: {
			url: "https://esm.sh/setimmediate@1.0.5",
			query: {...esmshQueryConfigs, bundle: true},
		},
		"fast-average-color": {
			url: "https://esm.sh/fast-average-color@9.1.1",
			query: {...esmshQueryConfigs, bundle: true},
		},
		"save-svg-as-png": {
			url: "https://esm.sh/save-svg-as-png@1.4.17",
			query: {...esmshQueryConfigs, bundle: true},
		},
	},
	App: indexUrl + "app",
	Views: indexUrl + "app/views",
	Utils: indexUrl + "app/utils",
	Components: indexUrl + "app/components",
	Assets: indexUrl + "app/assets",
}

let storage
self.addEventListener("install", function(ev){
	// console.log("begin install", ev, location)
    ev.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache)=>{
				storage = cache
				return Promise.all([
					self.skipWaiting(),
					intelegentFetch(indexUrl)
				])
			})
    )
})

self.addEventListener("activate", function(ev){
    // console.log("activate", ev)
    ev.waitUntil(
        clients.claim()
    )
})

self.addEventListener("fetch", function(ev){
    const filePathRelativeToURLRoot = ev.request.url.replace(urlRoot, "")
    // const mappedUrl = importMap[filePathRelativeToPageRoot]
    // console.log("sw fetch event", filePathRelativeToURLRoot)

	const fetchUrl = remapUrl(filePathRelativeToURLRoot)

    if (fetchUrl){
        ev.respondWith(intelegentFetch(fetchUrl, filePathRelativeToURLRoot.startsWith("cdn")))
    }
    else{
        ev.respondWith(intelegentFetch(ev.request))
    }
})

function remapUrl(relativePath){
	const pathArray = relativePath.split("/")
	const mappedUrl = walkPathMap(pathArray, pathMap)

	if (mappedUrl){
		return mappedUrl
	}
	return relativePath
}

function walkPathMap(pathArray, currentPathMap){
	if (!pathArray || !pathArray.length || !currentPathMap){
		return
	}
	const currentPathSegment = pathArray[0]
	const remainingPatSegment = pathArray.slice(1)
	const currentPathReference = currentPathMap[currentPathSegment]

	if (
		typeof currentPathReference === "string" ||
		(
			typeof currentPathReference === "object" &&
			typeof currentPathReference.url === "string"
		)
	){
		const rootPath = typeof currentPathReference === "string"
			? currentPathReference
			: currentPathReference.url

		const truePathArray = [rootPath, ...remainingPatSegment]

		let url = truePathArray.join("/")

		if (currentPathReference.query){
			const queryString = Object.keys(currentPathReference.query).map(key=>{
				return `${key}=${currentPathReference.query[key]}`
			}).join("&")
			url = url + "?" + queryString
		}

		return url
	}

	return walkPathMap(remainingPatSegment, currentPathReference)
}

async function intelegentFetch(req, justUseTheCache = false){
	let requestedPath = req.url || req
	if (requestedPath.includes("://") && !requestedPath.startsWith("http")){
		return fetch(req)
	}

	let cachedAsset

	if (justUseTheCache){
		cachedAsset = await storage.match(req)
		if (cachedAsset){
			return cachedAsset
		}
	}

	if (cachedAsset = await storage.match(req)){
		let cachedEtag = cachedAsset.headers.get("etag")
		let cachedLastMod = cachedAsset.headers.get("last-modified")

		let remoteHeaders
		try{
			remoteHeaders = await fetch(req, {
				method: "HEAD",
			})
		}
		catch(uwu){
			console.warn(uwu)
		}

		if (remoteHeaders && remoteHeaders.headers){
			if (cachedEtag && remoteHeaders.headers.get("etag") === cachedEtag){
				return cachedAsset
			}
			if (cachedLastMod && remoteHeaders.headers.get("last-modified") === cachedLastMod){
				return cachedAsset
			}
		}
		console.log("asset needs refreshing", req)

	}

	try{
		let res = await fetch(req)

		if (!res.ok){
			return cachedAsset
		}
	
		await storage.put(req, res.clone())
		return res
	}
	catch(err){
		return cachedAsset
	}
}
