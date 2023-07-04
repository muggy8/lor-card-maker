import e,{div as t,span as a,label as s,a as o,input as r,nav as n,select as i,option as l,fragment as c}from"/Utils/elements.js";import{useCallback as m,useState as d,useRef as p,useContext as u,useEffect as g}from"/cdn/react";import{Globals as b}from"/Views/index.js";import y from"/Utils/load-css.js";import k from"/Utils/use-lang.js";import{getBackup as f,saveCard as h}from"/Utils/service.js";import v from"/Views/batch-export.js";import w from"/Utils/use-toggle.js";import{stringToBlob as N}from"/Components/export.js";import j from"/Views/batch-delete.js";const C=y("/Components/side-bar.css"),x=["oled","dark","light","flash-bomb"],V=["png","webp","jpeg","json","svg"];export default e((function(){const e=k(),a=u(b);g((()=>{document.body.classList.remove(...document.body.classList),document.body.classList.add(a.state.settings.theme)}),[a.state.settings]);const[y,C]=d(!1),_=m((()=>{C(!y)}),[y]),L=p(),U=m((async()=>{const e=await f(),t=JSON.stringify(e);!async function(e,t){if(window.AndroidNativeInterface){const a=await new Promise((t=>{var a=new FileReader;a.readAsDataURL(e),a.onloadend=function(){t(a.result)}})),s=/data:([^;]+);(([^;]+);)*base64,/,[o,r]=s.exec(a),n=JSON.stringify({image:a.substr(o.length),fileName:t});window.AndroidNativeInterface.postMessage(n)}else{var a=document.createElement("a");a.href=URL.createObjectURL(e),a.download=t,a.click()}}(N(t),"card-data.json")}),[]),[S,A,O]=w(!1),F=m((async e=>{O(!0);const t=await new Promise((t=>{let a=new FileReader,s=e.target.files[0];a.addEventListener("load",(()=>{let e=JSON.parse(a.result);t(e)})),s&&a.readAsText(s)})),a=[{key:"savedChampions1",type:"champion1"},{key:"savedChampions2",type:"champion2"},{key:"savedChampions3",type:"champion3"},{key:"savedFollowers",type:"follower"},{key:"savedKeywords",type:"keyword"},{key:"savedLandmarks",type:"landmark"},{key:"savedSpells",type:"spell"}].map((e=>t[e.key]?t[e.key].map((({id:t,cardData:a})=>(a.id=t,a.type=e.type,"gemless"!==a.rarity&&"none"!==a.rarity||(a.rarity=""),a.dataVersion=2,a))):[])).flat(),s=t.cards?t.cards.filter((e=>2===e.dataVersion)):[];[...a,...s].forEach((e=>{Object.prototype.hasOwnProperty.call(e,"clan")&&(Array.isArray(e.clan)||(e.clan?e.clan=[e.clan]:e.clan=[]))}));const o=[...a,...s];for(let e of o)await h(e.id,e);O(!1),document.location.reload()})),R=m((()=>{a.setView(v),C(!1)}),[a.setView]),J=m((()=>{a.setView(j),console.log("batch delete time"),C(!1)}),[a.setView]);return c(t({className:"side-bar-backdrop "+(y?"open":""),onClick:_}),n({className:"side-bar card-text-universe gutter-rl-3 flex column vhcenter "+(y?"open":"")},t({className:"menu-icon flex vhcenter",onClick:_},t({className:"icon animated clickable "+(y?"multiply":"menu")})),t({className:"menu-contents gutter-tb-2"},s({className:"menu-option clickable gutter-tb"},t(e("theme")),i({value:a.state.settings.theme||"oled",onChange:e=>a.patchSettings({theme:e.target.value}),className:"select-theme gutter-rl-1 gutter-tb-.5"},x.map((t=>l({key:t,value:t},e(t)))))),s({className:"menu-option clickable gutter-tb"},t(e("export_format")),i({value:a.state.settings.exportFormat||"png",onChange:e=>a.patchSettings({exportFormat:e.target.value}),className:"select-theme gutter-rl-1 gutter-tb-.5"},V.map((t=>l({key:t,value:t},e(t)))))),t({className:"menu-option clickable gutter-tb",onClick:R},e("batch_export")),t({className:"menu-option clickable gutter-tb",onClick:J},e("bulk_delete")),t({className:"menu-option clickable gutter-tb",onClick:U},e("export_save")),s({className:"menu-option clickable gutter-tb"},S?void 0:e("import_save"),S?void 0:r({className:"hide",accept:"application/json",type:"file",onChange:F}),S?t({className:"icon loading"}):void 0),s({className:"menu-option clickable gutter-tb",onClick:()=>L.current.click()},e("report_bug"),o({ref:L,href:"https://github.com/muggy8/lor-card-maker/issues",className:"hide",target:"_blank"})),s({className:"menu-option clickable gutter-tb",onClick:()=>L.current.click()},e("join_discord"),o({ref:L,href:"https://discord.gg/tKScJa6u6m",className:"hide",target:"_blank"})))))}),C);