import e,{label as t,div as r,strong as a,img as o}from"/Utils/elements.js";import l from"/Utils/use-lang.js";import{useCallback as s}from"/cdn/react";export const rarityOptions=["common","rare","epic","legendary","special"];export default e((function(e){const c=l(),n=s((t=>{e.value===t?e.updateValue(""):e.updateValue(t)}),[e.value,e.updateValue]);return t(r(a(c("rarity"))),r({className:"flex hcenter gutter-b-2 gutter-t-.5"},rarityOptions.map((t=>{const a=t===e.value;return r({className:"clickable flex box-2 column vhcenter "+(a?"":"ghost"),key:t,onClick:()=>{n(t)}},o({src:`/Assets/keyword/poc-${t}.png`}))}))))}));