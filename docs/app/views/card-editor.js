import e,{div as t,button as a,strong as r,section as o}from"/Utils/elements.js";import s from"/Utils/load-css.js";import n from"/Utils/use-lang.js";import l,{useState as d,useCallback as c,useContext as i,createContext as u,useRef as m,useLayoutEffect as p,useEffect as f}from"/cdn/react";import{Globals as g}from"/Views/index.js";import{getCard as b,saveCard as v,deleteCard as h}from"/Utils/service.js";import w from"/Utils/set-immediate-batch.js";import x from"/Components/card-config/edit-name.js";import N from"/Components/card-config/edit-number.js";import j from"/Components/card-config/edit-region.js";import W from"/Components/card-config/edit-rarity.js";import C from"/Components/card-config/edit-keywords.js";import V from"/Components/card-config/edit-effect.js";import y from"/Components/card-config/edit-speed.js";import k from"/Components/card-config/edit-colored-text.js";import _ from"/Components/card-config/edit-art.js";import U from"/Components/card-config/edit-shade.js";import L from"/Components/card-config/edit-icon.js";import O from"/Components/card-config/edit-checkbox.js";import R from"/Components/card-config/edit-associated-cards.js";import{defaultShade as A}from"/Views/list.js";import I from"/Utils/use-toggle.js";import S from"/Utils/debounce-function.js";import B from"/Components/export.js";const E=s("/Views/card-editor.css");function F(e,t){return Object.hasOwnProperty.call(t,e)}export const svgRefference=u({current:null,setRef:()=>{}});export default function D(s,u){const D=Object.keys(u);D.sort();return e((function(){const e=n(),E=i(g),M=m();M.current=E,f((()=>{const e=E.getAllowBack();return M.current.setAllowBack((()=>{if(document.documentElement.scrollTop>100){const e=!0===M.current.state.settings.lowSpecsMode;return w((()=>window.scroll({top:-document.documentElement.scrollTop,left:0,behavior:e?"instant":"smooth"}))),!1}return e()})),function(){M.current.setAllowBack(e)}}),[]);const[T,z]=d(u);f((()=>(E.state.cardId&&b(E.state.cardId).then(z),()=>{M.current.patchState({cardId:""})})),[]);let P={...T};const q=D.reduce(((e,t)=>(e[t]=c((e=>{if(e&&e.preventDefault&&(e=e.target.value),e===T[t])return;const a={...P};a[t]=e,P=a,z(a)}),D.map((e=>T[e]))),e)),{}),[H,J]=d(null),[$,G,K]=I(!1),Q=c((()=>{$||(K(!0),B(T,H,E).then((()=>K(!1)),(e=>console.warn(e)+K(!1))))}),[H,$,E,T]),X=m(),[Y,Z]=d(0),[ee,te]=d(0);p((()=>{const e=S((function(){let e=X.current.parentNode.clientWidth;const t=getComputedStyle(X.current.parentNode);e=e-parseFloat(t.paddingLeft)-parseFloat(t.paddingRight),Z(e),te(X.current.offsetHeight)}),250);requestAnimationFrame(e);const t=new MutationObserver(e);return window.addEventListener("resize",e),t.observe(X.current,{attributes:!0}),function(){window.removeEventListener("resize",e),t.disconnect()}}),[]);const[ae,re,oe]=I(!0),[se,ne,le]=I(!1);return f((()=>{oe(!0)}),D.map((e=>T[e]))),o({id:"card-editor",className:"flex hcenter"},t({className:"card-preview gutter-t-2 box-xs-12 box-s-8 box-m-6",style:{paddingBottom:ee+"px"}},t({className:"preview-content",ref:X,style:{width:Y+"px"}},t({className:"gutter-rl-2"},l.createElement(svgRefference.Provider,{value:{current:H,setRef:J}},s({...T,cardDataUpdaters:q,updateTransform:T.art&&E.state.moveableArt?q.transform:void 0,loading:$||se}))),t({className:"flex hcenter gutter-tb"},t({className:"gutter-rl-.5"},a({className:`gutter-trbl-.5 ${T.id?void 0:"hide"}`,onClick:()=>{h(T.id).then((()=>{document.location.reload()}))}},r(e("delete_card")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",onClick:()=>{if(!ae||se)return;function e(){oe(!1),le(!1)}if(le(!0),T.id)return v(T.id,T).then(e,e);const t=Date.now().toString();v(t,T).then(e,e),q.id(t)},[ae||!le?"data-foo":"disabled"]:!0},r(e("save_card")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",onClick:Q,[$?"disabled":"data-foo"]:!0},r(e("share"))))))),t({className:"card-configs gutter-tb-4 gutter-rl box-xs-12 box-s-8 box-m-6"},F("name",u)?t({className:"flex hcenter gutter-b-2"},x({label:e("name"),value:T.name,updateValue:q.name})):void 0,F("icons",u)?t({className:"flex hcenter gutter-b-2"},L({value:T.icons,updateValue:q.icons})):void 0,F("largerIcon",u)?t({className:"gutter-b-2"},O({label:e("larger_icon"),value:T.largerIcon,updateValue:q.largerIcon})):void 0,F("mana",u)?t({className:"gutter-b-2"},N({label:e("mana_cost"),value:T.mana,updateValue:q.mana})):void 0,F("clan",u)?t({className:"gutter-b-2"},k({label:e("clan"),value:T.clan,updateValue:q.clan})):void 0,F("speed",u)?y({value:T.speed,updateValue:q.speed}):void 0,F("power",u)&&F("health",u)&&null!==T.power&&null!==T.health?t({className:"flex-l no-wrap"},N({className:"block gutter-b-2",label:e("power"),value:T.power,updateValue:q.power}),N({className:"block gutter-b-2",label:e("health"),value:T.health,updateValue:q.health})):void 0,F("faction",u)?j({value:T.faction,updateValue:q.faction}):void 0,F("art",u)?t({className:"gutter-b-2"},_({label:e("card_art"),value:T.art,updateValue:q.art})):void 0,F("shade",u)?U({label:e("card_art"),value:T.shade||A,updateValue:q.shade}):void 0,F("rarity",u)?W({value:T.rarity,updateValue:q.rarity}):void 0,F("keywords",u)?C({value:T.keywords,updateValue:q.keywords}):void 0,F("effect",u)?V({value:T.effect,updateValue:q.effect,orangeWords:T.orangeWords,updateOrangeWords:q.orangeWords,blueWords:T.blueWords,updateBlueWords:q.blueWords,label:e("effect")}):void 0,F("lvup",u)?V({value:T.lvup,updateValue:q.lvup,orangeWords:T.orangeWords,updateOrangeWords:q.orangeWords,blueWords:T.blueWords,updateBlueWords:q.blueWords,label:e("lv_up")}):void 0,F("blueWords",u)?k({label:e("other_card_mentioned"),subLabel:e("other_card_example"),value:T.blueWords,updateValue:q.blueWords}):void 0,F("orangeWords",u)?k({label:e("key_text_mentioned"),subLabel:e("key_text_example"),value:T.orangeWords,updateValue:q.orangeWords}):void 0,F("associatedCards",u)?t({className:"gutter-b-2"},R({label:e("associated_cards"),value:T.associatedCards,updateValue:q.associatedCards})):void 0))}),E)}export async function openUri(e,t="export.png"){const a=/data:([^;]+);(([^;]+);)*base64,/.exec(e),[r,o]=a,s=await fetch(e).then((e=>e.blob())),n=new File([s],t,{type:s.type});if("share"in navigator&&"canShare"in navigator&&navigator.canShare({files:[n]}))navigator.share({files:[n]}).catch((e=>{if("AbortError"===e.name||"share canceled"===e.message.toLowerCase())return;const t=URL.createObjectURL(s);window.open(t,"_blank")}));else if(window.AndroidNativeInterface){const a=JSON.stringify({image:e.substr(r.length),fileName:t});window.AndroidNativeInterface.postMessage(a)}else{const e=URL.createObjectURL(s);window.open(e,"_blank")}}