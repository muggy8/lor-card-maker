import e,{div as a,label as l,strong as t,input as c}from"/Utils/elements.js";import{useCallback as o}from"/cdn/react";export default e((function(e){const c=o((a=>{e.updateValue&&e.updateValue(!e.value)}),[e.updateValue,e.value]);return l({className:"flex box clickable no-wrap",onClick:c},a({className:"animated icon checkbox "+(e.value?"checked":"")}),e.label?a({className:"gutter-b-.5 gutter-l grow"},t(e.label)):void 0)}));