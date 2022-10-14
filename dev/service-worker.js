const swFolder = location.pathname.replace(/[^\/]+\.js$/, "")
const indexUrl = location.origin + swFolder
const CACHE_NAME = "react-cache"

const importMap = {
    react: "https://esm.sh/react@18.2.0?bundle"
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
    const mappedUrl = importMap[filePathRelativeToPageRoot]
    console.log("sw fetch event", mappedUrl)

    if (mappedUrl){
        ev.respondWith(intelegentFetch(mappedUrl))
    }
    else{
        ev.respondWith(intelegentFetch(ev.request))
    }
})

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
