import factory,{div,span}from"/Utils/elements.js";import{keywords}from"/Components/card-template/keyword-renderer.js";import React,{useRef,useLayoutEffect,useState,useEffect}from"/cdn/react";import setImmediate from"/Utils/set-immediate-batch.js";import loadCss from"/Utils/load-css.js";import datauri from"/Utils/datauri.js";import useEffectDebounce from"/Utils/use-debounce-effect.js";const cssLoaded=loadCss("/Components/card-template/effect-text.css"),keywordWithIcons=Object.keys(keywords).filter(e=>keywords[e].length);export const effectTextSize=24;const isOverflown=({clientWidth:e,clientHeight:t,scrollWidth:n,scrollHeight:r})=>n>e||r>t;function avg(e,t){return(e+t)/2}function nextTick(){return new Promise(e=>setImmediate(e))}const currentlyRunningScalingTasks=new Map;export async function scaleFontSize(e,t=36,n=24){if(!e)return;let r=window.getComputedStyle(e).getPropertyValue("font-size");if(r=parseFloat(r),r==t&&!isOverflown(e))return;const s=currentlyRunningScalingTasks.get(e);if(s)return s;const o=new Promise(s=>{(async()=>{let o=t,i=n,l=r;for(;o-i>.5;){e.style.fontSize=l+.5+"px",await nextTick();const t=isOverflown(e);e.style.fontSize=l+"px",await nextTick();const n=isOverflown(e);if(!n&&t)return s();n?(o=l,l=avg(o,i)):(i=l,l=avg(o,i))}s()})()});return currentlyRunningScalingTasks.set(e,o.then(()=>{currentlyRunningScalingTasks.delete(e)})),currentlyRunningScalingTasks.get(e)}function EffectTextComponent(e){let t=e.children;if(t&&"string"!=typeof t)throw new Error("Only strings accepted");let n=[...e.blueWords],r=[...e.orangeWords];n.sort((e,t)=>t.length-e.length),r.sort((e,t)=>t.length-e.length);const[s,o]=useState([]);useEffectDebounce(()=>{let e=[t];keywordWithIcons.forEach(t=>{const n=`<${t}/>`,r=keywords[t];e=e.map(e=>{if("string"!=typeof e)return e;let t=e.split(n);if(1===t.length)return t[0];for(let e=t.length-1;e;e--)t.splice(e,0,r.map(t=>InlineIcon({key:t+e,pngName:t})));return t}).flat()}),n.forEach(t=>{t&&(e=e.map(e=>{if("string"!=typeof e)return e;let n=e.split(t);if(1===n.length)return n[0];for(let e=n.length-1;e;e--)n.splice(e,0,span({className:"blue-word"},t));return n}).flat())}),r.forEach(t=>{t&&(e=e.map(e=>{if("string"!=typeof e)return e;let n=e.split(t);if(1===n.length)return n[0];for(let e=n.length-1;e;e--)n.splice(e,0,span({className:"orange-word"},t));return n}).flat())}),e=e.map(e=>{if("string"!=typeof e)return e;let t=e.split(/\n+/g);if(1===t.length)return t[0];for(let e=t.length-1;e;e--)t.splice(e,0,div());return t}).flat(),e=e.filter(e=>!!e);for(let t=0;t<e.length;t++){const n=e[t];if("string"==typeof n)continue;if(!React.isValidElement(n))continue;if(!n.props.pngName)continue;const r={},s=[];Object.keys(n.props).forEach(e=>{r[e]=n.props[e]}),n.props.children&&!Array.isArray(n.props.children)&&s.push(n.props.children);let o=e[t+1];for(;o;)e.splice(t+1,1),s.push(o),o="string"!=typeof o||o.trim()?React.isValidElement(o)&&o.props.pngName?e[t+1]:void 0:e[t+1];e.splice(t,1,Function.apply.call(InlineIcon,factory,[r,...s]))}o(e)},200,[t,e.blueWords,e.orangeWords]);const i=useRef();return useLayoutEffect(()=>{scaleFontSize(i.current)},[s]),div.apply(factory,[{className:"effect-text "+(e.className||""),ref:i},...s])}function InlineIconComponent(e){const[t,n]=useState("");return useEffect(()=>{datauri("/Assets/keyword/"+e.pngName).then(n)},[e.pngName]),span({className:"inline-icon",style:{"--icon-image":t?`url(${t})`:"none"}},div({className:"icon-renderer"}),e.children)}export const InlineIcon=factory(InlineIconComponent);export default factory(EffectTextComponent,cssLoaded);