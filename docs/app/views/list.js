import e,{button as t,div as o,input as r,label as a,section as l}from"/Utils/elements.js";import{useContext as n,useState as s}from"/cdn/react";import{Globals as m}from"/Views/index.js";import c from"/Utils/load-css.js";import p from"/Utils/use-lang.js";import{getCardList as i}from"/Utils/service.js";import d from"/Components/list-limit.js";import u from"/Views/deck-builder.js";import f from"/Components/card-template/spell.js";import h from"/Components/card-template/champion1.js";import y from"/Components/card-template/champion2.js";import b from"/Components/card-template/champion3.js";import w from"/Components/card-template/follower.js";import k from"/Components/card-template/landmark.js";import j from"/Components/card-template/keyword.js";import C from"/Views/card-editor.js";import g from"/Views/deck-builder.js";import x from"/Utils/use-asset-cache.js";import v from"/Components/deck/deck-icon.js";const K={name:"",mana:0,clan:[],art:"",id:"",faction:[],keywords:[],effect:"",orangeWords:[],blueWords:[],dataVersion:2,transform:{x:0,y:0,scale:1},associatedCards:[]},N={blur:15,darkness:.25,gradientLocation:[50,75]};Object.freeze(N),Object.freeze(N.gradientLocation);export const defaultShade=N;const V=[{component:h,labelKey:"champ1",editor:C(h,{...K,power:0,health:0,lvup:"",rarity:"champion",type:"champion1",shade:N})},{component:y,labelKey:"champ2",editor:C(y,{...K,power:0,health:0,lvup:"",rarity:"",type:"champion2",shade:N})},{component:b,labelKey:"champ3",editor:C(b,{...K,power:0,health:0,lvup:"",rarity:"",type:"champion3",shade:N})},{component:f,labelKey:"spell",editor:C(f,{...K,power:null,health:null,speed:void 0,rarity:"",type:"spell",power:null,health:null,mana:"",lvup:""})},{component:f,labelKey:"equipment",editor:C(f,{...K,power:null,health:null,speed:"equipment",rarity:"",keywords:["equipment"],type:"spell",power:0,health:0,mana:0,lvup:""})},{component:w,labelKey:"follower",editor:C(w,{...K,power:0,health:0,lvup:"",rarity:"",type:"follower",shade:N})},{component:k,labelKey:"landmark",editor:C(k,{...K,lvup:"",rarity:"",keywords:["landmark"],type:"landmark",shade:N})},{component:j,labelKey:"keyword",editor:C(j,{id:"",name:"",type:"keyword",effect:"",blueWords:[],orangeWords:[],dataVersion:2,icons:[],largerIcon:!1})},{component:v,labelKey:"deck",beta:!0,editor:u}];export function typeToComponent(e){switch(e){case"champion1":return h;case"champion2":return y;case"champion3":return b;case"landmark":return k;case"follower":return w;case"spell":return f;case"keyword":return j;case"deck":return v;default:return}}const L=e((function(){const e=n(m),a=!0===e.state.settings.lowSpecsMode,c=p(),u=x((e=>{i({include:"deck"}).then(e)}),[],[]),[f,h]=s("");return l({id:"card-type-list",className:"gutter-t-2"},o({className:"flex gutter-rbl"},o({className:"flex grow gutter-r"},r({className:"grow gutter-trbl-.5",value:f,placeholder:c("search"),type:"search",onChange:e=>{h((e.target.value||"").toLowerCase())}})),t({className:"gutter-trbl-0.5 flex vhcenter",onClick:()=>h("")},o({className:"icon multiply"}))),o({className:"gutter-trbl-.5 flex"},d({defaultSize:a?4:void 0},V.map((t=>{const r=c("new_label",{cardType:c(t.labelKey),betaIf:t.beta?c("beta"):""},!1);return f&&!r.toLowerCase().includes(f)?null:o({className:"clickable gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter",key:t.labelKey,onClick:()=>{e.setView(t.editor)}},t.component({...t.editor.defaultCardData,name:r}))})).filter((e=>!!e)),u.map((t=>{const r=typeToComponent(t.type);return r?f&&t.name&&!t.name.toLowerCase().includes(f)?null:o({className:"clickable gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter",key:t.id,onClick:()=>{const o=V.find((e=>e.component===r));e.setView(o.editor),e.patchState({cardId:t.id})}},r(t)):null})).filter((e=>!!e)))))}),c("/Views/list.css"));export default L;