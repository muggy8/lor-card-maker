import e,{div as t,strong as r,button as a,nav as s,section as o,label as c}from"/Utils/elements.js";import{useState as l,useCallback as n,useRef as i,useEffect as d,useContext as u,useLayoutEffect as m,createElement as p}from"/cdn/react";import{getRitoCards as f,patchRitoCards as g,getLatestRitoData as h,getCardList as w,getCard as b,saveCard as C,deleteCard as k}from"/Utils/service.js";import{isMobile as N}from"/cdn/react-device-detect";import y from"/Utils/load-css.js";import v from"/Utils/use-lang.js";import x from"/Utils/use-filter.js";import L from"/Components/list-limit.js";import _ from"/Components/deck/card-name.js";import j from"/Components/deck/rito-cards-filters-ui.js";import O from"/Components/deck/deck-view.js";import E from"/Utils/use-asset-cache.js";import S from"/Components/deck/custom-cards-filters-ui.js";import U from"/Utils/debounce-function.js";import A from"/cdn/save-svg-as-png";import{svgRefference as F}from"/Views/card-editor.js";import{openUri as V}from"/Views/card-editor.js";import{Globals as z}from"/Views/index.js";import D from"/Components/card-config/edit-name.js";import R from"/Components/card-config/edit-art.js";import{ExternalCustomCard as P,isExternalImage as I}from"/Components/deck/deck-card.js";import B from"/Components/card-config/edit-checkbox.js";const M=y("/Views/deck-builder.css");function H({sets:e}){if(!e)return;const t=e.map((e=>e.data)).flat();return t.sort(((e,t)=>{if("champion"===e.supertype.toLowerCase()&&"champion"!==t.supertype.toLowerCase())return-1;if("champion"!==e.supertype.toLowerCase()&&"champion"===t.supertype.toLowerCase())return 1;const r=e.cost-t.cost;if(r)return r;const a=t.collectible-e.collectible;if(a)return a;const s=e.name.localeCompare(t.name);return s||0})),t}function T(e){const t=e.reduce(((e,t)=>t?(Object.keys(t).forEach((r=>{e[r]=e[r]||new Map;const a=t[r];Array.isArray(a)?a.forEach((t=>{e[r].set(t,!0)})):e[r].set(a,!0)})),e):e),{});return Object.keys(t).forEach((e=>{const r=t[e];t[e]=[],r.forEach(((r,a)=>{t[e].push(a)}))})),t}const q={id:void 0,cards:[],type:"deck",name:""};export default e((function(){const e=v(),c=u(z),N=i();N.current=c;const[y,M]=l(q),W=y.cards;let $={};const G=n((e=>{$={...$,...e},M({...y,...$})}),[y]),J=n((e=>{G({name:e})}),[G]),K=E((e=>{const t=[...W];t.sort(((e,t)=>{const r=(Object.prototype.hasOwnProperty.call(e.card,"mana")?e.card.mana:e.card.cost)||1/0,a=(Object.prototype.hasOwnProperty.call(t.card,"mana")?t.card.mana:t.card.cost)||1/0,s=(e.card.name||"").toLowerCase(),o=(t.card.name||"").toLowerCase();return r-a||s.localeCompare(o)})),e(t)}),[W],[]);d((()=>{const e=c.getAllowBack();return N.current.setAllowBack((function(){return document.documentElement.scrollTop>100?(setImmediate((()=>window.scroll({top:-document.documentElement.scrollTop,left:0,behavior:"smooth"}))),!1):e()})),function(){N.current.setAllowBack(e)}}),[]),d((()=>(c.state.cardId&&b(c.state.cardId).then((e=>{M(e),e.cards.forEach((e=>{const t=e.card.id||e.card.cardCode;be.current.set(t,e)}))})),()=>{N.current.patchState({cardId:""})})),[c.state.cardId]);const[Q,X]=l("rito"),Y=i(),Z=E((e=>{const t=()=>e(Y.current.offsetHeight);return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)}),[]),ee=E((e=>{w({exclude:["deck"]}).then(e)}),[]),[te,re,ae,se]=x({name:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},effect:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},lvup:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},clan:{filter:(e,t)=>!e||Array.prototype.some.call(t,(t=>t.toLowerCase().includes(e.toLowerCase())))},keywords:{filter:(e,t)=>!e||!e.length||t.some((t=>e.includes(t)||e.some((e=>"string"!=typeof e&&"string"!=typeof t&&e.id===t.id))))},rarity:{filter:(e,t)=>!e||!e.length||e.includes(t)},type:{filter:(e,t)=>!e||!e.length||e.includes(t)},faction:{filter:(e,t)=>!e||!e.length||e.some((e=>t.includes(e)))},speed:{filter:(e,t)=>!e||!e.length||e.includes(t)},mana:{filter:(e,t)=>{if(!e||!e.length)return!0;const[r,a]=e;return t<=a&&t>=r}},power:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[a,s]=e;return t<=s&&t>=a}},health:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[a,s]=e;return t<=s&&t>=a}}});d((()=>{if(!ee||!ee.length)return re([]);re(ee)}),[ee]);const oe=n(((e,t)=>{const r={};r[e]=t,se(r)}),[se]),ce=E((e=>{if(!(ee&&ee.length&&te&&te.length))return;const t=T(ee);t.health=t.health.filter((e=>null!=e)),t.power=t.power.filter((e=>null!=e)),t.mana=t.mana.filter((e=>null!=e));const r=t.type;t.type=t.type.filter((e=>!e.toLowerCase().includes("champion"))),r.length!==t.type.length&&t.type.push("champion");const a=T(te),s=[];a.keywords=a.keywords.filter((e=>{const t=e.id||e;return!s.includes(t)&&(s.push(t),!0)}));e({...t,keywords:a.keywords})}),[ee,te],{}),[le,ne]=l();d((()=>{f().then((e=>{ne(H(e))}))}),[]);const[ie,de]=l(!1),ue=n((()=>{de(!0),h().then((async e=>{await g(e),ne(H(e)),de(!1)}))}),[]),[me,pe,fe,ge]=x({collectible:{value:!0,filter:(e,t)=>t===e},name:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},descriptionRaw:{filter:(e,t,r)=>!e||(t.toLowerCase().includes(e.toLowerCase())||r.levelupDescriptionRaw.toLowerCase().includes(e.toLowerCase())||r.description.toLowerCase().includes(e.toLowerCase())||r.levelupDescription.toLowerCase().includes(e.toLowerCase()))},subtypes:{filter:(e,t)=>!e||Array.prototype.some.call(t,(t=>t.toLowerCase().includes(e.toLowerCase())))},type:{filter:(e,t)=>!e||!e.length||e.includes(t)},set:{filter:(e,t)=>!e||!e.length||e.includes(t)},keywords:{filter:(e,t)=>!e||!e.length||t.some((t=>e.includes(t)))},rarity:{filter:(e,t)=>!e||!e.length||e.includes(t)},regionRefs:{filter:(e,t)=>!e||!e.length||e.some((e=>t.includes(e)))},spellSpeed:{filter:(e,t)=>!e||!e.length||e.includes(t)},cost:{filter:(e,t)=>{if(!e||!e.length)return!0;const[r,a]=e;return t<=a&&t>=r}},attack:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[a,s]=e;return t<=s&&t>=a}},health:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[a,s]=e;return t<=s&&t>=a}}});d((()=>{if(!le||!le.length)return pe([]);pe(le)}),[le]);const he=n(((e,t)=>{const r={};r[e]=t,ge(r)}),[ge]),we=E((e=>{if(!(le&&le.length&&me&&me.length))return;const t=T(le);t.set.sort(((e,t)=>e.localeCompare(t)));const r=T(me);e({...t,keywords:r.keywords})}),[le,me],{}),be=i(new Map),Ce=n((()=>{const e=[];be.current.forEach((t=>e.push(t))),e.sort(((e,t)=>{const r=(Object.prototype.hasOwnProperty.call(e.card,"mana")?e.card.mana:e.card.cost)||1/0,a=(Object.prototype.hasOwnProperty.call(t.card,"mana")?t.card.mana:t.card.cost)||1/0,s=(e.card.name||"").toLowerCase(),o=(t.card.name||"").toLowerCase();return t.count-e.count||r-a||s.localeCompare(o)})),G({cards:e})}),[G]),ke=n((e=>{const t=e.id||e.cardCode||e.url;let r=be.current.get(t);r||(r={count:0,card:e},be.current.set(t,r)),r.count++,Ce()}),[Ce]),Ne=n((e=>{const t=e.id||e.cardCode||e.url;let r=be.current.get(t);r&&(r.count&&r.count--,r.count<1&&be.current.delete(t),Ce())}),[Ce]),ye=i(),[ve,xe]=l(0),[Le,_e]=l(0),[je,Oe]=l(!0);m((()=>{const e=U((function(){let e=ye.current.parentNode.clientWidth;const t=getComputedStyle(ye.current.parentNode);e=e-parseFloat(t.paddingLeft)-parseFloat(t.paddingRight),xe(e),_e(ye.current.offsetHeight)}),250);requestAnimationFrame(e);const t=new MutationObserver(e);return window.addEventListener("resize",e),t.observe(ye.current,{childList:!0,subtree:!0,attributes:["style"]}),function(){window.removeEventListener("resize",e),t.disconnect()}}),[]);const[Ee,Se]=l(null),[Ue,Ae]=l(!1),Fe=n((()=>{Ue||(Ae(!0),A.svgAsPngUri(Ee,{excludeUnusedCss:!0,width:Ee.width.baseVal.value,height:Ee.height.baseVal.value}).then((e=>{V(e,`${(y.name||"export").toUpperCase()}.png`),Ae(!1)}),(()=>Ae(!1))))}),[Ee,Ue]),[Ve,ze]=l(!y.id),[De,Re]=l(!1);d((()=>{ze(!0)}),Object.keys(y).map((e=>y[e])));const Pe=n((()=>{if(!Ve||De)return;function e(){ze(!1),Re(!1)}if(Re(!0),y.id)return C(y.id,y).then(e,e);const t=Date.now().toString();C(t,y).then(e,e),G({id:t})}),[!Ve||De,y,G]);return o({id:"deck-builder",className:"flex hcenter gutter-t-2"},t({className:"deck-preview box-xs-12 box-s-10 box-m-6",style:{paddingBottom:Le+"px"}},t({className:"preview-content gutter-rl-2",ref:ye,style:{width:ve+"px"}},t({className:"flex vhcenter",ref:Y},t({className:"gutter-rl"},e("deck_size"),": ",W.reduce(((e,t)=>e+t.count),0))),p(F.Provider,{value:{current:Ee,setRef:Se}},t({className:"preview-height-limit flex vhcenter",style:{"--simple-stats-height":Z+"px"}},O({cards:W,loading:Ue,cardStats:je}))),t({className:"flex vhcenter gutter-b"},t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5 "+(y.id?"":"hide"),onClick:()=>{k(y.id).then((()=>{document.location.reload()}))}},r(e("delete_deck")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",[Ve||!Re?"data-foo":"disabled"]:!0,onClick:Pe},r(e("save_deck")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",[Ue?"disabled":"data-foo"]:!0,onClick:Fe},r(e("share"))))))),t({className:"card-finder box-xs-12 box-s-10 box-m-6"},s({className:"flex no-wrap card-list-options gutter-t-.5"},t({className:("rito"===Q?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>X("rito")},e("official_cards")),t({className:("custom"===Q?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>X("custom")},e("custom_cards")),t({className:("inDeck"===Q?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>X("inDeck")},e("currently_selected_cards")),t({className:("about"===Q?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>X("about")},e("about_deck_builder"))),t({className:"tab-body"},"rito"===Q?t({className:"gutter-rl"},j({refreshRitoData:ue,refreshRitoLoading:ie,filterOptions:we,updateSelectedFilters:ge,updateSelectedFilter:he,selectedFilters:fe}),t({className:"card-name-list"},L({defaultSize:24},(me||[]).map((e=>e?t({className:"flex gutter-b",key:e.cardCode},_({card:e,className:"box-9"},e.name),t({className:"box-3 flex no-wrap"},a({className:"grow gutter-trbl-.5",onClick:()=>ke(e)},t({className:"icon plus"})),t({className:"gutter-rl-.25"}),a({className:"grow gutter-trbl-.5",onClick:()=>Ne(e)},t({className:"icon minus"})))):void 0))),le&&le.length?void 0:t({className:"flex"},a({onClick:ue,className:"gutter-trbl-.5 grow"},ie?t({className:"icon loading"}):e("load_rito_data"))))):void 0,"custom"===Q?t({className:"gutter-rl"},S({filterOptions:ce,updateSelectedFilters:se,updateSelectedFilter:oe,selectedFilters:ae}),t({className:"card-name-list"},L({defaultSize:24},(te||[]).map((e=>e?t({className:"flex gutter-b",key:e.id},_({card:e,className:"box-9"},e.name),t({className:"box-3 flex no-wrap"},a({className:"grow gutter-trbl-.5",onClick:()=>ke(e)},t({className:"icon plus"})),t({className:"gutter-rl-.25"}),a({className:"grow gutter-trbl-.5",onClick:()=>Ne(e)},t({className:"icon minus"})))):void 0))))):void 0,"inDeck"===Q?t({className:"gutter-rl"},t({className:"card-name-list gutter-t"},t({className:"current-deck-input-fields gutter-rl-.5 gutter-b-1"},D({label:e("deck_name"),value:y.name,updateValue:J})),t({className:"current-deck-input-fields gutter-rl-.5 gutter-b-1"},R({label:e("other_custom_card"),moveable:!1,updateValue:e=>{ke({url:e})}})),t({className:"current-deck-input-fields gutter-rl-.5 gutter-b-1"},B({label:e("show_deck_stats"),value:je,updateValue:Oe})),(K||[]).map((e=>e?t({className:"flex gutter-b",key:e.card.id||e.card.cardCode||e.card.url},I(e.card)?t({className:"box-9 gutter-rl"},P(e.card)):_({card:e.card,className:"box-9"},e.card.name),t({className:"box-3 flex no-wrap "+(I(e.card)?"vcenter":"")},a({className:"grow gutter-trbl-.5",onClick:()=>ke(e.card)},t({className:"icon plus"})),t({className:"gutter-rl-.25"}),a({className:"grow gutter-trbl-.5",onClick:()=>Ne(e.card)},t({className:"icon minus"})))):void 0)))):void 0,"about"===Q?t({className:"gutter-rl"},t({className:"about-deck-uilder gutter-t"},t({className:"about-info"},e("about_deck_builder_1",!0)),t({className:"about-info"},e("about_deck_builder_2",!0)),t({className:"about-info"},e("about_deck_builder_3",!0)),t({className:"about-info"},e("about_deck_builder_4",!0)),t({className:"about-info"},e("about_deck_builder_5",!0)))):void 0)))}),M);