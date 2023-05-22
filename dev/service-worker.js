const swFolder = location.pathname.replace(/[^\/]+\.js$/, "")
const indexUrl = location.origin + swFolder
const urlRoot = location.origin + "/"
const CACHE_NAME = "react-cache"

const esmshQueryConfigs = {
	target: "es2021",
	"no-dts": true,
	pin: "122",
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
		"flex-box": "https://cdn.jsdelivr.net/gh/muggy8/flex-box@d8439c58f20597e4fe891d01d6853bdcc78e82be",
		"mmc-3": "https://cdn.jsdelivr.net/gh/muggy8/mmc-3@374aa14106e6133f758cf68f2cb9e35b5392cfe5",
		"css-icons": "https://cdn.jsdelivr.net/gh/muggy8/css-icons@7050e6d2d096e4353efc9c2a917966817f5da81c",
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
		"react-range": {
			url: "https://esm.sh/react-range@1.8.14",
			query: esmshQueryConfigs,
		},
		"react-contextmenu": {
			url: "https://esm.sh/react-contextmenu@2.14.0",
			query: esmshQueryConfigs,
		},
		"react-select": {
			url: "https://esm.sh/react-select@5.6.0",
			query: esmshQueryConfigs,
		},
		"usecontextmenu-react": {
			url: "https://esm.sh/usecontextmenu-react@1.0.3",
			query: esmshQueryConfigs,
		},
		"react-device-detect": {
			url: "https://esm.sh/react-device-detect@2.2.2",
			query: esmshQueryConfigs,
		},
		"react-markdown": {
			url: "https://esm.sh/react-markdown@8.0.4",
			query: esmshQueryConfigs,
		},
		"object-hash": {
			url: "https://esm.sh/object-hash@3.0.0",
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
const ritoDataLocation = "rito-data"
const cardListPath = "pseudo-api/card-list/"
const cardDataPath = "pseudo-api/card/"
const settingsPath = "pseudo-api/settings/"
const backupPath = "pseudo-api/backup/"
const gameDataListPath = "pseudo-api/game-data/card-list/"
const clearCachePath = "pseudo-api/clear-cache/"
const ritoUrl = "pvp.net"

function parseValue(val){
	if (val.includes(",")){
		return val.split(",").map(parseValue)
	}

	if (val === "true"){
		return true
	}

	if (val === "false"){
		return false
	}

	if (val === "null"){
		return null
	}
	
	const valueAsNumber = parseFloat(val)
	if (!isNaN(valueAsNumber)){
		return valueAsNumber
	}

	return val
}

function parseQueryParamsFromUrl(url){
	const queryExtractorRegex = /\?.*?(.(?=\#)|.$)/
	const queryPairExtractorRegex = /([^\&\?\=]+)(\=([^\&\?\=]+))?/g
	const [queryString] = (queryExtractorRegex.exec(url) || [])

	if (!queryString){
		return {}
	}

	const results = {}

	// exec the query extractor regex on the query string repeatidly until all the key=val pairs are found.
	for(
		let extractedPair, key, val, _; 
		extractedPair = queryPairExtractorRegex.exec(queryString);
		[_, key, _, val] = extractedPair, results[key] = parseValue(val)
	);

	return results
}

self.addEventListener("fetch", function(ev){
    const filePathRelativeToURLRoot = ev.request.url.replace(urlRoot, "")
	const filePathRelativeToInstallPath = ev.request.url.replace(indexUrl, "") || indexUrl

	const fetchUrl = remapUrl(filePathRelativeToURLRoot)

	// console.log({indexUrl, urlRoot, filePathRelativeToURLRoot, filePathRelativeToInstallPath, fetchUrl})

    if (fetchUrl){
		if (filePathRelativeToURLRoot.startsWith("pseudo-api")){

			let responded = false
			if (ev.request.method === "POST" || ev.request.method === "PUT"){
				if (filePathRelativeToURLRoot.includes(cardDataPath)){
					ev.respondWith(saveData(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
				else if (filePathRelativeToURLRoot.includes(settingsPath)){
					ev.respondWith(saveSettings(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
				else if (filePathRelativeToURLRoot.includes(gameDataListPath)){
					ev.respondWith(saveRitoCardList(ev.request, filePathRelativeToURLRoot))
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
				else if (filePathRelativeToURLRoot.includes(gameDataListPath)){
					ev.respondWith(getRitoCardList(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
				else if (filePathRelativeToURLRoot.includes(backupPath)){
					ev.respondWith(getBackupData(ev.request, filePathRelativeToURLRoot))
					responded = true
				}
				else if (filePathRelativeToURLRoot.includes(clearCachePath)){
					ev.respondWith(clearReactCache(ev.request, filePathRelativeToURLRoot))
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
				if (fetchUrl.includes("LoR_DD")){
					ev.respondWith(fetch(fetchUrl))
				}
				else{
					ev.respondWith(intelegentFetch(filePathRelativeToInstallPath))
				}
			}
			else if (fetchUrl.includes("LoR_DD")){
				ev.respondWith(fetch(fetchUrl))
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

async function getRitoCardList(req, path){
	let cache = await caches.open(ritoDataLocation)
	let cachedResponse = await cache.match(path)

	if (cachedResponse){
		return cachedResponse
	}
	return new Response("{}", {
		'Content-Type': 'application/json',
		"status" : 200
	})
}

async function saveRitoCardList(req, path){
	let data = await req.text()
	let cache = await caches.open(ritoDataLocation)

	let dataResponse = new Response(data, {
		'Content-Type': 'application/json',
		"status" : 200
	})
	await cache.put(path, dataResponse.clone())
  	return dataResponse
}

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
const defaultIncludedTypes = [
	"champion1",
	"champion2",
	"champion3",
	"landmark",
	"follower",
	"spell",
	"keyword",
]
Object.freeze(defaultIncludedTypes)
async function getSavedCardList(req, path){

	// step 1: get the list of cards that are currently saved in the system
	let cache = await caches.open(cacheLocation)
	let cachedRequests = await cache.keys()
	let idList = cachedRequests.filter(req=>{
		return req.url.includes(cardDataPath)
	})
	.map(req=>{
		let [_, id] = req.url.match(cardIdFinderRegex)

		return id
	})
	idList.reverse()

	// step 2: get the data that those cards are associated with.
	const queryParams = parseQueryParamsFromUrl(req.url)
	const typesToInclude = []
	
	if (queryParams.only){
		typesToInclude.push(...[queryParams.only].flat())
	}
	else {
		const addToIncludedTypes = queryParams.include ? [queryParams.include].flat() : []
		const dropFromIncludedTypes = queryParams.exclude ? [queryParams.exclude].flat() : []
		typesToInclude.push(...defaultIncludedTypes.filter(type=>!dropFromIncludedTypes.includes(type)))
		typesToInclude.push(...addToIncludedTypes)
	}

	let idListToDataListTasks = idList.map(async id=>{
		let cardData = await getSavedCard(undefined, cardDataPath + id).then(res=>res.json())
		cardData.id = id

		if (typesToInclude.includes(cardData.type)){
			return cardData
		}
	})

	// step 3: dump the data back out to the requester
	let dataList = await Promise.all(idListToDataListTasks)
	return new Response(
		JSON.stringify(
			dataList.filter(val=>!!val)
		), 
		{
			'Content-Type': 'application/json',
			"status" : 200
		}
	)
}

async function getBackupData(req, path){
	// step 1: get the list of cards that are currently saved in the system
	let cache = await caches.open(cacheLocation)
	let cachedRequests = await cache.keys()
	let idList = cachedRequests.filter(req=>{
		return req.url.includes(cardDataPath)
	})
	.map(req=>{
		let [_, id] = req.url.match(cardIdFinderRegex)

		return id
	})

	// step 2: get the data that those cards are associated with.
	let idListToDataListTasks = idList.map(async id=>{
		let cardData = await getSavedCard(undefined, cardDataPath + id).then(res=>res.json())
		cardData.id = id
		if (cardData.type === "deck" && !cardData.dataVersion){
			cardData.dataVersion = 2
		}
		return cardData
	})

	let dataList = await Promise.all(idListToDataListTasks)
	return new Response(
		JSON.stringify(
			{cards: dataList.filter(val=>!!val)}
		), 
		{
			'Content-Type': 'application/json',
			"status" : 200
		}
	)
}

async function deleteSavedCard(req, path){
  let cache = await caches.open(cacheLocation)
  await cache.delete(path)
  return new Response("{}", {
    'Content-Type': 'application/json',
    "status" : 200
  })
}


async function clearReactCache(req, path){
	let reactStorage = await caches.open(CACHE_NAME)
	let cachedRequests = await reactStorage.keys()

	let deleteJobs = await Promise.all(
		cachedRequests.map(async req=>{
			let res = await reactStorage.match(req)
			let contentType = res.headers.get("Content-Type")

			if (contentType && contentType.includes("html")) {
				return
			}

			return reactStorage.delete(req.url)
		})
	)

	await Promise.all(deleteJobs)

	return Response.redirect(indexUrl, 302)
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

function wait(ms){
	return new Promise(accept=>setTimeout(accept, ms))
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

	let cachedContents
	if (cachedAsset = await storage.match(req)){
		let cachedEtag = cachedAsset.headers.get("etag")
		let cachedLastMod = cachedAsset.headers.get("last-modified")
		cachedContents = await cachedAsset.clone().text()

		if (cachedContents){
			let remoteHeaders, attempts = 0, maxAttempts = 2
			// we get 3 tries to get the headers. if we dont then we assume the server's dead and just serve up the cache
			
			while (!remoteHeaders || attempts < maxAttempts){
				attempts++
				let waitMs = attempts * 200
				try{
					remoteHeaders = await fetch(req, {
						method: "HEAD",
					})
				}
				catch(uwu){
					remoteHeaders = undefined
					await wait(waitMs)
					continue
				}
				
				if (!remoteHeaders.ok || remoteHeaders.status >= 300 || remoteHeaders.status < 200){
					remoteHeaders = undefined
					await wait(waitMs)
					continue
				}
	
				if (remoteHeaders && remoteHeaders.headers){
					if (cachedEtag && remoteHeaders.headers.get("etag") === cachedEtag){
						return cachedAsset
					}
					if (cachedLastMod && remoteHeaders.headers.get("last-modified") === cachedLastMod){
						return cachedAsset
					}
				}
			}

			if (attempts >= maxAttempts){
				// the only way this is true is if the remote server failed. at this point, we just use the cache.
				return cachedAsset
			}
		}
		// console.log("asset needs refreshing", req)
	}

	// the only way we get here is if the remote server is working and we need to update our cache or we dont actually have anything cached and we need to get it from the server.

	let fetchedAsset, fetchAttempts = 0, fetchMaxAttempts = 3
	while(!fetchedAsset && fetchAttempts < fetchMaxAttempts){
		fetchAttempts++
		let waitMs = fetchAttempts * 200
		try{
			fetchedAsset = await fetch(req)
		} 
		catch(err){
			fetchedAsset = undefined
			await wait(waitMs)
			continue
		}
		
		if (!fetchedAsset.ok || fetchedAsset.status >= 300 || fetchedAsset.status < 200){
			fetchedAsset = undefined
			await wait(waitMs)
			continue
		}

		let resContent = await fetchedAsset.clone().text()

		if (!resContent){
			fetchedAsset = undefined
			await wait(waitMs)
			continue
		}

		await storage.put(req, fetchedAsset.clone())
		return fetchedAsset
	}
	// alright we've had our attempt at getting the app from the server. if we still haven't gotten anything back at this point, the server's rejecting us and we can only throw an error back at the user.
	return fetchedAsset || cachedAsset
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
		const migrateCardDataTasks = associatedCards.reduce(async (previousCardMigration, cardId)=>{
			const path = cardDataPath + cardId
			await previousCardMigration
			let cardData = await getSavedCard(undefined, path).then(res=>res.json())

			if (cardData.dataVersion && cardData.dataVersion > 1){
				return
			}

			cardData.type = typeName
			cardData.dataVersion = 2

			if (cardData.rarity && (cardData.rarity.includes("gemless") || cardData.rarity.includes("none"))){
				cardData.rarity = ""
			}

			const updatedSaveData = new Response(JSON.stringify(cardData), {
				'Content-Type': 'application/json',
				"status" : 200
			})

			return cache.put(path, updatedSaveData)
		}, Promise.resolve())

		await migrateCardDataTasks

		return cache.delete(cardListPath + typeName)
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
