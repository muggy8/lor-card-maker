import e,{div as t,label as a,strong as l,input as r,button as o,fragment as u}from"/Utils/elements.js";import{Globals as s}from"/Views/index.js";import{useCallback as m,useRef as c,useContext as i,useEffect as n}from"/cdn/react";import d from"/Utils/use-lang.js";export default e((function(e){const g=d(),p=i(s),f=c();f.current=p;const b=m((t=>{if(!t.target.files[0])return;const a=Array.prototype.map.call(t.target.files,(e=>new Promise((t=>{let a=new FileReader;a.addEventListener("load",(function(){t(a.result)})),a.readAsDataURL(e)}))));Promise.all(a).then((a=>{e.multiple?e.updateValue(a):e.updateValue(a[0]),f.current.patchState({moveableArt:!0}),t.target.value=null}))}),[e.updateValue,e.multiple]),v=c(),h=m((()=>{v.current.click()}),[]);return n((()=>()=>{f.current.patchState({defaultBg:!0,moveableArt:!1})}),[]),u(a(t(l(e.label)),t({className:"flex hcenter gutter-trl-.5"},o({className:"gutter-trbl grow",onClick:h},g("upload_image"))),r({ref:v,className:"hide",type:"file",accept:"image/*",onChange:b,...e.multiple?{multiple:!0}:{}})),!1!==e.moveable?t({className:"flex gutter-t-.5"},t({className:"flex gutter-l-.5 gutter-r-.25 box-6"},o({className:"box gutter-trbl-.5",onClick:()=>{e.value?p.patchState({moveableArt:!p.state.moveableArt}):p.value.moveableArt&&p.patchState({moveableArt:!1})},disabled:!e.value},g(p.state.moveableArt?"lock_art_movement":"unlock_art_movement"))),t({className:"flex gutter-r-.5 gutter-l-.25 box-6"},o({className:"box gutter-trbl-.5",onClick:()=>{p.patchState({defaultBg:!p.state.defaultBg})}},g(p.state.defaultBg?"default_bg_hide":"default_bg_show")))):void 0)}));