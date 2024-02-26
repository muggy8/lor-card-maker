import{useCallback as e,useEffect as t}from"/cdn/react";import{getCardList as r}from"/Utils/service.js";import o from"/Utils/use-filter.js";import l from"/Utils/use-asset-cache.js";import n from"/Components/deck/hooks/get-filter-options-form-card-list.js";export default function i(i,s={}){const c=Object.prototype.hasOwnProperty.call(s,"exclude")?s.exclude:["deck"],a=Object.prototype.hasOwnProperty.call(s,"include")?s.include:[],u=l((e=>{r({exclude:c,include:a}).then((t=>{e(t),t.forEach((e=>{e&&e.id&&(i.current[e.id]=e)}))}))}),[]),[f,p,d,h]=o({name:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},effect:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},lvup:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},clan:{filter:(e,t)=>!e||Array.prototype.some.call(t,(t=>t.toLowerCase().includes(e.toLowerCase())))},keywords:{filter:(e,t)=>!e||!e.length||t.some((t=>e.includes(t)||e.some((e=>"string"!=typeof e&&"string"!=typeof t&&e.id===t.id))))},rarity:{filter:(e,t)=>!e||!e.length||e.includes(t)},type:{filter:(e,t)=>!e||!e.length||e.includes(t)},faction:{filter:(e,t)=>!e||!e.length||e.some((e=>t.includes(e)))},speed:{filter:(e,t)=>!e||!e.length||e.includes(t)},mana:{filter:(e,t)=>{if(!e||!e.length)return!0;const[r,o]=e;return t<=o&&t>=r}},power:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[o,l]=e;return t<=l&&t>=o}},health:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[o,l]=e;return t<=l&&t>=o}}});t((()=>{if(!u||!u.length)return p([]);p(u)}),[u]);const m=e(((e,t)=>{const r={};r[e]=t,h(r)}),[h]),w=l((e=>{if(!(u&&u.length&&f&&f.length))return;const t=n(u);t.health&&(t.health=t.health.filter((e=>null!=e))),t.power&&(t.power=t.power.filter((e=>null!=e))),t.mana&&(t.mana=t.mana.filter((e=>null!=e)));const r=t.type;r&&(t.type=t.type.filter((e=>!e.toLowerCase().includes("champion"))),r.length!==t.type.length&&t.type.push("champion"));const o=n(f),l=[];o.keywords&&(o.keywords=o.keywords.filter((e=>{const t=e.id||e;return!l.includes(t)&&(l.push(t),!0)})));e({...t,keywords:o.keywords})}),[u,f],{});return{cardList:u,filteredCardList:f,currentFilters:d,patchFilter:m,patchFilters:h,filterOptions:w}}