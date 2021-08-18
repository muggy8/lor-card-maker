self.addEventListener("activate",(function(t){clients.claim()})),self.addEventListener("fetch",(function(t){let a=t.request,e=a.url.replace(a.referrer,"");e.startsWith("pseudo-api")&&("POST"===t.request.method||"PUT"===t.request.method?e.includes(cardListPath)?t.respondWith(saveCardList(a,e)):e.includes(cardDataPath)&&t.respondWith(saveCardData(a,e)):"GET"===t.request.method?e.includes(cardListPath)?t.respondWith(getSavedCardList(a,e)):e.includes(cardDataPath)&&t.respondWith(getSavedCard(a,e)):"DEL"===t.request.method&&e.includes(cardDataPath)&&t.respondWith(deleteSavedCard(a,e)))}));const cacheLocation="cards",cardListPath="pseudo-api/card-list/",cardDataPath="pseudo-api/card/";async function saveCardList(t,a){let e=await t.text(),s=await caches.open("cards"),n=new Response(e,{"Content-Type":"application/json",status:200});return await s.put(a,n.clone()),n}async function getSavedCardList(t,a){let e=await caches.open("cards"),s=await e.match(a);return s||new Response("[]",{"Content-Type":"application/json",status:200})}async function saveCardData(t,a){let e=await t.text(),s=await caches.open("cards"),n=new Response(e,{"Content-Type":"application/json",status:200});return await s.put(a,n.clone()),n}async function getSavedCard(t,a){let e=await caches.open("cards"),s=await e.match(a);return s||new Response("{}",{"Content-Type":"application/json",status:200})}async function deleteSavedCard(t,a){let e=await caches.open("cards");return await e.delete(a),new Response("{}",{"Content-Type":"application/json",status:200})}