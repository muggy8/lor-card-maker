import e,{div as t,label as a,strong as s,button as r,fragment as n,select as l,option as o}from"/Utils/elements.js";import c,{components as i}from"/cdn/react-select";import u from"/Utils/use-lang.js";import{useCallback as g,useState as m,useEffect as p,useContext as d,createElement as b}from"/cdn/react";import h from"/Utils/load-css.js";import f from"/Utils/datauri.js";import v from"/Components/card-config/edit-art.js";import x from"/Components/card-template/image-render.js";import N from"/cdn/save-svg-as-png";import{InlineIcon as w}from"/Components/card-template/effect-text.js";import C from"../card-template/svg-wrap.js";import{decimalLimit as k}from"/Components/card-config/edit-shade.js";import{svgRefference as $}from"/Views/card-editor.js";import{Globals as j}from"/Views/index.js";import y from"/Utils/use-asset-cache.js";import U from"/Components/range-input.js";import V from"./edit-rarity-poc.js";h("/Components/card-config/edit-icon.css");const _=e(c),P=e(i.Option),I=e(i.SingleValue),L=e(i.Placeholder),A=["negate.png","nou.png","october.png","pierce.png","quiet.png","shards.png","vision.png","avarosa.png","blaze.png","block.png","bolt.png","boot.png","candle.png","crit.png","defend.png","duel.png","eevee.png","ember.png","healing.png","champ.png","chat.png","discovered.png","dislike.png","flag.png","hexigon.png","like.png","pray.png","sword.png"],S=[{id:"orange",hue:0,contrast:2,saturation:5,brightness:.52,sepia:.5},{id:"red",hue:320,contrast:2,saturation:4.5,brightness:.4,sepia:.55},{id:"yellow",hue:20,contrast:2.5,saturation:4.25,brightness:.7,sepia:.6},{id:"purple",hue:240,contrast:2.5,saturation:4,brightness:.4,sepia:.65},{id:"blue",hue:137,contrast:1.5,saturation:5,brightness:.6,sepia:.6},{id:"gray",hue:0,contrast:2,saturation:.2,brightness:.5,sepia:.7}];export function customIconPreview(e){const{iconUri:a,brightness:s,sepia:r,saturation:n,hue:l,contrast:o,loading:c}=e;return C({width:128,height:128,loading:c},t({className:"custom-icon",style:{backgroundImage:a?`url(${a})`:void 0,filter:`brightness(${s}) sepia(${r}) saturate(${n}) hue-rotate(${l}deg) contrast(${o})`}}))}function q(e){return P({...e},t({className:"flex vhcenter"},w({url:e.data.icon})))}function O(e){const a=u();return I({...e},t({className:"flex vhcenter gutter-tb-.5"},`${a("base_icon")}: `,w({url:e.data.icon})))}function R(e){return L(e,t({className:"flex vhcenter gutter-tb-1",style:{color:"var(--color-black)"}},e.children))}export default e((function(e){const n=u(),l=!0===d(j).state.settings.lowSpecsMode,[o,c]=m(0),[i,h]=m(2),[w,y]=m(.2),[V,P]=m(.5),[I,L]=m(.7),[z,F]=m(null),[M,T]=m("");p((()=>{z&&(f(z.icon).then(T),c(0),h(2),y(.2),P(.5),L(.7))}),[z]);const[X,B]=m(null),[D,E]=m(!1),G=g((()=>{D||(E(!0),requestAnimationFrame((()=>{N.svgAsPngUri(X,{excludeUnusedCss:!0,width:X.width.baseVal.value,height:X.height.baseVal.value}).then((t=>{e.updateValue([...e.value||[],t]),F(null),T(""),E(!1)}),(()=>E(!1)))})))}),[X,D,e.value]),H=g((()=>{F(null),T(""),E(!1)}),[]),[J,K]=m(!1),Q=g((()=>K(!0))),W=g((()=>K(!1))),[Y,Z]=m(""),[ee,te]=m({x:0,y:0,scale:1}),[ae,se]=m(null),[re,ne]=m(!1);p((()=>{te({x:0,y:0,scale:1}),W()}),[Y]);const le=g((()=>{Z("")}),[]),oe=g((()=>{!re&&J&&(ne(!0),N.svgAsPngUri(ae,{excludeUnusedCss:!0,width:ae.width.baseVal.value,height:ae.height.baseVal.value}).then((t=>{e.updateValue([...e.value||[],t]),Z(""),ne(!1),W()}),(()=>ne(!1))))}),[ae,re,e.value,J]),[ce,ie]=m(!1),ue=g((()=>ie(!ce)),[ce,ie]);return t({className:"edit-icon box"},a(s(n("keyword_icon"))),e.value&&e.value.length?t({className:"gutter-trl-.5"},t(n("icons")),e.value.map(((a,s)=>t({className:"flex gutter-b-.5",key:a},t({className:"box gutter-trbl-.5 existing-icon-bg"},t({className:"existing-icon-preview",style:{backgroundImage:`url(${a})`}})),r({className:"gutter-trbl-1",onClick:()=>{const t=[...e.value];t.splice(s,1),e.updateValue(t)}},"X"))))):void 0,z?void 0:t(t({className:"gutter-trl-.5"},n("upload_icon")),v({value:Y,updateValue:Z,moveable:!1}),Y?t(t({className:"flex vhcenter gutter-tb-2"},b($.Provider,{value:{current:ae,setRef:se}},C({width:256,height:256,loading:re,onTransform:te,...ee},t({className:"icon-svg-content",style:{"--scale":ee.scale,"--left":ee.x,"--top":ee.y}},t({className:"scale-adjuster"},x({url:Y,onImageChanged:Q})))))),t({className:"flex gutter-t-.5"},r({className:"box gutter-trbl-1",onClick:oe,...J?{}:{disabled:!0}},J?n("use_icon"):t({className:"icon loading"})),t({className:"gutter-r-.5"}),r({className:"gutter-trbl-1",onClick:le},n("cancel")))):void 0),Y?void 0:t(z?void 0:t({className:"box gutter-rl-.5 gutter-t-.75"},s(n("or"))),t({className:"gutter-trl-.5"},n("create_icon"),t({className:"gutter-t-.5"},_({options:A.map((e=>({value:e,label:e,icon:`/Assets/custom-icon/${e}`}))),components:{Option:q,SingleValue:O,Placeholder:R},placeholder:n("select_base_icon"),onChange:F,value:z}),M?t(a({className:"gutter-t"},s(n("preview"))),t({className:"flex vhcenter gutter-t-.5"},b($.Provider,{value:{current:X,setRef:B}},customIconPreview({iconUri:M,brightness:V,sepia:I,saturation:w,hue:o,contrast:i,loading:D}))),a({className:"box gutter-t"},t({className:"box-4 flex vcenter gutter-t"},s(n("presets"))),t({className:"flex gutter-trbl-.5"},S.map((e=>t({key:e.id,className:"box-2 clickable",onClick:()=>{c(e.hue),h(e.contrast),y(e.saturation),P(e.brightness),L(e.sepia)}},customIconPreview({...e,iconUri:M,loading:D})))))),t({className:"flex clickable",onClick:ue},t({className:"grow flex vcenter"},a(s(n("advanced_color_settings")))),r({className:"gutter-trbl-.5 flex vcenter"},t({className:`icon ${l?"":"animated"} ${ce?"multiply":"chevron-down"}`}))),t({className:"accordian gutter-b-.5 "+(ce?"expanded":"")},a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4 flex vcenter gutter-t"},n("saturation"),":"),t({className:"grow gutter-t"},U({formatLabel:e=>`${k(100*e)}%`,value:w,min:0,max:5,step:.01,onChange:y}))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4 flex vcenter gutter-t"},n("hue_rotation"),":"),t({className:"grow gutter-t"},U({formatLabel:e=>`${k(e)}deg`,value:o,min:0,max:360,step:1,onChange:c}))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4 flex vcenter gutter-t"},n("brightness"),":"),t({className:"grow gutter-t"},U({formatLabel:e=>`${k(100*e)}%`,value:V,min:0,max:2,step:.01,onChange:P}))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4 flex vcenter gutter-t"},n("contrast"),":"),t({className:"grow gutter-t"},U({formatLabel:e=>`${k(100*e)}%`,value:i,min:0,max:5,step:.01,onChange:h}))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4 flex vcenter gutter-t"},n("sepia"),":"),t({className:"grow gutter-t"},U({formatLabel:e=>`${k(100*e)}%`,value:I,min:0,max:1,step:.01,onChange:L})))),t({className:"flex gutter-t-.5"},r({className:"box gutter-trbl-1",onClick:G},n("use_icon")),t({className:"gutter-r-.5"}),r({className:"gutter-trbl-1",onClick:H},n("cancel")))):void 0))))}));