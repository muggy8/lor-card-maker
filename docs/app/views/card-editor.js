import e,{div as t,button as a,strong as r,section as o}from"/Utils/elements.js";import n from"/Utils/load-css.js";import s from"/Utils/use-lang.js";import l,{useState as d,useCallback as i,useContext as c,createContext as u,useRef as m,useLayoutEffect as p,useEffect as f}from"/cdn/react";import{Globals as g}from"/Views/index.js";import{getCard as b,saveCard as v,deleteCard as h}from"/Utils/service.js";import w from"/Utils/set-immediate-batch.js";import x from"/Components/card-config/edit-name.js";import N from"/Components/card-config/edit-number.js";import j from"/Components/card-config/edit-region.js";import C from"/Components/card-config/edit-rarity.js";import V from"/Components/card-config/edit-keywords.js";import W from"/Components/card-config/edit-effect.js";import y from"/Components/card-config/edit-speed.js";import _ from"/Components/card-config/edit-colored-text.js";import k from"/Components/card-config/edit-art.js";import U from"/Components/card-config/edit-shade.js";import B from"/Components/card-config/edit-icon.js";import A from"/Components/card-config/edit-checkbox.js";import R from"/Components/card-config/edit-associated-cards.js";import{defaultShade as I}from"/Views/list.js";import L from"/Utils/use-toggle.js";import O from"/Utils/debounce-function.js";import S from"/Components/export.js";import E from"/Components/card-config/edit-file-name.js";import D from"/Components/card-config/edit-color.js";const F=n("/Views/card-editor.css");function M(e,t){return Object.hasOwnProperty.call(t,e)}export const svgRefference=u({current:null,setRef:()=>{}});export default function T(n,u){const T=Object.keys(u);T.sort();const z=e((function(){const e=s(),F=c(g),z=m();z.current=F,f((()=>{const e=F.getAllowBack();return z.current.setAllowBack((()=>{if(document.documentElement.scrollTop>100){const e=!0===z.current.state.settings.lowSpecsMode;return w((()=>window.scroll({top:-document.documentElement.scrollTop,left:0,behavior:e?"instant":"smooth"}))),!1}return e()})),function(){z.current.setAllowBack(e)}}),[]);const[P,q]=d(u);f((()=>(F.state.cardId&&b(F.state.cardId).then(q),()=>{z.current.patchState({cardId:""})})),[]);let H={...P};const J=T.reduce(((e,t)=>(e[t]=i((e=>{if(e&&e.preventDefault&&(e=e.target.value),e===P[t])return;const a={...H};a[t]=e,H=a,q(a)}),T.map((e=>P[e]))),e)),{}),[$,G]=d(null),[K,Q,X]=L(!1),Y=i((()=>{K||(X(!0),S(P,$,F).then((()=>X(!1)),(e=>console.warn(e)+X(!1))))}),[$,K,F,P]),Z=m(),[ee,te]=d(0),[ae,re]=d(0);p((()=>{const e=O((function(){let e=Z.current.parentNode.clientWidth;const t=getComputedStyle(Z.current.parentNode);e=e-parseFloat(t.paddingLeft)-parseFloat(t.paddingRight),te(e),re(Z.current.offsetHeight)}),250);requestAnimationFrame(e);const t=new MutationObserver(e);return window.addEventListener("resize",e),t.observe(Z.current,{attributes:!0}),function(){window.removeEventListener("resize",e),t.disconnect()}}),[]);const[oe,ne,se]=L(!0),[le,de,ie]=L(!1);return f((()=>{se(!0)}),T.map((e=>P[e]))),o({id:"card-editor",className:"flex hcenter"},t({className:"card-preview gutter-t-2 box-xs-12 box-s-8 box-m-6",style:{paddingBottom:ae+"px"}},t({className:"preview-content",ref:Z,style:{width:ee+"px"}},t({className:"gutter-rl-2"},l.createElement(svgRefference.Provider,{value:{current:$,setRef:G}},n({...P,cardDataUpdaters:J,updateTransform:P.art&&F.state.moveableArt?J.transform:void 0,loading:K||le}))),t({className:"flex hcenter gutter-tb"},t({className:"gutter-rl-.5"},a({className:`gutter-trbl-.5 ${P.id?void 0:"hide"}`,onClick:()=>{confirm(e("confirm_delete"))&&h(P.id).then((()=>{document.location.reload()}))}},r(e("delete_card")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",onClick:()=>{if(!oe||le)return;function e(){se(!1),ie(!1)}if(ie(!0),P.id)return v(P.id,P).then(e,e);const t=Date.now().toString();v(t,P).then(e,e),J.id(t)},[oe||!ie?"data-foo":"disabled"]:!0},r(e("save_card")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",onClick:Y,[K?"disabled":"data-foo"]:!0},r(e("share"))))))),t({className:"card-configs gutter-tb-4 gutter-rl box-xs-12 box-s-8 box-m-6"},M("name",u)?t({className:"flex hcenter gutter-b-2"},x({label:e("name"),value:P.name,updateValue:J.name})):void 0,M("fileName",u)?t({className:"flex hcenter gutter-b-2"},E({label:e("file_name"),value:P.fileName,placeholder:P.name,updateValue:J.fileName})):void 0,M("icons",u)?t({className:"flex hcenter gutter-b-2"},B({value:P.icons,updateValue:J.icons})):void 0,M("largerIcon",u)?t({className:"gutter-b-2"},A({label:e("larger_icon"),value:P.largerIcon,updateValue:J.largerIcon})):void 0,M("mana",u)?t({className:"gutter-b-2"},N({label:e("mana_cost"),value:P.mana,updateValue:J.mana})):void 0,M("clan",u)?t({className:"gutter-b-2"},_({label:e("clan"),value:P.clan,updateValue:J.clan})):void 0,M("speed",u)?y({value:P.speed,updateValue:J.speed}):void 0,M("power",u)&&M("health",u)&&null!==P.power&&null!==P.health?t({className:"flex-l no-wrap"},N({className:"block gutter-b-2",label:e("power"),value:P.power,updateValue:J.power}),N({className:"block gutter-b-2",label:e("health"),value:P.health,updateValue:J.health})):void 0,M("faction",u)?j({value:P.faction,updateValue:J.faction}):void 0,M("art",u)?t({className:"gutter-b-2"},k({label:e("card_art"),value:P.art,updateValue:J.art})):void 0,M("shade",u)?U({label:e("card_art"),value:P.shade||I,updateValue:J.shade}):void 0,M("textBgColor",u)?t({className:"gutter-b-2"},D({label:e("text_background_color"),value:P.textBgColor,updateValue:J.textBgColor,cardArt:P.art})):void 0,M("rarity",u)?C({value:P.rarity,updateValue:J.rarity}):void 0,M("keywords",u)?V({value:P.keywords,updateValue:J.keywords}):void 0,M("effect",u)?W({value:P.effect,updateValue:J.effect,orangeWords:P.orangeWords,updateOrangeWords:J.orangeWords,blueWords:P.blueWords,updateBlueWords:J.blueWords,label:e("effect")}):void 0,M("lvup",u)?W({value:P.lvup,updateValue:J.lvup,orangeWords:P.orangeWords,updateOrangeWords:J.orangeWords,blueWords:P.blueWords,updateBlueWords:J.blueWords,label:e("lv_up")}):void 0,M("blueWords",u)?_({label:e("other_card_mentioned"),subLabel:e("other_card_example"),value:P.blueWords,updateValue:J.blueWords}):void 0,M("orangeWords",u)?_({label:e("key_text_mentioned"),subLabel:e("key_text_example"),value:P.orangeWords,updateValue:J.orangeWords}):void 0,M("associatedCards",u)?t({className:"gutter-b-2"},R({label:e("associated_cards"),value:P.associatedCards,updateValue:J.associatedCards})):void 0))}),F);return z.defaultCardData=u,z}export async function openUri(e,t="export.png"){const a=/data:([^;]+);(([^;]+);)*base64,/.exec(e),[r,o]=a,n=dataURItoBlob(e),s=new File([n],t,{type:n.type});if("share"in navigator&&"canShare"in navigator&&navigator.canShare({files:[s]}))navigator.share({files:[s]}).catch((e=>{if("AbortError"===e.name||"share canceled"===e.message.toLowerCase())return;const t=URL.createObjectURL(n);window.open(t,"_blank")}));else if(window.AndroidNativeInterface){const a=JSON.stringify({image:e.substr(r.length),fileName:t});window.AndroidNativeInterface.postMessage(a)}else{const e=URL.createObjectURL(n);window.open(e,"_blank")}}export function dataURItoBlob(e){for(var t=atob(e.split(",")[1]),a=e.split(",")[0].split(":")[1].split(";")[0],r=new ArrayBuffer(t.length),o=new Uint8Array(r),n=0;n<t.length;n++)o[n]=t.charCodeAt(n);return new Blob([r],{type:a})}