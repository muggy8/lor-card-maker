import e,{div as r}from"/Utils/elements.js";import{useRef as o,useState as s,useEffect as t,useContext as n}from"/cdn/react";import{Globals as a}from"/Views/index.js";import c from"/Components/card-template/svg-wrap.js";import m from"/Utils/load-css.js";import i from"/Utils/datauri.js";import l,{scaleFontSize as d}from"/Components/card-template/effect-text.js";import f from"/Components/card-template/image-render.js";import u from"/Utils/use-debounce-effect.js";import p from"/Utils/concurrency-manager.js";import g from"/Utils/use-asset-cache.js";const j=m("/Components/card-template/keyword.css");export default e((function(e){const s=g((e=>{i("/Assets/keyword/frame.png").then(e)}),[]),n=g((e=>{i("/Assets/keyword/division.png").then(e)}),[]),a=o();t((()=>{a.current=p()}),[]);const m=o();u((()=>{s&&a.current.concurrent((()=>d(m.current,60,16)))}),200,[e.name,e.icons,!!s]);const f=o();return u((()=>{s&&a.current.sequential((()=>d(f.current)))}),300,[e.effect,!!s]),c({width:512,height:512,loading:!s,isInclusion:e.isInclusion},s?r({className:"keyword",id:e.id,style:{backgroundImage:s?`url(${s})`:"none"}},r({className:"content",ref:f},r({className:"name-area"},e.icons&&e.icons.length?e.icons.map((o=>r({className:"keyword-icon "+(e.largerIcon?"larger-icon":""),style:{backgroundImage:`url(${o})`},key:o}))):void 0,r({className:"name orange-word",ref:m},e.name)),r({className:"division",style:{backgroundImage:n?`url(${n})`:"none"}}),e.effect?l({blueWords:e.blueWords,orangeWords:e.orangeWords,className:"effect-container card-text-universe",effectText:e.effect}):void 0)):null)}),j);