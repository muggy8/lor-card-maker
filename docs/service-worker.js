const t=location.pathname.replace(/[^\/]+\.js$/,""),e=location.origin+t,s=location.origin+"/",n={target:"es2015","no-dts":!0,pin:"122"};let a=()=>{};e.includes("localhost")&&(n.dev=!0,a=console.log);const r={cdn:{react:{url:"https://esm.sh/react@18.2.0",query:n},"react-dom":{url:"https://esm.sh/react-dom@18.2.0",query:{...n,deps:"react@18.2.0"}},"flex-box":"https://cdn.jsdelivr.net/gh/muggy8/flex-box@d8439c58f20597e4fe891d01d6853bdcc78e82be","mmc-3":"https://cdn.jsdelivr.net/gh/muggy8/mmc-3@374aa14106e6133f758cf68f2cb9e35b5392cfe5","css-icons":"https://cdn.jsdelivr.net/gh/muggy8/css-icons@7050e6d2d096e4353efc9c2a917966817f5da81c",fitty:{url:"https://esm.sh/fitty@2.3.6",query:n},setimmediate:{url:"https://esm.sh/setimmediate@1.0.5",query:n},"fast-average-color":{url:"https://esm.sh/fast-average-color@9.1.1",query:n},"save-svg-as-png":{url:"https://esm.sh/save-svg-as-png@1.4.17",query:n},gesto:{url:"https://esm.sh/gesto@1.13.3",query:n},"react-range":{url:"https://esm.sh/react-range@1.8.14",query:n},"react-contextmenu":{url:"https://esm.sh/react-contextmenu@2.14.0",query:n},"react-color":{url:"https://esm.sh/react-color@2.19.3",query:n},"react-select":{url:"https://esm.sh/react-select@5.6.0",query:n},"usecontextmenu-react":{url:"https://esm.sh/usecontextmenu-react@1.0.3",query:n},"react-device-detect":{url:"https://esm.sh/react-device-detect@2.2.2",query:n},"react-markdown":{url:"https://esm.sh/react-markdown@8.0.4",query:n},"object-hash":{url:"https://esm.sh/object-hash@3.0.0",query:n}},App:e+"app",Views:e+"app/views",Utils:e+"app/utils",Components:e+"app/components",Assets:e+"app/assets"};self.addEventListener("install",(function(t){a("begin install",t,location),t.waitUntil(Promise.all([self.skipWaiting(),m(e)]).then(y).then(w))})),self.addEventListener("activate",(function(t){a("activate",t),t.waitUntil(clients.claim())}));const i="pseudo-api/card/";function o(t){if(t.includes(","))return t.split(",").map(o);if("true"===t)return!0;if("false"===t)return!1;if("null"===t)return null;const e=parseFloat(t);return isNaN(e)?t:e}async function c(t,e){let s=await caches.open("cards"),n=await s.match(e);if(n){e.url&&(e=e.url);const[t,s]=e.match(l);let a=await n.json();return a.id=s,new Response(JSON.stringify(a),{"Content-Type":"application/json",status:200})}return new Response("{}",{"Content-Type":"application/json",status:200})}self.addEventListener("fetch",(function(t){const n=t.request.url.replace(s,""),h=t.request.url.replace(e,"")||e,f=function(t){const e=d(t.split("/"),r);if(e)return e;return t}(n);if(a({indexUrl:e,urlRoot:s,filePathRelativeToURLRoot:n,filePathRelativeToInstallPath:h,fetchUrl:f}),f)if(n.startsWith("pseudo-api")){let s=!1;"POST"===t.request.method||"PUT"===t.request.method?n.includes(i)?(t.respondWith(async function(t,e){let s=await t.text(),n=await caches.open("cards"),a=new Response(s,{"Content-Type":"application/json",status:200});return await n.put(e,a.clone()),a}(t.request,n)),s=!0):n.includes("pseudo-api/settings/")?(t.respondWith(async function(t,e){let s=await t.text(),n=await caches.open("settings"),a=new Response(s,{"Content-Type":"application/json",status:200});return await n.put(e,a.clone()),a}(t.request,n)),s=!0):n.includes("pseudo-api/game-data/card-list/")&&(t.respondWith(async function(t,e){let s=await t.text(),n=await caches.open("rito-data"),a=new Response(s,{"Content-Type":"application/json",status:200});return await n.put(e,a.clone()),a}(t.request,n)),s=!0):"GET"===t.request.method?n.includes("pseudo-api/card-list/")?(t.respondWith(async function(t,e){let s=await caches.open("cards"),n=(await s.keys()).filter((t=>t.url.includes(i))).map((t=>{let[e,s]=t.url.match(l);return s}));n.reverse();const a=function(t){const e=/([^\&\?\=]+)(\=([^\&\?\=]+))?/g,[s]=/\?.*?(.(?=\#)|.$)/.exec(t)||[];if(!s)return{};const n={};for(let t,a,r,i;t=e.exec(s);[i,a,i,r]=t,n[a]=o(r));return n}(t.url),r=[];if(a.only)r.push(...[a.only].flat());else{const t=a.include?[a.include].flat():[],e=a.exclude?[a.exclude].flat():[];r.push(...u.filter((t=>!e.includes(t)))),r.push(...t)}let p=n.map((async t=>{let e=await c(void 0,i+t).then((t=>t.json()));if(e.id=t,r.includes(e.type))return e})),d=await Promise.all(p);return new Response(JSON.stringify(d.filter((t=>!!t))),{"Content-Type":"application/json",status:200})}(t.request)),s=!0):n.includes(i)?(t.respondWith(c(t.request,n)),s=!0):n.includes("pseudo-api/settings/")?(t.respondWith(async function(t,e){let s=await caches.open("settings"),n=await s.match(e);if(n)return n;return new Response("{}",{"Content-Type":"application/json",status:200})}(t.request,n)),s=!0):n.includes("pseudo-api/game-data/card-list/")?(t.respondWith(async function(t,e){let s=await caches.open("rito-data"),n=await s.match(e);if(n)return n;return new Response("{}",{"Content-Type":"application/json",status:200})}(t.request,n)),s=!0):n.includes("pseudo-api/backup/")?(t.respondWith(p(t.request,n)),s=!0):n.includes("pseudo-api/clear-cache/")&&(t.respondWith(async function(t,s){let n=await caches.open("react-cache"),a=await n.keys(),r=await Promise.all(a.map((async t=>{let e=(await n.match(t)).headers.get("Content-Type");if(!e||!e.includes("html"))return n.delete(t.url)})));return await Promise.all(r),Response.redirect(e,302)}(t.request)),s=!0):"DEL"===t.request.method&&n.includes(i)&&(t.respondWith(async function(t,e){let s=await caches.open("cards");return await s.delete(e),new Response("{}",{"Content-Type":"application/json",status:200})}(t.request,n)),s=!0),!s&&t.respondWith(new Response("Not found",{"Content-Type":"text/plain",status:404}))}else f===n?f.includes("LoR_DD")?t.respondWith(fetch(f)):"backup/"===h?t.respondWith(p(t.request,n)):t.respondWith(m(h)):f.includes("LoR_DD")?t.respondWith(fetch(f)):t.respondWith(m(f,n.startsWith("cdn")));else t.respondWith(m(t.request))}));const l=/\/([^\/]+)\/?$/,u=["champion1","champion2","champion3","landmark","follower","spell","keyword"];async function p(t,e){let s=await caches.open("cards"),n=(await s.keys()).filter((t=>t.url.includes(i))).map((t=>{let[e,s]=t.url.match(l);return s})),a=n.map((async t=>{let e=await c(0,i+t).then((t=>t.json()));return e.id=t,"deck"!==e.type||e.dataVersion||(e.dataVersion=2),e})),r=await Promise.all(a);return new Response(JSON.stringify({cards:r.filter((t=>!!t))}),{"Content-Type":"application/json",status:200})}function d(t,e){if(!t||!t.length||!e)return;const s=t[0],n=t.slice(1),a=e[s];if("string"==typeof a||"object"==typeof a&&"string"==typeof a.url){let t=["string"==typeof a?a:a.url,...n].join("/");if(a.query){let e=Object.keys(a.query).map((t=>`${t}=${a.query[t]}`)).join("&");t.endsWith(".css")&&(e+="&css=true"),t=t+"?"+e}return t}return d(n,a)}function h(t){return new Promise((e=>setTimeout(e,t)))}Object.freeze(u);const f=new class{constructor(){this.start=void 0,this.end=void 0,this.length=0}get first(){return this.start}get last(){return this.end}set first(t){return this.start=t}set last(t){return this.end=t}add(t){const e=function(t,e={}){let s;s="object"!=typeof e?Object.create({data:e}):Object.create(e);return s.next=void 0,s.prev=void 0,s.get=function(t){return e[t]},s.drop=function(){s.next&&(s.next.prev=s.prev),s.prev&&(s.prev.next=s.next),t.start===s&&(t.start=s.next),t.end===s&&(t.end=s.prev),t.length--},s}(this,t);return this.start||(this.start=e),this.end?(e.prev=this.end,this.end.next=e,this.end=e):this.end=e,this.length++,e}};async function m(t,e=!1){let s,n=t.url||t;if(n.includes("://")&&!n.startsWith("http"))return fetch(t);const r=await caches.open("react-cache");if(e&&(s=await r.match(t),s))return s;let i;if(s=await r.match(t)){let e=s.headers.get("etag"),r=s.headers.get("last-modified");s.headers.get("Content-Length");if(i=await s.clone().text(),i){let i,o=0,c=2;for(a(`Execution for ${n}: Start HEAD loop`);!i&&o<c;){o++;let c=200*o;try{a(`HEAD ${n}: there are currently ${f.length} other ongoing other fetches`);let e=fetch(t,{method:"HEAD"}),s=f.add(e);i=await e,s.drop()}catch(t){return a(`Execution for ${n}: Exit HEAD on error`),i=void 0,s}if(!i.ok||i.status>=300||i.status<200)a(`Execution for ${n}: Retry HEAD on bad status`),i=void 0,await h(c);else if(i&&i.headers){if(e&&i.headers.get("etag")===e)return a(`Execution for ${n}: Exit HEAD on etag equivilance`),s;if(r&&i.headers.get("last-modified")===r)return a(`Execution for ${n}: Exit HEAD on last-modified equivilance`),s}}if(a(`Execution for ${n}: End HEAD loop`),o>=c)return a(`Execution for ${n}: Exit HEAD on max-attempt reached`,{attempts:o,maxAttempts:c}),s;a(`Execution for ${n}: Passed attempts check`)}a("asset needs refreshing",t)}let o,c=0;for(;!o&&c<3;){c++;let e=200*c;try{a(`GET ${n}: there are currently ${f.length} other ongoing other fetches`);let e=fetch(t),s=f.add(e);o=await e,s.drop()}catch(t){o=void 0,await h(e);continue}if(!o.ok||o.status>=300||o.status<200)o=void 0,await h(e);else{if(await o.clone().text())return await r.put(t,o.clone()),o;o=void 0,await h(e)}}return o||s}async function y(){let t=await caches.open("cards"),e=(await t.keys()).filter((t=>t.url.includes("pseudo-api/card-list/")));if(!e.length)return;let s={};const n=e.map((async e=>{const[n,a]=e.url.match(l);s[a]=await t.match(e).then((t=>t.json()))}));await Promise.all(n);const a=Object.keys(s).map((async e=>{const n=s[e].reduce((async(s,n)=>{const a=i+n;await s;let r=await c(0,a).then((t=>t.json()));if(r.dataVersion&&r.dataVersion>1)return;r.type=e,r.dataVersion=2,r.rarity&&(r.rarity.includes("gemless")||r.rarity.includes("none"))&&(r.rarity="");const o=new Response(JSON.stringify(r),{"Content-Type":"application/json",status:200});return t.put(a,o)}),Promise.resolve());return await n,t.delete("pseudo-api/card-list/"+e)}));await Promise.all(a)}async function w(){console.log("migrating to multi subtype");let t=await caches.open("cards"),e=(await t.keys()).filter((t=>t.url.includes(i))).map((t=>{let[e,s]=t.url.match(l);return s})).map((async t=>{let e=await c(0,i+t).then((t=>t.json()));return e.id=t,e})),s=(await Promise.all(e)).map((e=>{if(!Object.prototype.hasOwnProperty.call(e,"clan"))return;if(Array.isArray(e.clan))return;e.clan?e.clan=[e.clan]:e.clan=[];let s=new Response(JSON.stringify(e),{"Content-Type":"application/json",status:200});return t.put(i+e.id,s.clone())}));return Promise.all(s)}