import e,{div as t,strong as r,button as a,nav as s,section as o,label as c}from"/Utils/elements.js";import{useState as l,useCallback as n,useRef as i,useEffect as d,useContext as u,useLayoutEffect as m,createElement as f}from"/cdn/react";import{getRitoCards as p,patchRitoCards as g,getLatestRitoData as h,getCardList as b,getCard as w,saveCard as N,deleteCard as C}from"/Utils/service.js";import{isMobile as k}from"/cdn/react-device-detect";import y from"/Utils/load-css.js";import x from"/Utils/use-lang.js";import v from"/Utils/use-filter.js";import L from"/Components/list-limit.js";import _ from"/Components/deck/card-name.js";import j from"/Components/deck/rito-cards-filters-ui.js";import O from"/Components/deck/deck-view.js";import E from"/Utils/use-asset-cache.js";import S from"/Components/deck/custom-cards-filters-ui.js";import U from"/Utils/debounce-function.js";import A from"/cdn/save-svg-as-png";import{svgRefference as F}from"/Views/card-editor.js";import{openUri as D}from"/Views/card-editor.js";import{Globals as R}from"/Views/index.js";import V from"/Components/card-config/edit-name.js";const P=y("/Views/deck-builder.css");function z({sets:e}){if(!e)return;const t=e.map((e=>e.data)).flat();return t.sort(((e,t)=>{if("champion"===e.supertype.toLowerCase()&&"champion"!==t.supertype.toLowerCase())return-1;if("champion"!==e.supertype.toLowerCase()&&"champion"===t.supertype.toLowerCase())return 1;const r=e.cost-t.cost;if(r)return r;const a=t.collectible-e.collectible;if(a)return a;const s=e.name.localeCompare(t.name);return s||0})),t}function I(e){const t=e.reduce(((e,t)=>t?(Object.keys(t).forEach((r=>{e[r]=e[r]||new Map;const a=t[r];Array.isArray(a)?a.forEach((t=>{e[r].set(t,!0)})):e[r].set(a,!0)})),e):e),{});return Object.keys(t).forEach((e=>{const r=t[e];t[e]=[],r.forEach(((r,a)=>{t[e].push(a)}))})),t}const B={id:void 0,cards:[],type:"deck",name:""};export default e((function(){const e=x(),c=u(R),k=i();k.current=c;const[y,P]=l(B),M=y.cards;let T={};const q=n((e=>{T={...T,...e},P({...y,...T})}),[y]),H=n((e=>{q({name:e})}),[q]),W=E((e=>{const t=[...M];t.sort(((e,t)=>{const r=Object.prototype.hasOwnProperty.call(e.card,"mana")?e.card.mana:e.card.cost,a=Object.prototype.hasOwnProperty.call(t.card,"mana")?t.card.mana:t.card.cost,s=e.card.name.toLowerCase(),o=t.card.name.toLowerCase();return r-a||s.localeCompare(o)})),e(t)}),[M],[]);d((()=>{const e=c.getAllowBack();return k.current.setAllowBack((function(){return document.documentElement.scrollTop>100?(setImmediate((()=>window.scroll({top:-document.documentElement.scrollTop,left:0,behavior:"smooth"}))),!1):e()})),function(){k.current.setAllowBack(e)}}),[]),d((()=>(c.state.cardId&&w(c.state.cardId).then((e=>{P(e),e.cards.forEach((e=>{const t=e.card.id||e.card.cardCode;me.current.set(t,e)}))})),()=>{k.current.patchState({cardId:""})})),[c.state.cardId]);const[$,G]=l("rito"),J=E((e=>{b({exclude:["keyword","deck"]}).then(e)}),[]),[K,Q,X,Y]=v({name:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},effect:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},lvup:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},clan:{filter:(e,t)=>!e||Array.prototype.some.call(t,(t=>t.toLowerCase().includes(e.toLowerCase())))},keywords:{filter:(e,t)=>!e||!e.length||t.some((t=>e.includes(t)||e.some((e=>"string"!=typeof e&&"string"!=typeof t&&e.id===t.id))))},rarity:{filter:(e,t)=>!e||!e.length||e.includes(t)},type:{filter:(e,t)=>!e||!e.length||e.includes(t)},faction:{filter:(e,t)=>!e||!e.length||e.some((e=>t.includes(e)))},speed:{filter:(e,t)=>!e||!e.length||e.includes(t)},mana:{filter:(e,t)=>{if(!e||!e.length)return!0;const[r,a]=e;return t<=a&&t>=r}},power:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[a,s]=e;return t<=s&&t>=a}},health:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[a,s]=e;return t<=s&&t>=a}}});d((()=>{if(!J||!J.length)return Q([]);Q(J)}),[J]);const Z=n(((e,t)=>{const r={};r[e]=t,Y(r)}),[Y]),ee=E((e=>{if(!(J&&J.length&&K&&K.length))return;const t=I(J);t.health=t.health.filter((e=>null!=e)),t.power=t.power.filter((e=>null!=e));const r=t.type;t.type=t.type.filter((e=>!e.toLowerCase().includes("champion"))),r.length!==t.type.length&&t.type.push("champion");const a=I(K),s=[];a.keywords=a.keywords.filter((e=>{const t=e.id||e;return!s.includes(t)&&(s.push(t),!0)}));e({...t,keywords:a.keywords})}),[J,K],{}),[te,re]=l();d((()=>{p().then((e=>{re(z(e))}))}),[]);const[ae,se]=l(!1),oe=n((()=>{se(!0),h().then((async e=>{await g(e),re(z(e)),se(!1)}))}),[]),[ce,le,ne,ie]=v({collectible:{value:!0,filter:(e,t)=>t===e},name:{filter:(e,t)=>!e||t.toLowerCase().includes(e.toLowerCase())},descriptionRaw:{filter:(e,t,r)=>!e||(t.toLowerCase().includes(e.toLowerCase())||r.levelupDescriptionRaw.toLowerCase().includes(e.toLowerCase())||r.description.toLowerCase().includes(e.toLowerCase())||r.levelupDescription.toLowerCase().includes(e.toLowerCase()))},subtypes:{filter:(e,t)=>!e||Array.prototype.some.call(t,(t=>t.toLowerCase().includes(e.toLowerCase())))},type:{filter:(e,t)=>!e||!e.length||e.includes(t)},set:{filter:(e,t)=>!e||!e.length||e.includes(t)},keywords:{filter:(e,t)=>!e||!e.length||t.some((t=>e.includes(t)))},rarity:{filter:(e,t)=>!e||!e.length||e.includes(t)},regionRefs:{filter:(e,t)=>!e||!e.length||e.some((e=>t.includes(e)))},spellSpeed:{filter:(e,t)=>!e||!e.length||e.includes(t)},cost:{filter:(e,t)=>{if(!e||!e.length)return!0;const[r,a]=e;return t<=a&&t>=r}},attack:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[a,s]=e;return t<=s&&t>=a}},health:{filter:(e,t,r)=>{if(!e||!e.length)return!0;if("unit"!==(r.type||"").toLowerCase())return!1;const[a,s]=e;return t<=s&&t>=a}}});d((()=>{if(!te||!te.length)return le([]);le(te)}),[te]);const de=n(((e,t)=>{const r={};r[e]=t,ie(r)}),[ie]),ue=E((e=>{if(!(te&&te.length&&ce&&ce.length))return;const t=I(te);t.set.sort(((e,t)=>e.localeCompare(t)));const r=I(ce);e({...t,keywords:r.keywords})}),[te,ce],{}),me=i(new Map),fe=n((()=>{const e=[];me.current.forEach((t=>e.push(t))),e.sort(((e,t)=>{const r=Object.prototype.hasOwnProperty.call(e.card,"mana")?e.card.mana:e.card.cost,a=Object.prototype.hasOwnProperty.call(t.card,"mana")?t.card.mana:t.card.cost,s=e.card.name.toLowerCase(),o=t.card.name.toLowerCase();return t.count-e.count||r-a||s.localeCompare(o)})),q({cards:e})}),[q]),pe=n((e=>{const t=e.id||e.cardCode;let r=me.current.get(t);r||(r={count:0,card:e},me.current.set(t,r)),r.count++,fe()}),[fe]),ge=n((e=>{const t=e.id||e.cardCode;let r=me.current.get(t);r&&(r.count&&r.count--,r.count<1&&me.current.delete(t),fe())}),[fe]),he=i(),[be,we]=l(0),[Ne,Ce]=l(0);m((()=>{const e=U((function(){let e=he.current.parentNode.clientWidth;const t=getComputedStyle(he.current.parentNode);e=e-parseFloat(t.paddingLeft)-parseFloat(t.paddingRight),we(e),Ce(he.current.offsetHeight)}),250);requestAnimationFrame(e);const t=new MutationObserver(e);return window.addEventListener("resize",e),t.observe(he.current,{childList:!0,subtree:!0,attributes:["style"]}),function(){window.removeEventListener("resize",e),t.disconnect()}}),[]);const[ke,ye]=l(null),[xe,ve]=l(!1),Le=n((()=>{xe||(ve(!0),A.svgAsPngUri(ke,{excludeUnusedCss:!0,width:ke.width.baseVal.value,height:ke.height.baseVal.value}).then((e=>{D(e,`${(y.name||"export").toUpperCase()}.png`),ve(!1)}),(()=>ve(!1))))}),[ke,xe]),[_e,je]=l(!y.id),[Oe,Ee]=l(!1);d((()=>{je(!0)}),Object.keys(y).map((e=>y[e])));const Se=n((()=>{if(!_e||Oe)return;function e(){je(!1),Ee(!1)}if(Ee(!0),y.id)return N(y.id,y).then(e,e);const t=Date.now().toString();N(t,y).then(e,e),q({id:t})}),[!_e||Oe,y,q]);return o({id:"deck-builder",className:"flex hcenter gutter-t-2"},t({className:"deck-preview box-xs-12 box-s-10 box-m-6",style:{paddingBottom:Ne+"px"}},t({className:"preview-content gutter-rl-2",ref:he,style:{width:be+"px"}},t({className:"flex vhcenter"},t({className:"gutter-rl"},e("deck_size"),": ",M.reduce(((e,t)=>e+t.count),0))),f(F.Provider,{value:{current:ke,setRef:ye}},O({cards:M,loading:xe})),t({className:"flex vhcenter gutter-b"},t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5 "+(y.id?"":"hide"),onClick:()=>{C(y.id).then((()=>{document.location.reload()}))}},r(e("delete_deck")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",[_e||!Ee?"data-foo":"disabled"]:!0,onClick:Se},r(e("save_deck")))),t({className:"gutter-rl-.5"},a({className:"gutter-trbl-.5",[xe?"disabled":"data-foo"]:!0,onClick:Le},r(e("share"))))))),t({className:"card-finder box-xs-12 box-s-10 box-m-6"},s({className:"flex card-list-options gutter-t-.5"},t({className:("rito"===$?"active ":"")+"tab-header box-3 gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>G("rito")},e("official_cards")),t({className:("custom"===$?"active ":"")+"tab-header box-3 gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>G("custom")},e("custom_cards")),t({className:("inDeck"===$?"active ":"")+"tab-header box-3 gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>G("inDeck")},e("currently_selected_cards")),t({className:("about"===$?"active ":"")+"tab-header box-3 gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>G("about")},e("about_deck_builder"))),t({className:"tab-body"},"rito"===$?t({className:"gutter-rl"},j({refreshRitoData:oe,refreshRitoLoading:ae,filterOptions:ue,updateSelectedFilters:ie,updateSelectedFilter:de,selectedFilters:ne}),t({className:"card-name-list"},L({defaultSize:24},(ce||[]).map((e=>e?t({className:"flex gutter-b",key:e.cardCode},_({card:e,className:"box-9"},e.name),t({className:"box-3 flex no-wrap"},a({className:"grow gutter-trbl-.5",onClick:()=>pe(e)},t({className:"icon"},t({className:"add"}))),t({className:"gutter-rl-.25"}),a({className:"grow gutter-trbl-.5",onClick:()=>ge(e)},t({className:"icon"},t({className:"minus"}))))):void 0))),te&&te.length?void 0:t({className:"flex"},a({onClick:oe,className:"gutter-trbl-.5 grow"},ae?t({className:"icon"},t({className:"loading"})):e("load_rito_data"))))):void 0,"custom"===$?t({className:"gutter-rl"},S({filterOptions:ee,updateSelectedFilters:Y,updateSelectedFilter:Z,selectedFilters:X}),t({className:"card-name-list"},L({defaultSize:24},(K||[]).map((e=>e?t({className:"flex gutter-b",key:e.id},_({card:e,className:"box-9"},e.name),t({className:"box-3 flex no-wrap"},a({className:"grow gutter-trbl-.5",onClick:()=>pe(e)},t({className:"icon"},t({className:"add"}))),t({className:"gutter-rl-.25"}),a({className:"grow gutter-trbl-.5",onClick:()=>ge(e)},t({className:"icon"},t({className:"minus"}))))):void 0))))):void 0,"inDeck"===$?t({className:"gutter-rl"},t({className:"card-name-list gutter-t"},t({className:"current-deck-input-fields gutter-rl-.5 gutter-b-1"},V({label:e("deck_name"),value:y.name,updateValue:H})),(W||[]).map((e=>e?t({className:"flex gutter-b",key:e.card.id||e.card.cardCode},_({card:e.card,className:"box-9"},e.card.name),t({className:"box-3 flex no-wrap"},a({className:"grow gutter-trbl-.5",onClick:()=>pe(e.card)},t({className:"icon"},t({className:"add"}))),t({className:"gutter-rl-.25"}),a({className:"grow gutter-trbl-.5",onClick:()=>ge(e.card)},t({className:"icon"},t({className:"minus"}))))):void 0)))):void 0,"about"===$?t({className:"gutter-rl"},t({className:"gutter-t"},t({className:"about-info"},e("about_deck_builder_1",!0)),t({className:"about-info"},e("about_deck_builder_2",!0)),t({className:"about-info"},e("about_deck_builder_3",!0)),t({className:"about-info"},e("about_deck_builder_4",!0)),t({className:"about-info"},e("about_deck_builder_5",!0)))):void 0)))}),P);