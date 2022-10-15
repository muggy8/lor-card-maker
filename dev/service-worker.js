const swFolder = location.pathname.replace(/[^\/]+\.js$/, "")
const indexUrl = location.origin + swFolder
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
	},
	App: indexUrl + "app",
	Views: indexUrl + "app/views", 
	Utils: indexUrl + "app/utils", 
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
    const filePathRelativeToPageRoot = ev.request.url.replace(indexUrl, "")
    // const mappedUrl = importMap[filePathRelativeToPageRoot]
    // console.log("sw fetch event", mappedUrl)

	const fetchUrl = remapUrl(filePathRelativeToPageRoot)
	
    if (fetchUrl){
        ev.respondWith(intelegentFetch(fetchUrl, filePathRelativeToPageRoot.startsWith("cdn")))
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

	let res = await fetch(req)

	if (!res.ok){
		return Promise.reject(res)
	}

	await storage.put(req, res.clone())
	return res
}
