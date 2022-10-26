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

self.addEventListener("install", function(ev){
	// console.log("begin install", ev, location)
    ev.waitUntil(
		Promise.all([
			self.skipWaiting(),
			intelegentFetch(indexUrl)
		])
		.then(migrateDataFromVersion1To2)
    )
})

self.addEventListener("activate", function(ev){
    // console.log("activate", ev)
    ev.waitUntil(
        clients.claim()
    )
})

const cacheLocation = "cards"
const cardListPath = "pseudo-api/card-list/"
const cardDataPath = "pseudo-api/card/"

self.addEventListener("fetch", function(ev){
    const filePathRelativeToURLRoot = ev.request.url.replace(urlRoot, "")
    // const mappedUrl = importMap[filePathRelativeToPageRoot]
    // console.log("sw fetch event", filePathRelativeToURLRoot)

	const fetchUrl = remapUrl(filePathRelativeToURLRoot)

    if (fetchUrl){
		if (filePathRelativeToURLRoot.startsWith("pseudo-api")){

			let responded = false
			if (ev.request.method === "POST" || ev.request.method === "PUT"){
				if (filePathRelativeToURLRoot.includes(cardDataPath)){
					ev.respondWith(saveCardData(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
			}
			else if (ev.request.method === "GET"){
				if (filePathRelativeToURLRoot.includes(cardListPath)){
					ev.respondWith(getSavedCardList(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
				else if (filePathRelativeToURLRoot.includes(cardDataPath)){
					ev.respondWith(getSavedCard(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
			}
			else if (ev.request.method === "DEL"){
				if (filePathRelativeToURLRoot.includes(cardDataPath)){
					ev.respondWith(deleteSavedCard(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
			}

			!responded && ev.respondWith(new Response("Not found", {
				'Content-Type': 'text/plain',
				"status" : 404
			}))

		}
		else {
			ev.respondWith(intelegentFetch(fetchUrl, filePathRelativeToURLRoot.startsWith("cdn")))
		}
    }
    else{
		ev.respondWith(intelegentFetch(ev.request))
    }
})

async function saveCardData(req, path){
  let data = await req.text()
  let cache = await caches.open(cacheLocation)
  let dataResponse = new Response(data, {
    'Content-Type': 'application/json',
    "status" : 200
  })
  await cache.put(path, dataResponse.clone())
  return dataResponse
}

async function getSavedCard(req, path){
  let cache = await caches.open(cacheLocation)
  let cachedData = await cache.match(path)
  if (cachedData){
    return cachedData
  }
  return new Response("{}", {
    'Content-Type': 'application/json',
    "status" : 200
  })
}

const cardIdFinderRegex = /\/([^\/]+)\/?$/
async function getSavedCardList(req, path){
	let cache = await caches.open(cacheLocation)
	let cachedRequests = await cache.keys()
	let idList = cachedRequests.filter(req=>{
		return req.url.includes(cardDataPath)
	})
	.map(req=>{
		let [matched, id] = req.url.match(cardIdFinderRegex)

		return id
	})

	return new Response(JSON.stringify(idList), {
		'Content-Type': 'application/json',
		"status" : 200
	})
}

async function deleteSavedCard(req, path){
  let cache = await caches.open(cacheLocation)
  await cache.delete(path)
  return new Response("{}", {
    'Content-Type': 'application/json',
    "status" : 200
  })
}

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

	const storage = await caches.open(CACHE_NAME)

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

async function migrateDataFromVersion1To2(){
	let cache = await caches.open(cacheLocation)
	let cachedRequests = await cache.keys()

	let savedCardLists = cachedRequests.filter(req=>{
		return req.url.includes(cardListPath)
	})

	if (!savedCardLists.length){
		return
	}

	let listData = {}
	const getListDataJobs = savedCardLists.map(async listRequest=>{
		const [_, listType] = listRequest.url.match(cardIdFinderRegex)
		listData[listType] = await cache.get(listRequest)
	})

	await Promise.all(getListDataJobs)

	console.log(listData)
}