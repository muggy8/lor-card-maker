import t from"/cdn/save-svg-as-png";import{openUri as e}from"/Views/card-editor.js";export default async function(a,s,o){const n=s.width.baseVal.value,r=s.height.baseVal.value;if("json"===o.state.settings.exportFormat)return e(`data:application/json;base64,${btoa(JSON.stringify(a,null,"\t"))}`,`${(a.name||"export").toUpperCase()}.json`);if("svg"===o.state.settings.exportFormat){const o=await t.svgAsDataUri(s,{excludeUnusedCss:!0,width:n,height:r});e(o,`${(a.name||"export").toUpperCase()}.svg}`)}else{const p=await t.svgAsPngUri(s,{excludeUnusedCss:!0,width:n,height:r});if(!o.state.settings.exportFormat||"png"===o.state.settings.exportFormat)return e(p,`${(a.name||"export").toUpperCase()}.png}`);const g=new OffscreenCanvas(n,r),d=g.getContext("2d"),m=await new Promise((t=>{const e=new Image(n,r);e.onload=()=>t(e),e.src=p}));d.drawImage(m,0,0);const c=await g.convertToBlob({type:`image/${o.state.settings.exportFormat}`,quality:.8});var i=new FileReader;i.readAsDataURL(c),i.onloadend=function(){var t=i.result;e(t,`${(a.name||"export").toUpperCase()}.${o.state.settings.exportFormat}}`)}}}