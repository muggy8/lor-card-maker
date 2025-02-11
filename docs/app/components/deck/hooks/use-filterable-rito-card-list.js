import{useState as e,useCallback as t,useEffect as r,useContext as o}from"/cdn/react";import{getRitoCards as s,patchRitoCards as i,getLatestRitoData as n}from"/Utils/service.js";import l from"/Utils/use-filter.js";import a from"/Utils/use-asset-cache.js";import c from"/Components/deck/hooks/get-filter-options-form-card-list.js";import{Globals as f}from"/Views/index.js";export function getRitoCardsFromDataDump({sets:e}){if(!e)return;const t=e.map((e=>e.data)).flat();return t.sort(((e,t)=>{if("champion"===e.rarityRef.toLowerCase()&&"champion"!==t.rarityRef.toLowerCase())return-1;if("champion"!==e.rarityRef.toLowerCase()&&"champion"===t.rarityRef.toLowerCase())return 1;const r=e.cost-t.cost;if(r)return r;const o=t.collectible-e.collectible;if(o)return o;const s=e.name.localeCompare(t.name);return s||0})),t}export default function u(u){const[p,d]=e(),m=o(f);r((()=>{s().then((e=>{let t;d(t=getRitoCardsFromDataDump(e)),t.forEach((e=>{e&&(u.current[e.cardCode]=e)}))}))}),[]);const[h,C]=e(!1),w=t((()=>{h||(C(!0),n({},m.state.settings.lang).then((async e=>{await i(e),d(getRitoCardsFromDataDump(e)),C(!1)})))}),[h]),[g,L,y,R]=l({collectible:{value:!0,filter:(e,t)=>t===e},name:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},descriptionRaw:{filter:(e,t,r)=>!e||(t.toLowerCase().includes(e.toLowerCase())||r.levelupDescriptionRaw.toLowerCase().includes(e.toLowerCase())||r.description.toLowerCase().includes(e.toLowerCase())||r.levelupDescription.toLowerCase().includes(e.toLowerCase()))},subtypes:{filter:(e,t)=>!e||Array.prototype.some.call(t,(t=>t.toLowerCase().includes(e.toLowerCase())))},type:{filter:(e,t)=>!e||!e.length||e.includes(t)},set:{filter:(e,t)=>!e||!e.length||e.includes(t)},keywords:{filter:(e,t)=>!e||!e.length||t.some((t=>e.includes(t)))},rarityRef:{filter:(e,t)=>!e||!e.length||e.includes(t)},regionRefs:{filter:(e,t)=>!e||!e.length||e.some((e=>t.includes(e)))},spellSpeed:{filter:(e,t)=>!e||!e.length||e.includes(t)},cost:{filter:(e,t)=>{if(!e||!e.length)return!0;const[r,o]=e;return t<=o&&t>=r}},attack:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[o,s]=e;return t<=s&&t>=o}},health:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[o,s]=e;return t<=s&&t>=o}}});r((()=>{if(!p||!p.length)return L([]);L(p)}),[p]);const D=t(((e,t)=>{const r={};r[e]=t,R(r)}),[R]),k=a((e=>{if(!(p&&p.length&&g&&g.length))return;const t=c(p);t.set.sort(((e,t)=>e.localeCompare(t)));const r=c(g),o={...t,keywords:r.keywords};console.log(o),e(o)}),[p,g],{});return{cardList:p,loading:h,refreshList:w,filteredCardList:g,currentFilters:y,patchFilter:D,patchFilters:R,filterOptions:k}}