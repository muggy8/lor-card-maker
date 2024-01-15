import e from"/cdn/save-svg-as-png";import{openUri as t}from"/Views/card-editor.js";export default async function(s,n,a){const o=n.width.baseVal.value,r=n.height.baseVal.value;if("json"===a.state.settings.exportFormat){const e=jsonToBlob(JSON.stringify(s,null,"\t")),n=await new Promise((t=>{var s=new FileReader;s.readAsDataURL(e),s.onloadend=function(){t(s.result)}}));return t(n,`${(s.fileName||s.name||"export").toUpperCase()}.json`)}if("svg"===a.state.settings.exportFormat){const a=await e.svgAsDataUri(n,{excludeUnusedCss:!0,width:o,height:r});return t(a,`${(s.fileName||s.name||"export").toUpperCase()}.svg`)}{const i=await e.svgAsPngUri(n,{excludeUnusedCss:!0,width:o,height:r,encoderType:`image/${a.state.settings.exportFormat}`,excludeUnusedCss:!0});return t(i,`${(s.fileName||s.name||"export").toUpperCase()}.${a.state.settings.exportFormat||"png"}`)}}export function jsonToBlob(e){const t=(new TextEncoder).encode(e);return new Blob([t],{type:"application/json;charset=utf-8"})}