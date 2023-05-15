import e,{div as a,label as t,strong as r,input as s,nav as c,button as l}from"/Utils/elements.js";import{useCallback as o,useState as i,useEffect as m,useRef as n}from"/cdn/react";import d from"/Utils/use-lang.js";import u from"/Utils/load-css.js";import f from"/Utils/use-toggle.js";import p from"/Components/list-limit.js";import{getRitoCardsFromDataDump as b}from"/Views/deck-builder.js";import N from"/Utils/use-asset-cache.js";import{getRitoCards as g,patchRitoCards as x,getLatestRitoData as k,getCardList as v,getCard as y,saveCard as C,deleteCard as w}from"/Utils/service.js";import h from"/Components/deck/card-name.js";import j from"/cdn/object-hash";const A=u("/Components/card-config/edit-associated-cards.css");export default e((function(e){const s=d(),[u,y]=f(!1),[C,w]=i("custom"),A=n({}),[U,_]=i();m((()=>{g().then((e=>{let a;_(a=b(e)),Array.prototype.forEach.call(a,(e=>{e&&(A.current[e.cardCode]=e)}))}))}),[]);const[V,z]=i(!1),E=o((()=>{V||(z(!0),k().then((async e=>{await x(e),_(b(e)),z(!1)})))}),[V]),[L,S]=i([]),[q,B]=i("");m((()=>{if(!Array.isArray(U))return;const e=U.filter((e=>e&&e.name.toLowerCase().includes(q)));S(e)}),[q,U]);const D=N((e=>{v({exclude:["deck"]}).then((a=>{e(a),Array.prototype.forEach.call(a,(e=>{A.current[e.id]=e}))}))}),[]),[F,G]=i([]),[H,I]=i("");m((()=>{if(!Array.isArray(D))return;const e=D.filter((e=>e&&e.name&&e.name.toLowerCase().includes(q)));G(e)}),[H,D]);const J=o((a=>{const t={id:a.id,cardCode:a.cardCode,artUrl:a.url},r=j(t);t.key=r;let s=e.value||[];Array.isArray(s)||(s=[]);if(s.some((e=>e.key===r)))return;const c=[t,...s];e.updateValue(c)}),[e.value,e.updateValue]),K=N((a=>{a((e.value||[]).map((e=>A.current[e.id]||A.current[e.cardCode]||e)))}),[e.value,D,U],[]);return a({className:"associated-cards"},t({onClick:y,className:"flex clickable"},a({className:"grow"},r(e.label)),a({className:"icon animated "+(u?"multiply":"chevron-down")})),a({className:"gutter-b-2 accordian "+(u?"expanded":"")},c({className:"flex no-wrap tabs gutter-t-.5"},a({className:("custom"===C?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>w("custom")},s("custom_cards")),a({className:("rito"===C?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>w("rito")},s("official_cards")),a({className:("associated"===C?"active ":"")+"tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",onClick:()=>w("associated")},e.label)),a({className:"tab-body gutter-t"},"custom"===C?a({className:"gutter-rl"},a(p({defaultSize:24},(F||[]).map((e=>e?a({className:"flex gutter-b",key:e.id},h({card:e,className:"box-9"},e.name),a({className:"box-3 flex no-wrap"},l({className:"grow gutter-trbl-.5",onClick:()=>J(e)},a({className:"icon link"})))):void 0))))):void 0,"rito"===C?a({className:"gutter-rl"},a(p({defaultSize:24},(L||[]).map((e=>e?a({className:"flex gutter-b",key:e.cardCode},h({card:e,className:"box-9"},e.name),a({className:"box-3 flex no-wrap"},l({className:"grow gutter-trbl-.5",onClick:()=>J(e)},a({className:"icon link"})))):void 0))),U&&U.length?void 0:a({className:"flex"},l({onClick:E,className:"gutter-trbl-.5 grow"},V?a({className:"icon loading"}):s("load_rito_data"))))):void 0,"associated"===C?a({className:"gutter-rl"},(K||[]).map((e=>e?a({className:"flex gutter-b",key:e.id||e.cardCode||e.url},h({card:e,className:"box-9"},e.name),a({className:"box-3 flex no-wrap"},l({className:"grow gutter-trbl-.5"},a({className:"icon multiply"})))):void 0))):void 0)))}),A);