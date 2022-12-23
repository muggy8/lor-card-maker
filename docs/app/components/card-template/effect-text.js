import e,{div as t,span as r}from"/Utils/elements.js";import{keywords as n}from"/Components/card-template/keyword-renderer.js";import o,{useContext as s}from"/cdn/react";import l from"/Utils/set-immediate-batch.js";import i from"/Utils/load-css.js";import a from"/Utils/datauri.js";import{Globals as c}from"/Views/index.js";import{useAssetCache as p,useAssetCacheDebounced as f}from"/Utils/use-asset-cache.js";const u=i("/Components/card-template/effect-text.css"),m=Object.keys(n).filter((e=>n[e].length));export const effectTextSize=24;const g=({clientWidth:e,clientHeight:t,scrollWidth:r,scrollHeight:n})=>r>e||n>t;function d(e,t){return(e+t)/2}function h(){return new Promise((e=>l(e)))}const y=new Map;export async function scaleFontSize(e,t=36,r=24){if(!e)return h();const n=y.get(e);if(n)return n;let o,s=window.getComputedStyle(e).getPropertyValue("font-size");return s=parseFloat(s),o=s!=t||g(e)?new Promise((n=>{(async()=>{let o=t,l=r,i=s;for(;o-l>.5;){e.style.fontSize=`${i+.5}px`,await h();const t=g(e);e.style.fontSize=`${i}px`,await h();const r=g(e);if(!r&&t)return n();r?(o=i,i=d(o,l)):(l=i,i=d(o,l))}n()})()})):h(),y.set(e,o.then((()=>{y.delete(e)}))),y.get(e)}function w(s,l,i,a){let c=[s];m.forEach((e=>{const t=`<${e}/>`,r=n[e];c=c.map((e=>{if("string"!=typeof e)return e;let n=e.split(t);if(1===n.length)return n[0];for(let e=n.length-1;e;e--)n.splice(e,0,r.map((t=>InlineIcon({key:t+e,pngName:t}))));return n})).flat()})),a.forEach((e=>{const t=`<${e.id}/>`,r=e.icons;c=c.map((e=>{if("string"!=typeof e)return e;let n=e.split(t);if(1===n.length)return n[0];for(let e=n.length-1;e;e--)n.splice(e,0,r.map((t=>InlineIcon({key:t+"+"+e,url:t,className:"custom"}))));return n})).flat()})),l.forEach((e=>{e&&(c=c.map((t=>{if("string"!=typeof t)return t;let n=t.split(e);if(1===n.length)return n[0];for(let t=n.length-1;t;t--)n.splice(t,0,r({className:"blue-word"},e));return n})).flat())})),i.forEach((e=>{e&&(c=c.map((t=>{if("string"!=typeof t)return t;let n=t.split(e);if(1===n.length)return n[0];for(let t=n.length-1;t;t--)n.splice(t,0,r({className:"orange-word"},e));return n})).flat())})),c=c.map((e=>{if("string"!=typeof e)return e;let r=e.split(/\n+/g);if(1===r.length)return r[0];for(let e=r.length-1;e;e--)r.splice(e,0,t());return r})).flat(),c=c.filter((e=>!!e));for(let t=0;t<c.length;t++){const r=c[t];if("string"==typeof r)continue;if(!o.isValidElement(r))continue;if(!r.props.pngName)continue;const n={},s=[];Object.keys(r.props).forEach((e=>{n[e]=r.props[e]})),r.props.children&&!Array.isArray(r.props.children)&&s.push(r.props.children);let l=c[t+1];for(;l;)c.splice(t+1,1),s.push(l),l="string"!=typeof l||l.trim()?o.isValidElement(l)&&l.props.pngName?c[t+1]:void 0:c[t+1];c.splice(t,1,Function.apply.call(InlineIcon,e,[n,...s]))}return c}export const InlineIcon=e((function(e){const t=p((t=>{const r=e.url||`/Assets/keyword/${e.pngName}`;a(r).then(t)}),[e.pngName,e.url]);return r({className:"inline-icon "+(e.className||""),style:{"--icon-image":t?`url(${t})`:"none"}},e.children)}));export default e((function(r){let n=r.effectText,o=r.levelText;if(n&&"string"!=typeof n||o&&"string"!=typeof o)throw new Error("Only strings accepted");const{customKeywords:l}=s(c),i=f((e=>{let t=r.blueWords?[...r.blueWords]:[],o=r.orangeWords?[...r.orangeWords]:[];t.sort(((e,t)=>t.length-e.length)),o.sort(((e,t)=>t.length-e.length));e(w(n,t,o,l))}),200,[n,r.blueWords,r.orangeWords],[]),u=f((e=>{let t=r.blueWords?[...r.blueWords]:[],n=r.orangeWords?[...r.orangeWords]:[];t.sort(((e,t)=>t.length-e.length)),n.sort(((e,t)=>t.length-e.length));e(w(o,t,n,l))}),200,[o,r.blueWords,r.orangeWords],[]),m=p((e=>{a("/Assets/champion/levelupbar.png").then(e)}),[]),g=t.apply(e,[{className:`effect-text ${r.className||""}`},...i]),d=t.apply(e,[{className:`effect-text level-color ${r.className||""}`},...u]);return n||o?t({className:"card-effects-wrapper"},n?g:void 0,o?t({className:"level-bar",style:{backgroundImage:m?`url(${m||""})`:"none"}}):void 0,o?d:void 0):null}),u);