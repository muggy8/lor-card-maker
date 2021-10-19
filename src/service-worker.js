let installRoot = location.pathname.replace(/[\/]*\.js$/, "")

self.addEventListener("install", function(ev){
	console.log("begin install", ev, location)
	ev.waitUntil(makeRequestAndCachePathsRecursive(installRoot).then(()=>console.log("install complete")))
})

self.addEventListener("activate", function(event){
  clients.claim()
})

self.addEventListener("fetch", function(ev){
  let req = ev.request
  let path = req.url.replace(req.referrer, "")
  if (!path.startsWith("pseudo-api")){
    if (
      (/^\/sw\/refresh$/).test(ev.request.url.replace(ev.target.location.origin, ""))
    ){
      ev.respondWith(
        makeRequestAndCachePathsRecursive(installRoot)
          //~ .then(()=>console.log("updating app files"))
          .then(()=>intelegentFetch(installRoot))
      )
    }
    else{
      ev.respondWith(intelegentFetch(ev.request))
    }

    return
  }

  if (ev.request.method === "POST" || ev.request.method === "PUT"){
      if (path.includes(cardListPath)){
        ev.respondWith(saveCardList(req, path))
      }
      else if (path.includes(cardDataPath)){
        ev.respondWith(saveCardData(req, path))
      }
  }
  else if (ev.request.method === "GET"){
    if (path.includes(cardListPath)){
      ev.respondWith(getSavedCardList(req, path))
    }
    else if (path.includes(cardDataPath)){
      ev.respondWith(getSavedCard(req, path))
    }
  }
  else if (ev.request.method === "DEL"){
    if (path.includes(cardDataPath)){
      ev.respondWith(deleteSavedCard(req, path))
    }
  }
})

const cacheLocation = "cards"
const cardListPath = "pseudo-api/card-list/"
const cardDataPath = "pseudo-api/card/"

async function saveCardList(req, path){
  let data = await req.text()
  let cache = await caches.open(cacheLocation)
  let dataResponse = new Response(data, {
    'Content-Type': 'application/json',
    "status" : 200
  })
  await cache.put(path, dataResponse.clone())
  return dataResponse
}

async function getSavedCardList(req, path){
  let cache = await caches.open(cacheLocation)
  let cachedData = await cache.match(path)
  if (cachedData){
    return cachedData
  }
  return new Response("[]", {
    'Content-Type': 'application/json',
    "status" : 200
  })
}

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

async function deleteSavedCard(req, path){
  let cache = await caches.open(cacheLocation)
  await cache.delete(path)
  return new Response("{}", {
    'Content-Type': 'application/json',
    "status" : 200
  })
}

const URL_REGEX = /(href|src)=['"]([^'"]+)['"]|fetch\(['"]([^'"]+)['"]\)/gi
const CACHE_NAME = "assets"

async function makeRequestAndCachePathsRecursive(path, exploredPath = []){
	if (exploredPath.some(cachedPath=>cachedPath === path)){
		return
	}
	exploredPath.push(path)

	let resultingData = await intelegentFetch(path)
		.then(owo=>owo.text())
		.catch(uwu=>{
			console.warn("Caching of asset failed", uwu)
		})

	let urlList = []
	let matched
	while (matched = URL_REGEX.exec(resultingData)){
		let src = matched[2]
		let fetched = matched[3]

		src && urlList.push(src)
		fetched && urlList.push(fetched)
	}

	urlList = urlList.filter(url=>(/(^\/|^http(s):\/\/cdn)/).test(url))

	let updateList = urlList.map(uri=>makeRequestAndCachePathsRecursive(uri, exploredPath))
	return Promise.all(updateList)
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
