const swFolder = location.pathname.replace(/[^\/]+\.js$/, "")
const indexUrl = location.origin + swFolder
const CACHE_NAME = "react-cache"

const esmshQueryConfigs = {
	bundle: true, 
	dev: true, 
	target: "es2018",
	"no-dts": true,
}
const pathMap = {
	cdn: {
		react: {
			url: "https://esm.sh/react@18.2.0",
			query: esmshQueryConfigs,
		},
		"react-dom": {
			url: "https://esm.sh/react-dom@18.2.0",
			query: esmshQueryConfigs,
		},
	},
	App: indexUrl + "app",
	Views: indexUrl + "app/views", 
	Utils: indexUrl + "app/utils", 
}

self.addEventListener("install", function(ev){
	console.log("begin install", ev, location)
    ev.waitUntil(
		Promise.all([
			self.skipWaiting(),
			intelegentFetch(indexUrl)
		])
    )
})

self.addEventListener("activate", function(ev){
    console.log("activate", ev)
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
        ev.respondWith(intelegentFetch(fetchUrl))
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

async function intelegentFetch(req){
	let storage = await caches.open(CACHE_NAME)

	let cachedAsset

	if (cachedAsset = await storage.match(req)){
		let cachedEtag = cachedAsset.headers.get("etag")

		let remoteHeaders = await fetch(req, {
			method: "HEAD",
		}).catch(uwu=>console.warn(uwu))

		if (!remoteHeaders || !remoteHeaders.headers || !remoteHeaders.headers.get("etag") || remoteHeaders.headers.get("etag") === cachedEtag){
			return cachedAsset
		}
		else{
			console.log("asset needs refreshing", req)
		}
	}

	let res = await fetch(req.url || req)

	if (!res.ok){
		return Promise.reject(res)
	}

	await storage.put(req, res.clone())
	return res
}
