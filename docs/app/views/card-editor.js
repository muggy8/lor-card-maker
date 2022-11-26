import e,{div as t,button as a,strong as r,section as o}from"/Utils/elements.js";import n from"/Utils/load-css.js";import s from"/Utils/use-lang.js";import l,{useState as i,useCallback as c,useContext as d,createContext as u,useRef as m,useLayoutEffect as p,useEffect as f}from"/cdn/react";import g from"/cdn/save-svg-as-png";import{Globals as b}from"/Views/index.js";import{getCard as v,saveCard as h,deleteCard as w}from"/Utils/service.js";import x from"/Utils/set-immediate-batch.js";import j from"/Components/card-config/edit-name.js";import N from"/Components/card-config/edit-number.js";import V from"/Components/card-config/edit-region.js";import y from"/Components/card-config/edit-rarity.js";import C from"/Components/card-config/edit-keywords.js";import U from"/Components/card-config/edit-effect.js";import k from"/Components/card-config/edit-speed.js";import W from"/Components/card-config/edit-colored-text.js";import _ from"/Components/card-config/edit-art.js";import L from"/Components/card-config/edit-shade.js";import A from"/Components/card-config/edit-icon.js";import{defaultShade as R}from"/Views/list.js";import O from"/Utils/use-toggle.js";import B from"/Utils/debounce-function.js";const E=n("/Views/card-editor.css");function S(e,t){return Object.hasOwnProperty.call(t,e)}export const svgRefference=u({current:null,setRef:()=>{}});export default function F(n,u){const F=Object.keys(u);F.sort();return e((function(){const e=s(),E=d(b),D=m();D.current=E,f((()=>{const e=E.allowBack;return D.current.setAllowBack((()=>document.documentElement.scrollTop?(x((()=>window.scrollTo(0,0))),!1):e())),function(){D.current.setAllowBack(e)}}),[]);const[I,P]=i(u);f((()=>(E.state.cardId&&v(E.state.cardId).then(P),()=>{D.current.patchState({cardId:""})})),[]);let T={...I};const $=F.reduce(((e,t)=>(e[t]=c((e=>{if(e&&e.preventDefault&&(e=e.target.value),e===I[t])return;const a={...T};a[t]=e,T=a,P(a)}),F.map((e=>I[e]))),e)),{}),[z,q]=i(null),[H,M,G]=O(!1),J=c((()=>{H||(G(!0),g.svgAsPngUri(z,{excludeUnusedCss:!0,width:z.width.baseVal.value,height:z.height.baseVal.value}).then((e=>{openUri(e,`${(I.name||"export").toUpperCase()}.png`),G(!1)}),(()=>G(!1))))}),[z,H]),K=m(),[Q,X]=i(0),[Y,Z]=i(0);p((()=>{const e=B((function(){let e=K.current.parentNode.clientWidth;const t=getComputedStyle(K.current.parentNode);e=e-parseFloat(t.paddingLeft)-parseFloat(t.paddingRight),X(e),Z(K.current.offsetHeight)}),250);requestAnimationFrame(e);const t=new MutationObserver(e);return window.addEventListener("resize",e),t.observe(K.current,{attributes:!0}),function(){window.removeEventListener("resize",e),t.disconnect()}}),[]);const[ee,te,ae]=O(!!I.id),[re,oe,ne]=O(!1);return f((()=>{ae(!0)}),F.map((e=>I[e]))),o({id:"card-editor",className:"flex hcenter"},t({className:"card-preview gutter-t-2 box-xs-12 box-s-8 box-m-6 box-l-5 box-xl-4",style:{paddingBottom:Y+"px"}},t({className:"preview-content",ref:K,style:{width:Q+"px"}},t({className:"gutter-rl-2"},l.createElement(svgRefference.Provider,{value:{current:z,setRef:q}},n({...I,cardDataUpdaters:$,updateTransform:I.art&&E.state.moveableArt?$.transform:void 0,loading:H||re}))),t({className:"flex hcenter gutter-tb"},t({className:"gutter-rl-.5"},a({className:`gutter-trbl-.5 ${I.id?void 0:"hide"}`,onClick:()=>{w(I.id).then((()=>{document.location.reload()}))}},r(e("delete_card")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",onClick:()=>{if(!ee||re)return;function e(){ae(!1),ne(!1)}if(ne(!0),I.id)return h(I.id,I).then(e,e);const t=Date.now().toString();h(t,I).then(e,e),$.id(t)},[ee||!ne?"data-foo":"disabled"]:!0},r(e("save_card")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",onClick:J,[H?"disabled":"data-foo"]:!0},r(e("export"))))))),t({className:"card-configs gutter-tb-4 gutter-rl box-xs-12 box-s-8 box-m-6 box-l-5 box-xl-4"},S("name",u)?t({className:"flex hcenter gutter-b-2"},j({label:e("name"),value:I.name,updateValue:$.name})):void 0,S("icons",u)?t({className:"flex hcenter gutter-b-2"},A({value:I.icons,updateValue:$.icons})):void 0,S("mana",u)?t({className:"gutter-b-2"},N({label:e("mana_cost"),value:I.mana,updateValue:$.mana})):void 0,S("speed",u)?k({value:I.speed,updateValue:$.speed}):void 0,S("power",u)&&S("health",u)&&null!==I.power&&null!==I.health?t({className:"flex-l no-wrap"},N({className:"block gutter-b-2",label:e("power"),value:I.power,updateValue:$.power}),N({className:"block gutter-b-2",label:e("health"),value:I.health,updateValue:$.health})):void 0,S("faction",u)?V({value:I.faction,updateValue:$.faction}):void 0,S("art",u)?t({className:"gutter-b-2"},_({value:I.art,updateValue:$.art})):void 0,S("shade",u)?t({className:"gutter-b-2"},L({label:e("card_art"),value:I.shade||R,updateValue:$.shade})):void 0,S("rarity",u)?y({value:I.rarity,updateValue:$.rarity}):void 0,S("keywords",u)?C({value:I.keywords,updateValue:$.keywords}):void 0,S("effect",u)?U({value:I.effect,updateValue:$.effect,orangeWords:I.orangeWords,updateOrangeWords:$.orangeWords,label:e("effect")}):void 0,S("lvup",u)?U({value:I.lvup,updateValue:$.lvup,orangeWords:I.orangeWords,updateOrangeWords:$.orangeWords,label:e("lv_up")}):void 0,S("blueWords",u)?W({label:e("other_card_mentioned"),subLabel:e("other_card_example"),value:I.blueWords,updateValue:$.blueWords}):void 0,S("orangeWords",u)?W({label:e("key_text_mentioned"),subLabel:e("key_text_example"),value:I.orangeWords,updateValue:$.orangeWords}):void 0,S("clan",u)?t({className:"gutter-b-2"},j({label:e("clan"),value:I.clan,updateValue:$.clan})):void 0))}),E)}export function openUri(e,t="export.png"){const a=/data:([^;]+);base64,/.exec(e)[1],r=atob(e.substr(`data:${a};base64,`.length)),o=[];for(let e=0;e<r.length;e+=1024){const t=r.slice(e,e+1024),a=new Array(t.length);for(let e=0;e<t.length;e++)a[e]=t.charCodeAt(e);const n=new Uint8Array(a);o.push(n)}const n=new Blob(o,{type:a}),s=new File([n],t,{type:n.type});if("share"in navigator&&"canShare"in navigator&&navigator.canShare({files:[s]}))navigator.share({files:[s]}).catch((e=>{if("AbortError"===e.name||"share canceled"===e.message.toLowerCase())return;const t=URL.createObjectURL(n);window.open(t,"_blank")}));else{const e=URL.createObjectURL(n);window.open(e,"_blank")}}