const swFolder = location.pathname.replace(/[^\/]+\.js$/, "")
const indexUrl = location.origin + swFolder
const urlRoot = location.origin + "/"
const CACHE_NAME = "react-cache"

const esmshQueryConfigs = {
	target: "es2018",
	"no-dts": true,
	sourcemap: false,
	pin: "v95",
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
		"mmc-3": "https://cdn.jsdelivr.net/gh/muggy8/mmc-3@374aa14106e6133f758cf68f2cb9e35b5392cfe5",
		fitty: {
			url: "https://esm.sh/fitty@2.3.6",
			query: esmshQueryConfigs,
		},
		setimmediate: {
			url: "https://esm.sh/setimmediate@1.0.5",
			query: esmshQueryConfigs,
		},
		"fast-average-color": {
			url: "https://esm.sh/fast-average-color@9.1.1",
			query: esmshQueryConfigs,
		},
		"save-svg-as-png": {
			url: "https://esm.sh/save-svg-as-png@1.4.17",
			query: esmshQueryConfigs,
		},
		"gesto": {
			url: "https://esm.sh/gesto@1.13.3",
			query: esmshQueryConfigs,
		},
		"react-input-range": {
			url: "https://esm.sh/react-input-range@1.3.0",
			query: esmshQueryConfigs,
		},
		"react-contextmenu": {
			url: "https://esm.sh/react-contextmenu@2.14.0",
			query: esmshQueryConfigs,
		},
		"react-use-pwa-install": {
			url: "https://esm.sh/react-use-pwa-install@0.2.1",
			query: esmshQueryConfigs,
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
const settingsLocation = "settings"
const cardListPath = "pseudo-api/card-list/"
const cardDataPath = "pseudo-api/card/"
const settingsPath = "pseudo-api/settings/"

self.addEventListener("fetch", function(ev){
    const filePathRelativeToURLRoot = ev.request.url.replace(urlRoot, "")
	const filePathRelativeToInstallPath = ev.request.url.replace(indexUrl, "")

	const fetchUrl = remapUrl(filePathRelativeToURLRoot)

    if (fetchUrl){
		if (filePathRelativeToURLRoot.startsWith("pseudo-api")){

			let responded = false
			if (ev.request.method === "POST" || ev.request.method === "PUT"){
				if (filePathRelativeToURLRoot.includes(cardDataPath)){
					ev.respondWith(saveData(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
				if (filePathRelativeToURLRoot.includes(settingsPath)){
					ev.respondWith(saveSettings(ev.request, filePathRelativeToURLRoot))
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
				else if (filePathRelativeToURLRoot.includes(settingsPath)){
					ev.respondWith(getSettings(ev.request, filePathRelativeToURLRoot))
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
			if (fetchUrl === filePathRelativeToURLRoot){
				ev.respondWith(intelegentFetch(filePathRelativeToInstallPath))
			}
			else{
				ev.respondWith(intelegentFetch(fetchUrl, filePathRelativeToURLRoot.startsWith("cdn")))
			}
		
		}
    }
    else{
		ev.respondWith(intelegentFetch(ev.request))
    }
})

async function saveSettings(req, path){
	let data = await req.text()
	let cache = await caches.open(settingsLocation)

	let dataResponse = new Response(data, {
		'Content-Type': 'application/json',
		"status" : 200
	})
	await cache.put(path, dataResponse.clone())
  	return dataResponse
}

async function getSettings(req, path){
	let cache = await caches.open(settingsLocation)
	let cachedResponse = await cache.match(path)

	if (cachedResponse){
		return cachedResponse
	}
	return new Response("{}", {
		'Content-Type': 'application/json',
		"status" : 200
	})
}

async function saveData(req, path){
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
  let cachedResponse = await cache.match(path)
  if (cachedResponse){
	if (path.url){
		path = path.url
	}
	const [_, cardId] = path.match(cardIdFinderRegex)

	let cachedData = await cachedResponse.json()
	cachedData.id = cardId
    return new Response(JSON.stringify(cachedData), {
		'Content-Type': 'application/json',
		"status" : 200
	})
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

	idList.reverse()

	let idListToDataListTasks = idList.map(async id=>{
		let cardData = await getSavedCard(undefined, cardDataPath + id).then(res=>res.json())
		cardData.id = id

		return cardData
	})

	let dataList = await Promise.all(idListToDataListTasks)

	return new Response(JSON.stringify(dataList), {
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
			let queryString = Object.keys(currentPathReference.query).map(key=>{
				return `${key}=${currentPathReference.query[key]}`
			}).join("&")

			if (url.endsWith(".css")){
				queryString += "&css=true"
			}

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
			return cachedAsset
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
		listData[listType] = await cache.match(listRequest).then(res=>res.json())
	})

	await Promise.all(getListDataJobs)

	const convertTasks = Object.keys(listData).map(async typeName=>{
		const associatedCards = listData[typeName]
		const migrateCardDataTasks = associatedCards.map(async cardId=>{
			const path = cardDataPath + cardId
			let cardData = await getSavedCard(undefined, path).then(res=>res.json())

			if (cardData.dataVersion && cardData.dataVersion > 1){
				return
			}

			cardData.type = typeName
			cardData.dataVersion = 2

			if (cardData.rarity.includes("gemless") || cardData.rarity.includes("none")){
				cardData.rarity = ""
			}

			console.log(cardData)

			const updatedSaveData = new Response(JSON.stringify(cardData), {
				'Content-Type': 'application/json',
				"status" : 200
			})

			// return cache.put(path, updatedSaveData)
		})

		await Promise.all(migrateCardDataTasks)

		// return cache.delete(cardListPath + typeName)
	})

	await Promise.all(convertTasks)
}

async function fetchWithTimeout(resource, options = {}) {
	const { timeout = 8000 } = options;
	
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);
	const response = await fetch(resource, {
	  ...options,
	  signal: controller.signal  
	});
	clearTimeout(id);
	return response;
}