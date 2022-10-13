const swFolder = location.pathname.replace(/[^\/]+\.js$/, "")
const indexUrl = location.origin + swFolder

const importMap = {
    react: "https://esm.sh/react@18.2.0?bundle"
}

self.addEventListener("install", function(ev){
	console.log("begin install", ev, location)
    ev.waitUntil(
        self.skipWaiting()
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
        ev.respondWith(fetch(mappedUrl))
    }
    else{
        ev.respondWith(fetch(ev.request))
    }
})