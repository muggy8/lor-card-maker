import"/cdn/setimmediate";const e=[];function t(t){return e.find((e=>e.type===t))}function c(e){const t=e.callbackQueue;e.callbackQueue=[],e.set=!1,t.forEach((({callback:e,args:t})=>{Function.prototype.apply.call(e,window,t)}))}export default function(a,l=setImmediate){let n=t(l);n||(n={type:l,set:!1,callbackQueue:[]},e.push(n));const{callbackQueue:o}=n;n.set||(n.set=!0,l((()=>{c(n)})));const u=Array.prototype.slice.call(arguments,1);o.push({callback:a,args:u})}