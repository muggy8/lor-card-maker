const e=location.pathname.replace(/[^\/]+\.js$/,""),t=location.origin+e,s=location.origin+"/",a={target:"es2015","no-dts":!0,pin:"122"};let n=()=>{};t.includes("localhost")&&(a.dev=!0,n=console.log);const r={cdn:{react:{url:"https://esm.sh/react@18.2.0",query:a},"react-dom":{url:"https://esm.sh/react-dom@18.2.0",query:{...a,deps:"react@18.2.0"}},"flex-box":"https://cdn.jsdelivr.net/gh/muggy8/flex-box@d8439c58f20597e4fe891d01d6853bdcc78e82be","mmc-3":"https://cdn.jsdelivr.net/gh/muggy8/mmc-3@374aa14106e6133f758cf68f2cb9e35b5392cfe5","css-icons":"https://cdn.jsdelivr.net/gh/muggy8/css-icons@7050e6d2d096e4353efc9c2a917966817f5da81c",fitty:{url:"https://esm.sh/fitty@2.3.6",query:a},setimmediate:{url:"https://esm.sh/setimmediate@1.0.5",query:a},"fast-average-color":{url:"https://esm.sh/fast-average-color@9.1.1",query:a},"save-svg-as-png":{url:"https://esm.sh/save-svg-as-png@1.4.17",query:a},gesto:{url:"https://esm.sh/gesto@1.13.3",query:a},"react-range":{url:"https://esm.sh/react-range@1.8.14",query:a},"react-contextmenu":{url:"https://esm.sh/react-contextmenu@2.14.0",query:a},"react-color":{url:"https://esm.sh/react-color@2.19.3",query:a},"react-select":{url:"https://esm.sh/react-select@5.6.0",query:a},"react-modal":{url:"https://esm.sh/react-modal@3.16.1",query:a},"usecontextmenu-react":{url:"https://esm.sh/usecontextmenu-react@1.0.3",query:a},"react-device-detect":{url:"https://esm.sh/react-device-detect@2.2.2",query:a},"react-markdown":{url:"https://esm.sh/react-markdown@8.0.4",query:a},"object-hash":{url:"https://esm.sh/object-hash@3.0.0",query:a}},App:t+"app",Views:t+"app/views",Utils:t+"app/utils",Components:t+"app/components",Assets:t+"app/assets"};self.addEventListener("install",(function(e){n("begin install",e,location),e.waitUntil(Promise.all([self.skipWaiting(),m(t)]).then(y).then(w))})),self.addEventListener("activate",(function(e){n("activate",e),e.waitUntil(clients.claim())}));const i="pseudo-api/card/";function o(e){if(e.includes(","))return e.split(",").map(o);if("true"===e)return!0;if("false"===e)return!1;if("null"===e)return null;const t=parseFloat(e);return isNaN(t)?e:t}async function c(e,t){let s=await caches.open("cards"),a=await s.match(t);if(a){t.url&&(t=t.url);const[e,s]=t.match(l);let n=await a.json();return n.id=s,new Response(JSON.stringify(n),{"Content-Type":"application/json",status:200})}return new Response("{}",{"Content-Type":"application/json",status:200})}self.addEventListener("fetch",(function(e){const h=e.request.url.replace(s,""),f=e.request.url.replace(t,"")||t,y=function(e){const t=d(e.split("/"),r);if(t)return t;return e}(h);if(n({indexUrl:t,urlRoot:s,filePathRelativeToURLRoot:h,filePathRelativeToInstallPath:f,fetchUrl:y}),y)if(h.startsWith("pseudo-api")){let s=!1;"POST"===e.request.method||"PUT"===e.request.method?h.includes(i)?(e.respondWith(async function(e,t){let s=await e.text(),a=await caches.open("cards"),n=new Response(s,{"Content-Type":"application/json",status:200});return await a.put(t,n.clone()),n}(e.request,h)),s=!0):h.includes("pseudo-api/settings/")?(e.respondWith(async function(e,t){let s=await e.text(),a=await caches.open("settings"),n=new Response(s,{"Content-Type":"application/json",status:200});return await a.put(t,n.clone()),n}(e.request,h)),s=!0):(h.includes("pseudo-api/game-data/card-list/")||h.includes("pseudo-api/game-data/poc-item-relic-list/"))&&(e.respondWith(async function(e,t){let s=await e.text(),a=await caches.open("rito-data"),n=new Response(s,{"Content-Type":"application/json",status:200});return await a.put(t,n.clone()),n}(e.request,h)),s=!0):"GET"===e.request.method?h.includes("pseudo-api/card-list/")?(e.respondWith(async function(e,t){let s=await caches.open("cards"),a=(await s.keys()).filter((e=>e.url.includes(i))).map((e=>{let[t,s]=e.url.match(l);return s}));a.reverse();const n=function(e){const t=/([^\&\?\=]+)(\=([^\&\?\=]+))?/g,[s]=/\?.*?(.(?=\#)|.$)/.exec(e)||[];if(!s)return{};const a={};for(let e,n,r,i;e=t.exec(s);[i,n,i,r]=e,a[n]=o(r));return a}(e.url),r=[];if(n.only)r.push(...[n.only].flat());else{const e=n.include?[n.include].flat():[],t=n.exclude?[n.exclude].flat():[];r.push(...u.filter((e=>!t.includes(e)))),r.push(...e)}let p=a.map((async e=>{let t=await c(void 0,i+e).then((e=>e.json()));if(t.id=e,r.includes(t.type))return t})),d=await Promise.all(p);return new Response(JSON.stringify(d.filter((e=>!!e))),{"Content-Type":"application/json",status:200})}(e.request)),s=!0):h.includes(i)?(e.respondWith(c(e.request,h)),s=!0):h.includes("pseudo-api/settings/")?(e.respondWith(async function(e,t){let s=await caches.open("settings"),a=await s.match(t);if(a)return a;return new Response("{}",{"Content-Type":"application/json",status:200})}(e.request,h)),s=!0):h.includes("pseudo-api/game-data/card-list/")||h.includes("pseudo-api/game-data/poc-item-relic-list/")?(e.respondWith(async function(e,t){let s=await caches.open("rito-data"),a=await s.match(t);if(a)return a;return new Response("{}",{"Content-Type":"application/json",status:200})}(e.request,h)),s=!0):h.includes("pseudo-api/backup/")?(e.respondWith(p(e.request,h)),s=!0):h.includes("pseudo-api/clear-cache/")&&(e.respondWith(async function(e,s){let a=await caches.open("react-cache"),n=await a.keys(),r=await Promise.all(n.map((async e=>{let t=(await a.match(e)).headers.get("Content-Type");if(!t||!t.includes("html"))return a.delete(e.url)})));return await Promise.all(r),Response.redirect(t,302)}(e.request)),s=!0):"DEL"===e.request.method&&h.includes(i)&&(e.respondWith(async function(e,t){let s=await caches.open("cards");return await s.delete(t),new Response("{}",{"Content-Type":"application/json",status:200})}(e.request,h)),s=!0),!s&&e.respondWith(new Response("Not found",{"Content-Type":"text/plain",status:404}))}else y===h?y.includes("LoR_DD")?e.respondWith(fetch(y)):"backup/"===f?e.respondWith(p(e.request,h)):e.respondWith(m(f,f.startsWith("https://esm.sh/")&&f.includes(`/${a.target}/`))):y.includes("LoR_DD")?e.respondWith(fetch(y)):e.respondWith(m(y,h.startsWith("cdn")));else e.respondWith(m(e.request))}));const l=/\/([^\/]+)\/?$/,u=["champion1","champion2","champion3","landmark","follower","spell","keyword","poc"];async function p(e,t){let s=await caches.open("cards"),a=(await s.keys()).filter((e=>e.url.includes(i))).map((e=>{let[t,s]=e.url.match(l);return s})),n=a.map((async e=>{let t=await c(0,i+e).then((e=>e.json()));return t.id=e,"deck"!==t.type||t.dataVersion||(t.dataVersion=2),t})),r=await Promise.all(n);return new Response(JSON.stringify({cards:r.filter((e=>!!e))}),{"Content-Type":"application/json",status:200})}function d(e,t){if(!e||!e.length||!t)return;const s=e[0],a=e.slice(1),n=t[s];if("string"==typeof n||"object"==typeof n&&"string"==typeof n.url){let e=["string"==typeof n?n:n.url,...a].join("/");if(n.query){let t=Object.keys(n.query).map((e=>`${e}=${n.query[e]}`)).join("&");e.endsWith(".css")&&(t+="&css=true"),e=e+"?"+t}return e}return d(a,n)}function h(e){return new Promise((t=>setTimeout(t,e)))}Object.freeze(u);const f=new class{constructor(){this.start=void 0,this.end=void 0,this.length=0}get first(){return this.start}get last(){return this.end}set first(e){return this.start=e}set last(e){return this.end=e}add(e){const t=function(e,t={}){let s;s="object"!=typeof t?Object.create({data:t}):Object.create(t);return s.next=void 0,s.prev=void 0,s.get=function(e){return t[e]},s.drop=function(){s.next&&(s.next.prev=s.prev),s.prev&&(s.prev.next=s.next),e.start===s&&(e.start=s.next),e.end===s&&(e.end=s.prev),e.length--},s}(this,e);return this.start||(this.start=t),this.end?(t.prev=this.end,this.end.next=t,this.end=t):this.end=t,this.length++,t}};async function m(e,t=!1){let s,a=e.url||e;if(a.includes("://")&&!a.startsWith("http"))return fetch(e);const r=await caches.open("react-cache");if(t&&(s=await r.match(e),s))return s;let i;if(s=await r.match(e)){let t=s.headers.get("etag"),r=s.headers.get("last-modified"),o=s.headers.get("Date");if(i=await s.clone().text(),i){let i,c=0,l=2;for(n(`Execution for ${a}: Start HEAD loop`);!i&&c<l;){c++;let l=200*c;try{n(`HEAD ${a}: there are currently ${f.length} other ongoing other fetches`);let t=fetch(e,{method:"HEAD"}),s=f.add(t);i=await t,s.drop()}catch(e){return n(`Execution for ${a}: Exit HEAD on error`),i=void 0,s}if(!i.ok||i.status>=300||i.status<200)n(`Execution for ${a}: Retry HEAD on bad status`),i=void 0,await h(l);else if(i&&i.headers){if(t&&i.headers.get("etag")===t)return n(`Execution for ${a}: Exit HEAD on etag equivilance`),s;if(r&&i.headers.get("last-modified")===r)return n(`Execution for ${a}: Exit HEAD on last-modified equivilance`),s;if(o&&i.headers.get("Date")===o)return n(`Execution for ${a}: Exit HEAD on Date equivilance`),s;n(`Execution for ${a}: HEAD Header Data:`,{etag:i.headers.get("etag"),"last-modified":i.headers.get("last-modified"),date:i.headers.get("date")}),i.headers.forEach(((e,t)=>{n(`Execution for ${a}: HEAD Header ${t}: ${e}`)}))}else n(`Execution for ${a}: Retry HEAD on lack of header response`)}if(n(`Execution for ${a}: End HEAD loop.`,{cachedEtag:t,cachedLastMod:r,cachedDate:o}),c>=l)return n(`Execution for ${a}: Exit HEAD on max-attempt reached`,{attempts:c,maxAttempts:l}),s;n(`Execution for ${a}: Passed attempts check`)}n("asset needs refreshing",e)}let o,c=0;for(;!o&&c<3;){c++;let t=200*c;try{n(`GET ${a}: there are currently ${f.length} other ongoing other fetches`);let t=fetch(e),s=f.add(t);o=await t,s.drop()}catch(e){o=void 0,await h(t);continue}if(!o.ok||o.status>=300||o.status<200)o=void 0,await h(t);else{if(await o.clone().text())return await r.put(e,o.clone()),o;o=void 0,await h(t)}}return o||s}async function y(){let e=await caches.open("cards"),t=(await e.keys()).filter((e=>e.url.includes("pseudo-api/card-list/")));if(!t.length)return;let s={};const a=t.map((async t=>{const[a,n]=t.url.match(l);s[n]=await e.match(t).then((e=>e.json()))}));await Promise.all(a);const n=Object.keys(s).map((async t=>{const a=s[t].reduce((async(s,a)=>{const n=i+a;await s;let r=await c(0,n).then((e=>e.json()));if(r.dataVersion&&r.dataVersion>1)return;r.type=t,r.dataVersion=2,r.rarity&&(r.rarity.includes("gemless")||r.rarity.includes("none"))&&(r.rarity="");const o=new Response(JSON.stringify(r),{"Content-Type":"application/json",status:200});return e.put(n,o)}),Promise.resolve());return await a,e.delete("pseudo-api/card-list/"+t)}));await Promise.all(n)}async function w(){console.log("migrating to multi subtype");let e=await caches.open("cards"),t=(await e.keys()).filter((e=>e.url.includes(i))).map((e=>{let[t,s]=e.url.match(l);return s})).map((async e=>{let t=await c(0,i+e).then((e=>e.json()));return t.id=e,t})),s=(await Promise.all(t)).map((t=>{if(!Object.prototype.hasOwnProperty.call(t,"clan"))return;if(Array.isArray(t.clan))return;t.clan?t.clan=[t.clan]:t.clan=[];let s=new Response(JSON.stringify(t),{"Content-Type":"application/json",status:200});return e.put(i+t.id,s.clone())}));return Promise.all(s)}