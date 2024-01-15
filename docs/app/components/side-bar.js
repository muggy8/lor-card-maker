import e,{div as t,span as a,label as s,a as o,input as l,nav as n,select as r,option as c,fragment as i}from"/Utils/elements.js";import{useCallback as m,useState as d,useRef as p,useContext as u,useEffect as g}from"/cdn/react";import{Globals as b}from"/Views/index.js";import k from"/Utils/load-css.js";import h from"/Utils/use-lang.js";import{getBackup as y,saveCard as f}from"/Utils/service.js";import v from"/Views/batch-export.js";import w from"/Utils/use-toggle.js";import{jsonToBlob as N}from"/Components/export.js";import C from"/Views/batch-delete.js";const j=k("/Components/side-bar.css"),x=["oled","dark","light","flash-bomb"],S=["png","webp","jpeg","json","svg"];export default e((function(){const e=h(),a=u(b),k=!0===a.state.settings.lowSpecsMode;g((()=>{document.body.classList.remove(...document.body.classList),document.body.classList.add(a.state.settings.theme)}),[a.state.settings]);const[j,_]=d(!1),V=m((()=>{_(!j)}),[j]),L=p(),U=m((async()=>{const e=await y(),t=JSON.stringify(e);!async function(e,t){if(window.AndroidNativeInterface){const a=await new Promise((t=>{var a=new FileReader;a.readAsDataURL(e),a.onloadend=function(){t(a.result)}})),s=/data:([^;]+);(([^;]+);)*base64,/,[o,l]=s.exec(a),n=JSON.stringify({image:a.substr(o.length),fileName:t});window.AndroidNativeInterface.postMessage(n)}else{var a=document.createElement("a");a.href=URL.createObjectURL(e),a.download=t,a.click()}}(N(t),"card-data.json")}),[]),[A,O,F]=w(!1),R=m((async e=>{F(!0);const t=await new Promise((t=>{let a=new FileReader,s=e.target.files[0];a.addEventListener("load",(()=>{let e=JSON.parse(a.result);t(e)})),s&&a.readAsText(s)})),a=[{key:"savedChampions1",type:"champion1"},{key:"savedChampions2",type:"champion2"},{key:"savedChampions3",type:"champion3"},{key:"savedFollowers",type:"follower"},{key:"savedKeywords",type:"keyword"},{key:"savedLandmarks",type:"landmark"},{key:"savedSpells",type:"spell"}].map((e=>t[e.key]?t[e.key].map((({id:t,cardData:a})=>(a.id=t,a.type=e.type,"gemless"!==a.rarity&&"none"!==a.rarity||(a.rarity=""),a.dataVersion=2,a))):[])).flat(),s=t.cards?t.cards.filter((e=>2===e.dataVersion)):[];[...a,...s].forEach((e=>{Object.prototype.hasOwnProperty.call(e,"clan")&&(Array.isArray(e.clan)||(e.clan?e.clan=[e.clan]:e.clan=[]))}));const o=[...a,...s];for(let e of o)await f(e.id,e);F(!1),document.location.reload()})),J=m((()=>{a.setView(v),_(!1)}),[a.setView]),M=m((()=>{a.setView(C),console.log("batch delete time"),_(!1)}),[a.setView]);return i(t({className:"side-bar-backdrop "+(j?"open":""),onClick:V}),n({className:"side-bar card-text-universe gutter-rl-3 flex column vhcenter "+(j?"open":"")},t({className:"menu-icon flex vhcenter",onClick:V},t({className:`icon clickable ${k?"":"animated"} ${j?"multiply":"menu"}`})),t({className:"menu-contents gutter-tb-2"},s({className:"menu-option clickable gutter-tb"},t(e("theme")),r({value:a.state.settings.theme||"oled",onChange:e=>a.patchSettings({theme:e.target.value}),className:"select-theme gutter-rl-1 gutter-tb-.5"},x.map((t=>c({key:t,value:t},e(t)))))),s({className:"menu-option clickable gutter-tb"},t(e("export_format")),r({value:a.state.settings.exportFormat||"png",onChange:e=>a.patchSettings({exportFormat:e.target.value}),className:"select-theme gutter-rl-1 gutter-tb-.5"},S.map((t=>c({key:t,value:t},e(t)))))),t({className:"menu-option clickable gutter-tb",onClick:J},e("batch_export")),t({className:"menu-option clickable gutter-tb",onClick:M},e("bulk_delete")),t({className:"menu-option clickable gutter-tb",onClick:U},e("export_save")),s({className:"menu-option clickable gutter-tb"},A?void 0:e("import_save"),A?void 0:l({className:"hide",accept:"application/json",type:"file",onChange:R}),A?t({className:"icon loading"}):void 0),s({className:"menu-option clickable gutter-tb",onClick:()=>{}},t(e("low_specs_mode")),r({value:a.state.settings.lowSpecsMode||0,onChange:e=>a.patchSettings({lowSpecsMode:!!parseInt(e.target.value)}),className:"select-theme gutter-rl-1 gutter-tb-.5"},c({value:1},e("on")),c({value:0},e("off")))),s({className:"menu-option clickable gutter-tb",onClick:()=>L.current.click()},e("report_bug"),o({ref:L,href:"https://github.com/muggy8/lor-card-maker/issues",className:"hide",target:"_blank"})),s({className:"menu-option clickable gutter-tb",onClick:()=>L.current.click()},e("join_discord"),o({ref:L,href:"https://discord.gg/tKScJa6u6m",className:"hide",target:"_blank"})))))}),j);