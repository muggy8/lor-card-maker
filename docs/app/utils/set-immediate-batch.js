import"/cdn/setimmediate";const queuesByType=[];function getUqueByType(e){return queuesByType.find(t=>t.type===e)}function resolveQueue(e){const t=e.callbackQueue;e.callbackQueue=[],e.set=!1,t.forEach(({callback:e,args:t})=>{Function.prototype.apply.call(e,window,t)})}export default function(e,t=setImmediate){let u=getUqueByType(t);u||(u={type:t,set:!1,callbackQueue:[]},queuesByType.push(u));const{callbackQueue:c}=u;u.set||(u.set=!0,t(()=>{resolveQueue(u)}));const a=Array.prototype.slice.call(arguments,1);c.push({callback:e,args:a})}