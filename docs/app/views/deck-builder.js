import e,{div as t,strong as r,button as s,nav as a,section as o,label as c}from"/Utils/elements.js";import{useState as l,useCallback as n,useRef as i,useEffect as d,useContext as u,useLayoutEffect as m,createElement as p}from"/cdn/react";import{getRitoCards as f,patchRitoCards as h,getLatestRitoData as g,getCardList as w,getCard as b,saveCard as k,deleteCard as C}from"/Utils/service.js";import{isMobile as N}from"/cdn/react-device-detect";import y from"/Utils/load-css.js";import v from"/Utils/use-lang.js";import x from"/Utils/use-filter.js";import L from"/Components/list-limit.js";import _ from"/Components/deck/card-name.js";import j from"/Components/deck/rito-cards-filters-ui.js";import S from"/Components/deck/deck-view.js";import O from"/Utils/use-asset-cache.js";import D from"/Components/deck/custom-cards-filters-ui.js";import E from"/Utils/debounce-function.js";import F from"/cdn/save-svg-as-png";import{svgRefference as A}from"/Views/card-editor.js";import{Globals as z}from"/Views/index.js";import R from"/Components/card-config/edit-name.js";import U from"/Components/card-config/edit-art.js";import{ExternalCustomCard as V,isExternalImage as I}from"/Components/deck/deck-card.js";import P from"/Components/export.js";import B from"/Components/card-config/edit-checkbox.js";const M=y("/Views/deck-builder.css");function H({sets:e}){if(!e)return;const t=e.map((e=>e.data)).flat();return t.sort(((e,t)=>{if("champion"===e.supertype.toLowerCase()&&"champion"!==t.supertype.toLowerCase())return-1;if("champion"!==e.supertype.toLowerCase()&&"champion"===t.supertype.toLowerCase())return 1;const r=e.cost-t.cost;if(r)return r;const s=t.collectible-e.collectible;if(s)return s;const a=e.name.localeCompare(t.name);return a||0})),t}function T(e){const t=e.reduce(((e,t)=>t?(Object.keys(t).forEach((r=>{e[r]=e[r]||new Map;const s=t[r];Array.isArray(s)?s.forEach((t=>{e[r].set(t,!0)})):e[r].set(s,!0)})),e):e),{});return Object.keys(t).forEach((e=>{const r=t[e];t[e]=[],r.forEach(((r,s)=>{t[e].push(s)}))})),t}const q={id:void 0,cards:[],type:"deck",name:"",showDeckStats:!0};export default e((function(){const e=v(),c=u(z),N=i();N.current=c;const[y,F]=l(q),M=y.cards;let W={};const G=n((e=>{W={...W,...e},F({...y,...W})}),[y]),J=n((e=>{G({name:e})}),[G]),K=n((()=>{G({showDeckStats:!y.showDeckStats})}),[G,y.showDeckStats]),Q=O((e=>{const t=[...M];t.sort(((e,t)=>{const r=(Object.prototype.hasOwnProperty.call(e.card,"mana")?e.card.mana:e.card.cost)||1/0,s=(Object.prototype.hasOwnProperty.call(t.card,"mana")?t.card.mana:t.card.cost)||1/0,a=(e.card.name||"").toLowerCase(),o=(t.card.name||"").toLowerCase();return r-s||a.localeCompare(o)})),e(t)}),[M],[]);d((()=>{const e=c.getAllowBack();return N.current.setAllowBack((function(){return document.documentElement.scrollTop>100?(setImmediate((()=>window.scroll({top:-document.documentElement.scrollTop,left:0,behavior:"smooth"}))),!1):e()})),function(){N.current.setAllowBack(e)}}),[]),d((()=>(c.state.cardId&&b(c.state.cardId).then((e=>{F({...q,...e}),e.cards.forEach((e=>{const t=e.card.id||e.card.cardCode;be.current.set(t,e)}))})),()=>{N.current.patchState({cardId:""})})),[c.state.cardId]);const[X,Y]=l("rito"),Z=i(),$=O((e=>{const t=()=>e(Z.current.offsetHeight);return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)}),[]),ee=O((e=>{w({exclude:["deck"]}).then(e)}),[]),[te,re,se,ae]=x({name:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},effect:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},lvup:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},clan:{filter:(e,t)=>!e||Array.prototype.some.call(t,(t=>t.toLowerCase().includes(e.toLowerCase())))},keywords:{filter:(e,t)=>!e||!e.length||t.some((t=>e.includes(t)||e.some((e=>"string"!=typeof e&&"string"!=typeof t&&e.id===t.id))))},rarity:{filter:(e,t)=>!e||!e.length||e.includes(t)},type:{filter:(e,t)=>!e||!e.length||e.includes(t)},faction:{filter:(e,t)=>!e||!e.length||e.some((e=>t.includes(e)))},speed:{filter:(e,t)=>!e||!e.length||e.includes(t)},mana:{filter:(e,t)=>{if(!e||!e.length)return!0;const[r,s]=e;return t<=s&&t>=r}},power:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[s,a]=e;return t<=a&&t>=s}},health:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[s,a]=e;return t<=a&&t>=s}}});d((()=>{if(!ee||!ee.length)return re([]);re(ee)}),[ee]);const oe=n(((e,t)=>{const r={};r[e]=t,ae(r)}),[ae]),ce=O((e=>{if(!(ee&&ee.length&&te&&te.length))return;const t=T(ee);t.health&&(t.health=t.health.filter((e=>null!=e))),t.power&&(t.power=t.power.filter((e=>null!=e))),t.mana&&(t.mana=t.mana.filter((e=>null!=e)));const r=t.type;r&&(t.type=t.type.filter((e=>!e.toLowerCase().includes("champion"))),r.length!==t.type.length&&t.type.push("champion"));const s=T(te),a=[];s.keywords&&(s.keywords=s.keywords.filter((e=>{const t=e.id||e;return!a.includes(t)&&(a.push(t),!0)})));e({...t,keywords:s.keywords})}),[ee,te],{}),[le,ne]=l();d((()=>{f().then((e=>{ne(H(e))}))}),[]);const[ie,de]=l(!1),ue=n((()=>{de(!0),g().then((async e=>{await h(e),ne(H(e)),de(!1)}))}),[]),[me,pe,fe,he]=x({collectible:{value:!0,filter:(e,t)=>t===e},name:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},descriptionRaw:{filter:(e,t,r)=>!e||(t.toLowerCase().includes(e.toLowerCase())||r.levelupDescriptionRaw.toLowerCase().includes(e.toLowerCase())||r.description.toLowerCase().includes(e.toLowerCase())||r.levelupDescription.toLowerCase().includes(e.toLowerCase()))},subtypes:{filter:(e,t)=>!e||Array.prototype.some.call(t,(t=>t.toLowerCase().includes(e.toLowerCase())))},type:{filter:(e,t)=>!e||!e.length||e.includes(t)},set:{filter:(e,t)=>!e||!e.length||e.includes(t)},keywords:{filter:(e,t)=>!e||!e.length||t.some((t=>e.includes(t)))},rarity:{filter:(e,t)=>!e||!e.length||e.includes(t)},regionRefs:{filter:(e,t)=>!e||!e.length||e.some((e=>t.includes(e)))},spellSpeed:{filter:(e,t)=>!e||!e.length||e.includes(t)},cost:{filter:(e,t)=>{if(!e||!e.length)return!0;const[r,s]=e;return t<=s&&t>=r}},attack:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[s,a]=e;return t<=a&&t>=s}},health:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[s,a]=e;return t<=a&&t>=s}}});d((()=>{if(!le||!le.length)return pe([]);pe(le)}),[le]);const ge=n(((e,t)=>{const r={};r[e]=t,he(r)}),[he]),we=O((e=>{if(!(le&&le.length&&me&&me.length))return;const t=T(le);t.set.sort(((e,t)=>e.localeCompare(t)));const r=T(me);e({...t,keywords:r.keywords})}),[le,me],{}),be=i(new Map),ke=n((()=>{const e=[];be.current.forEach((t=>e.push(t))),e.sort(((e,t)=>{const r=(Object.prototype.hasOwnProperty.call(e.card,"mana")?e.card.mana:e.card.cost)||1/0,s=(Object.prototype.hasOwnProperty.call(t.card,"mana")?t.card.mana:t.card.cost)||1/0,a=(e.card.name||"").toLowerCase(),o=(t.card.name||"").toLowerCase();return t.count-e.count||r-s||a.localeCompare(o)})),G({cards:e})}),[G]),Ce=n((e=>{const t=e.id||e.cardCode||e.url;let r=be.current.get(t);r||(r={count:0,card:e},be.current.set(t,r)),r.count++,ke()}),[ke]),Ne=n((e=>{const t=e.id||e.cardCode||e.url;let r=be.current.get(t);r&&(r.count&&r.count--,r.count<1&&be.current.delete(t),ke())}),[ke]),ye=i(),[ve,xe]=l(0),[Le,_e]=l(0);m((()=>{const e=E((function(){let e=ye.current.parentNode.clientWidth;const t=getComputedStyle(ye.current.parentNode);e=e-parseFloat(t.paddingLeft)-parseFloat(t.paddingRight),xe(e),_e(ye.current.offsetHeight)}),250);requestAnimationFrame(e);const t=new MutationObserver(e);return window.addEventListener("resize",e),t.observe(ye.current,{childList:!0,subtree:!0,attributes:["style"]}),function(){window.removeEventListener("resize",e),t.disconnect()}}),[]);const[je,Se]=l(null),[Oe,De]=l(!1),Ee=n((()=>{Oe||(De(!0),P(y,je,c).then((()=>De(!1)),(e=>console.warn(e)+De(!1))))}),[je,Oe,y,c]),[Fe,Ae]=l(!y.id),[ze,Re]=l(!1);d((()=>{Ae(!0)}),Object.keys(y).map((e=>y[e])));const Ue=n((()=>{if(!Fe||ze)return;function e(){Ae(!1),Re(!1)}if(Re(!0),y.id)return k(y.id,y).then(e,e);const t=Date.now().toString();k(t,y).then(e,e),G({id:t})}),[!Fe||ze,y,G]);return o({id:"deck-builder",className:"flex hcenter gutter-t-2"},t({className:"deck-preview box-xs-12 box-s-10 box-m-6",style:{paddingBottom:Le+"px"}},t({className:"preview-content gutter-rl-2",ref:ye,style:{width:ve+"px"}},t({className:"flex vhcenter",ref:Z},t({className:"gutter-rl"},e("deck_size"),": ",M.reduce(((e,t)=>e+t.count),0))),p(A.Provider,{value:{current:je,setRef:Se}},t({className:"preview-height-limit flex vhcenter",style:{"--simple-stats-height":$+"px"}},S({cards:M,loading:Oe,cardStats:y.showDeckStats}))),t({className:"flex vhcenter gutter-b"},t({className:"gutter-rl-.5"},s({className:"gutter-trbl-.5 "+(y.id?"":"hide"),onClick:()=>{C(y.id).then((()=>{document.location.reload()}))}},r(e("delete_deck")))),t({className:"gutter-rl-.5"},s({className:"gutter-trbl-.5",[Fe||!Re?"data-foo":"disabled"]:!0,onClick:Ue},r(e("save_deck")))),t({className:"gutter-rl-.5"},s({className:"gutter-trbl-.5",[Oe?"disabled":"data-foo"]:!0,onClick:Ee},r(e("share"))))))),t({className:"card-finder box-xs-12 box-s-10 box-m-6"},a({className:"flex no-wrap card-list-options gutter-t-.5"},t({className:("rito"===X?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>Y("rito")},e("official_cards")),t({className:("custom"===X?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>Y("custom")},e("custom_cards")),t({className:("inDeck"===X?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>Y("inDeck")},e("currently_selected_cards")),t({className:("about"===X?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>Y("about")},e("about_deck_builder"))),t({className:"tab-body"},"rito"===X?t({className:"gutter-rl"},j({refreshRitoData:ue,refreshRitoLoading:ie,filterOptions:we,updateSelectedFilters:he,updateSelectedFilter:ge,selectedFilters:fe}),t({className:"card-name-list"},L({defaultSize:24},(me||[]).map((e=>e?t({className:"flex gutter-b",key:e.cardCode},_({card:e,className:"box-9"},e.name),t({className:"box-3 flex no-wrap"},s({className:"grow gutter-trbl-.5",onClick:()=>Ce(e)},t({className:"icon plus"})),t({className:"gutter-rl-.25"}),s({className:"grow gutter-trbl-.5",onClick:()=>Ne(e)},t({className:"icon minus"})))):void 0))),le&&le.length?void 0:t({className:"flex"},s({onClick:ue,className:"gutter-trbl-.5 grow"},ie?t({className:"icon loading"}):e("load_rito_data"))))):void 0,"custom"===X?t({className:"gutter-rl"},D({filterOptions:ce,updateSelectedFilters:ae,updateSelectedFilter:oe,selectedFilters:se}),t({className:"card-name-list"},L({defaultSize:24},(te||[]).map((e=>e?t({className:"flex gutter-b",key:e.id},_({card:e,className:"box-9"},e.name),t({className:"box-3 flex no-wrap"},s({className:"grow gutter-trbl-.5",onClick:()=>Ce(e)},t({className:"icon plus"})),t({className:"gutter-rl-.25"}),s({className:"grow gutter-trbl-.5",onClick:()=>Ne(e)},t({className:"icon minus"})))):void 0))))):void 0,"inDeck"===X?t({className:"gutter-rl"},t({className:"card-name-list gutter-t"},t({className:"current-deck-input-fields gutter-rl-.5 gutter-b-1"},R({label:e("deck_name"),value:y.name,updateValue:J})),t({className:"current-deck-input-fields gutter-rl-.5 gutter-b-1"},U({label:e("other_custom_card"),moveable:!1,multiple:!0,updateValue:e=>{e.forEach((e=>Ce({url:e})))}})),t({className:"current-deck-input-fields gutter-rl-.5 gutter-b-1"},B({label:e("show_deck_stats"),value:y.showDeckStats,updateValue:K})),(Q||[]).map((e=>e?t({className:"flex gutter-b",key:e.card.id||e.card.cardCode||e.card.url},I(e.card)?t({className:"box-9 gutter-rl"},V(e.card)):_({card:e.card,className:"box-9"},e.card.name),t({className:"box-3 flex no-wrap "+(I(e.card)?"vcenter":"")},s({className:"grow gutter-trbl-.5",onClick:()=>Ce(e.card)},t({className:"icon plus"})),t({className:"gutter-rl-.25"}),s({className:"grow gutter-trbl-.5",onClick:()=>Ne(e.card)},t({className:"icon minus"})))):void 0)))):void 0,"about"===X?t({className:"gutter-rl"},t({className:"about-deck-uilder gutter-t"},t({className:"about-info"},e("about_deck_builder_1",!0)),t({className:"about-info"},e("about_deck_builder_2",!0)),t({className:"about-info"},e("about_deck_builder_3",!0)),t({className:"about-info"},e("about_deck_builder_4",!0)),t({className:"about-info"},e("about_deck_builder_5",!0)))):void 0)))}),M);