const installRoot = location.pathname.replace(/[\/]*\.js$/, "")

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
    console.log("sw fetch event")
})