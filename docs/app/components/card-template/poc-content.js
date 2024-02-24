import e,{div as t}from"/Utils/elements.js";import{useRef as r,useState as o,useEffect as n,useContext as s}from"/cdn/react";import{Globals as a}from"/Views/index.js";import c from"/Utils/load-css.js";import m from"/Components/card-template/svg-wrap.js";import i from"/Components/card-template/image-render.js";import p,{scaleFontSize as f}from"/Components/card-template/effect-text.js";import d from"/Components/card-template/keyword-renderer.js";import l from"/cdn/fitty";import u from"/Utils/datauri.js";import y from"/Utils/use-debounce-effect.js";import g from"/Utils/concurrency-manager.js";import j,{useAssetCacheDebounced as x}from"/Utils/use-asset-cache.js";import{AutoFitClanText as w}from"/Components/card-template/unit.js";import N from"/Utils/use-lang.js";import T from"/Components/card-template/poc-icon.js";const b=c("/Components/card-template/poc-content.css");export default e((function(e){const o=j((e=>{u("/Assets/keyword/frame.png").then(e)}),[]),s=j((e=>{u("/Assets/keyword/division.png").then(e)}),[]),a=r();n((()=>{a.current=g()}),[]);const c=r();y((()=>{o&&a.current.sequential((()=>f(c.current)))}),300,[e.name,e.effect,e.pocType,e.rarity,,!!o]);const i=r();y((()=>{o&&a.current.concurrent((()=>f(i.current,60,16)))}),200,[e.name,e.effect,e.pocType,e.rarity,!!o]);const d=r();return y((()=>{o&&a.current.concurrent((()=>f(d.current,40,16)))}),100,[e.name,e.effect,e.pocType,e.rarity,,!!o]),m({loading:!o||e.loading,onTransform:e.updateTransform,...e.transform||{x:0,y:0,scale:1}},o?t({className:`poc-content ${e.rarity} ${e.pocType}`},t({className:"background",style:{backgroundImage:o?`url(${o})`:"none"}},T({className:"poc-content-icon",...e}),t({className:"division",style:{backgroundImage:s?`url(${s})`:"none"}}),t({className:"card-text-wrapper",ref:c},e.name?t({className:"name fitty-wrap card-text-bold card-text-outline",ref:i},e.name):void 0,t(t({className:`type-text fitty-wrap card-text-outline ${e.rarity}`,ref:d},`${e.rarity} ${e.pocType}`)),p({blueWords:e.blueWords,orangeWords:e.orangeWords,className:"effect-container card-text-universe",effectText:e.effect})))):void 0)}),b);