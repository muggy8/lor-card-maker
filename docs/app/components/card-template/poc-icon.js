import e,{div as r}from"/Utils/elements.js";import{useRef as a,useState as s,useEffect as o,useContext as t,createElement as c}from"/cdn/react";import{Globals as n}from"/Views/index.js";import p from"/Utils/load-css.js";import m from"/Components/card-template/svg-wrap.js";import l from"/Components/card-template/image-render.js";import i,{scaleFontSize as y}from"/Components/card-template/effect-text.js";import d from"/Components/card-template/keyword-renderer.js";import f from"/cdn/fitty";import k from"/Utils/datauri.js";import g from"/Utils/use-debounce-effect.js";import h from"/Utils/concurrency-manager.js";import w,{useAssetCacheDebounced as b}from"/Utils/use-asset-cache.js";import{AutoFitClanText as u}from"/Components/card-template/unit.js";import v from"/Utils/use-lang.js";const A=p("/Components/card-template/poc-icon.css");export default e((function(e){const a=t(n),s=w((e=>{k("/Assets/spell/backdrop.png").then(e)}),[]),o=w((r=>{switch(e.pocType){case"item":k("/Assets/keyword/poc-item-frame.png").then(r);break;case"relic":k("/Assets/keyword/poc-relic-frame.png").then(r);break;default:k("/Assets/keyword/poc-frame-overlay.png").then(r)}}),[e.pocType]),c=w((r=>{switch(e.pocType){case"item":case"relic":r("");break;default:k("/Assets/keyword/poc-frame-overlay-cover.png").then(r)}}),[e.pocType]),p=w((r=>{switch(e.pocType){case"item":switch(e.rarity){case"common":k("/Assets/keyword/poc-item-frame-overlay-common.png").then(r);break;case"rare":k("/Assets/keyword/poc-item-frame-overlay-rare.png").then(r);break;case"epic":k("/Assets/keyword/poc-item-frame-overlay-epic.png").then(r);break;case"champion":case"legendary":k("/Assets/keyword/poc-item-frame-overlay-legendary.png").then(r);break;case"special":k("/Assets/keyword/poc-item-frame-overlay-special.png").then(r);break;default:k("/Assets/keyword/poc-item-frame-overlay-color.png").then(r)}break;case"relic":switch(e.rarity){case"common":k("/Assets/keyword/poc-relic-frame-overlay-common.png").then(r);break;case"rare":k("/Assets/keyword/poc-relic-frame-overlay-rare.png").then(r);break;case"epic":k("/Assets/keyword/poc-relic-frame-overlay-epic.png").then(r);break;case"champion":case"legendary":k("/Assets/keyword/poc-relic-frame-overlay-legendary.png").then(r);break;case"special":k("/Assets/keyword/poc-relic-frame-overlay-special.png").then(r);break;default:k("/Assets/keyword/poc-relic-frame-overlay-color.png").then(r)}break;default:switch(e.rarity){case"common":k("/Assets/keyword/poc-frame-overlay-common.png").then(r);break;case"rare":k("/Assets/keyword/poc-frame-overlay-rare.png").then(r);break;case"epic":k("/Assets/keyword/poc-frame-overlay-epic.png").then(r);break;case"champion":case"legendary":k("/Assets/keyword/poc-frame-overlay-legendary.png").then(r);break;case"special":k("/Assets/keyword/poc-frame-overlay-special.png").then(r);break;default:k("/Assets/keyword/poc-frame-overlay-color.png").then(r)}}}),[e.pocType,e.rarity]),i=w((r=>{switch(e.rarity){case"common":k("/Assets/keyword/poc-common.png").then(r);break;case"rare":k("/Assets/keyword/poc-rare.png").then(r);break;case"epic":k("/Assets/keyword/poc-epic.png").then(r);break;case"champion":case"legendary":k("/Assets/keyword/poc-legendary.png").then(r);break;case"special":k("/Assets/keyword/poc-special.png").then(r);break;default:r("")}}),[e.rarity]);return m({width:384,height:384,isInclusion:e.isInclusion},r({className:`poc-icon-sticker ${e.rarity} ${e.pocType}`},r({className:"art",style:{backgroundImage:!e.art&&a.state.defaultBg&&s?`url(${s})`:"none","--scale":e.transform?e.transform.scale:1,"--left":e.transform?e.transform.x:0,"--top":e.transform?e.transform.y:0}},r({className:"scale-adjuster"},l({url:e.art}))),o?r({className:"frame-overlay",style:{backgroundImage:`url(${o})`}}):void 0,c?r({className:"frame-overlay-cover",style:{backgroundImage:`url(${c})`}}):void 0,p?r({className:"frame-rarity",style:{backgroundImage:`url(${p})`}}):void 0,i?r({className:"frame-rarity-gem",style:{backgroundImage:`url(${i})`}}):void 0))}),A);