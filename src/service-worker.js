self.addEventListener("activate", function(event){
  clients.claim()
})

self.addEventListener("fetch", function(event){

  let req = event.request
  let path = req.url.replace(req.referrer, "")
  if (!path.startsWith("pseudo-api")){
    return
  }

  if (event.request.method === "POST" || event.request.method === "PUT"){
      if (path.includes(cardListPath)){
        event.respondWith(saveCardList(req, path))
      }
      else if (path.includes(cardDataPath)){
        event.respondWith(saveCardData(req, path))
      }
  }
  else if (event.request.method === "GET"){
    if (path.includes(cardListPath)){
      event.respondWith(getSavedCardList(req, path))
    }
    else if (path.includes(cardDataPath)){
      event.respondWith(getSavedCard(req, path))
    }
  }
  else if (event.request.method === "DEL"){
    if (path.includes(cardDataPath)){
      event.respondWith(deleteSavedCard(req, path))
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
