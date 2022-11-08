import e,{div as t,section as o}from"/Utils/elements.js";import{useContext as r,useEffect as a,useState as n}from"/cdn/react";import{Globals as l}from"/Views/index.js";import m from"/Utils/load-css.js";import p from"/Utils/use-lang.js";import{getCardList as s}from"/Utils/service.js";import c from"/Components/list-limit.js";import i from"/Components/card-template/spell.js";import d from"/Components/card-template/champion1.js";import f from"/Components/card-template/champion2.js";import h from"/Components/card-template/champion3.js";import y from"/Components/card-template/follower.js";import u from"/Components/card-template/landmark.js";import b from"/Components/card-template/keyword.js";import w from"/Views/card-editor.js";const k={name:"",mana:0,clan:"",art:"",id:"",faction:[],keywords:[],effect:"",orangeWords:[],blueWords:[],dataVersion:2,transform:{x:0,y:0,scale:1}},j={blur:15,darkness:.25,gradientLocation:[50,75]};Object.freeze(j),Object.freeze(j.gradientLocation);export const defaultShade=j;const x=[{component:d,labelKey:"champ1",editor:w(d,{...k,power:0,health:0,lvup:"",rarity:"champion",type:"champion1",shade:j})},{component:f,labelKey:"champ2",editor:w(f,{...k,power:0,health:0,lvup:"",rarity:"",type:"champion2",shade:j})},{component:h,labelKey:"champ3",editor:w(h,{...k,power:0,health:0,lvup:"",rarity:"",type:"champion3",shade:j})},{component:i,labelKey:"spell",editor:w(i,{...k,power:null,health:null,speed:void 0,rarity:"",type:"spell",power:null,health:null,mana:"",lvup:""})},{component:y,labelKey:"follower",editor:w(y,{...k,power:0,health:0,lvup:"",rarity:"",type:"follower",shade:j})},{component:u,labelKey:"landmark",editor:w(u,{...k,lvup:"",rarity:"",keywords:["landmark"],type:"landmark",shade:j})},{component:b,labelKey:"keyword",beta:!0,editor:w(b,{name:"",type:"keyword",effect:"",blueWords:[],orangeWords:[],dataVersion:2})}];export function typeToComponent(e){switch(e){case"champion1":return d;case"champion2":return f;case"champion3":return h;case"landmark":return u;case"follower":return y;case"spell":return i;case"keyword":return b;default:return}}const C=e((function(){const e=r(l),m=p(),[i,d]=n([]);return a((()=>{s().then(d)}),[]),o({id:"card-type-list",className:"gutter-t-2"},t({className:"gutter-trbl-.5 flex"},c(x.map((o=>t({className:"clickable gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter",key:o.labelKey,onClick:()=>{e.setView(o.editor)}},o.component({name:`${m("new")} ${m(o.labelKey)}`+(o.beta?" "+m("beta"):"")})))),i.map((o=>{const r=typeToComponent(o.type);return r?t({className:"clickable gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter",key:o.id,onClick:()=>{const t=x.find((e=>e.component===r));e.setView(t.editor),e.patchState({cardId:o.id})}},r(o)):t({key:o.id})})))))}),m("/Views/list.css"));export default C;