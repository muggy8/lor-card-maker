import e,{label as t,div as o,strong as r}from"/Utils/elements.js";import a from"/Utils/use-lang.js";import{useCallback as n,useState as l}from"/cdn/react";import s from"/Components/card-template/svg-wrap.js";import c,{keywords as m}from"/Components/card-template/keyword-renderer.js";export const KeywordImageCheck=e((function(e){const t=e.isChecked,[r,a]=l({width:120,height:104});return o({className:"gutter-trbl-.25 clickable flex column vhcenter "+(t?"":"ghost"),onClick:e.onClick},s(r,c({name:e.keywordName,size:"small",onDimension:a})))}));export default e((function(e){const l=a(),s=n((t=>{if(e.value.indexOf(t)>-1){const o=e.value.filter((e=>e!==t));return e.updateValue(o)}const o=[...e.value,t];e.updateValue(o)}),[e.value,e.updateValue]);return t(o(r(l("keyword"))),o({className:"flex gutter-b-2"},Object.keys(m).map((t=>{const r=e.value.some((e=>e===t));return o({className:"box-3 flex vhcenter",key:t},KeywordImageCheck({isChecked:r,onClick:()=>{s(t)},keywordName:t}))}))))}));