import e,{div as a,label as t,strong as l,input as r}from"/Utils/elements.js";import{useCallback as u}from"/cdn/react";export default e((function(e){const s=u((a=>{e.updateValue(isNaN(a.target.valueAsNumber)?"":a.target.valueAsNumber)}),[e.updateValue]);return t({className:"box "+(e.className||"")},a(l(e.label)),a({className:"flex gutter-trl-.5"},r({value:e.value,className:"box-12 gutter-trbl-.5",onChange:s,type:"number"})))}));