import factory,{div,label,strong,input,button,fragment}from"/Utils/elements.js";import{Globals}from"/Views/index.js";import{useCallback,useRef,useContext,useEffect}from"/cdn/react";import useLang from"/Utils/use-lang.js";function EditArtComponent(e){const t=useLang(),a=useContext(Globals),l=useRef();l.current=a;const r=useCallback(t=>{let a=t.target.files[0];if(!a)return;let r=new FileReader;r.addEventListener("load",(function(){e.updateValue(r.result),l.current.patchState({moveableArt:!0})})),r.readAsDataURL(a)},[e.updateValue]),u=useRef(),o=useCallback(()=>{u.current.click()},[]);return useEffect(()=>()=>{l.current.patchState({defaultBg:!0,moveableArt:!1})},[]),fragment(label(div(strong(t("card_art"))),div({className:"flex hcenter gutter-trl-.5"},button({className:"gutter-trbl grow",onClick:o},t("upload_image"))),input({ref:u,className:"hide",type:"file",accept:"image/*",onChange:r})),div({className:"flex gutter-t-.5"},div({className:"flex gutter-l-.5 gutter-r-.25 box-6"},button({className:"box gutter-trbl-.5",onClick:()=>{e.value?a.patchState({moveableArt:!a.state.moveableArt}):a.value.moveableArt&&a.patchState({moveableArt:!1})},disabled:!e.value},t(a.state.moveableArt?"lock_art_movement":"unlock_art_movement"))),div({className:"flex gutter-r-.5 gutter-l-.25 box-6"},button({className:"box gutter-trbl-.5",onClick:()=>{a.patchState({defaultBg:!a.state.defaultBg})}},t(a.state.defaultBg?"default_bg_hide":"default_bg_show")))))}export default factory(EditArtComponent);