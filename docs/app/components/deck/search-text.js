import e,{div as t,label as a,input as l,button as r}from"/Utils/elements.js";import{useCallback as s}from"/cdn/react";export default e((function(e){const o=s((t=>{e.onChange(t.target.value)}),[e.onChange]);return a({className:"filter-option gutter-b-.5"},t({className:"gutter-b-.5"},e.label),t({className:"flex gutter-rl-.5"},l({className:"grow gutter-trbl-.5",type:"search",value:e.value||"",onChange:o}),t({className:"gutter-r-.5"}),r({className:"grow gutter-trbl-.5",onClick:()=>e.onChange(void 0)},t({className:"icon"},t({className:"delete"})))))}));