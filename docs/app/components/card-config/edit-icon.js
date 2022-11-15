import e,{div as t,label as a,strong as s,button as l,InputRange as r}from"/Utils/elements.js";import o,{components as n}from"/cdn/react-select";import c from"/Utils/use-lang.js";import{useCallback as i,useState as u,useEffect as m,useContext as g,createElement as p}from"/cdn/react";import d from"/Utils/load-css.js";import b from"/Utils/datauri.js";import f from"/Components/card-config/edit-art.js";import v from"/Components/card-template/image-render.js";import h from"/cdn/save-svg-as-png";import{InlineIcon as x}from"/Components/card-template/effect-text.js";import N from"../card-template/svg-wrap.js";import{decimalLimit as V}from"/Components/card-config/edit-shade.js";import{svgRefference as C}from"/Views/card-editor.js";import{Globals as w}from"/Views/index.js";import{openUri as $}from"/Views/card-editor.js";d("/Components/card-config/edit-icon.css");const j=e(o),k=e(n.Option),y=e(n.SingleValue),_=e(n.Placeholder),U=["negate.png","nou.png","october.png","pierce.png","quiet.png","shards.png","vision.png","avarosa.png","blaze.png","block.png","bolt.png","boot.png","candle.png","crit.png","defend.png","duel.png","eevee.png","ember.png","healing.png"];function P(e){return k({...e},t({className:"flex vhcenter"},x({url:e.data.icon})))}function L(e){const a=c();return y({...e},t({className:"flex vhcenter gutter-tb-.5"},`${a("base_icon")}: `,x({url:e.data.icon})))}function A(e){return _(e,t({className:"flex vhcenter gutter-tb-1",style:{color:"var(--color-black)"}},e.children))}export default e((function(e){const o=c(),[n,d]=(g(w),u(0)),[x,$]=u(1),[k,y]=u(0),[_,q]=u(1),[I,O]=u(1),[R,S]=u(null),[z,F]=u("");m((()=>{R&&(b(R.icon).then(F),d(0),$(1),y(0),q(1),O(1))}),[R]);const[T,X]=u(null),[B,D]=u(!1),E=i((()=>{B||(D(!0),requestAnimationFrame((()=>{h.svgAsPngUri(T,{excludeUnusedCss:!0,width:T.width.baseVal.value,height:T.height.baseVal.value}).then((t=>{e.updateValue([...e.value||[],t]),S(null),F(""),D(!1)}),(()=>D(!1)))})))}),[T,B,e.value]),G=i((()=>{S(null),F(""),D(!1)}),[]),[H,J]=u(""),[K,M]=u({x:0,y:0,scale:1}),[Q,W]=u(null),[Y,Z]=u(!1);m((()=>{M({x:0,y:0,scale:1})}),[H]);const ee=i((()=>{J("")}),[]),te=i((()=>{Y||(Z(!0),h.svgAsPngUri(Q,{excludeUnusedCss:!0,width:Q.width.baseVal.value,height:Q.height.baseVal.value}).then((t=>{e.updateValue([...e.value||[],t]),J(""),Z(!1)}),(()=>Z(!1))))}),[Q,Y,e.value]);return t({className:"edit-icon box"},a(t(o("keyword_icon"))),e.value&&e.value.length?t({className:"gutter-trl-.5"},t(o("icons")),e.value.map(((a,s)=>t({className:"flex gutter-b-.5",key:a},t({className:"box gutter-trbl-.5 existing-icon-bg"},t({className:"existing-icon-preview",style:{backgroundImage:`url(${a})`}})),l({className:"gutter-trbl-1",onClick:()=>{const t=[...e.value];t.splice(s,1),e.updateValue(t)}},"X"))))):void 0,R?void 0:t(t({className:"gutter-trl-.5"},o("upload_icon")),f({value:H,updateValue:J,moveable:!1}),H?t(t({className:"flex vhcenter gutter-tb-2"},p(C.Provider,{value:{current:Q,setRef:W}},N({width:128,height:128,loading:Y,onTransform:M,...K},t({className:"icon-svg-content",style:{"--scale":K.scale,"--left":K.x,"--top":K.y}},t({className:"scale-adjuster"},v({url:H})))))),t({className:"flex gutter-t-.5"},l({className:"box gutter-trbl-1",onClick:te},o("use_icon")),t({className:"gutter-r-.5"}),l({className:"gutter-trbl-1",onClick:ee},o("cancel")))):void 0),H?void 0:t(R?void 0:t({className:"box gutter-rl-.5 gutter-t-.75"},s(o("or"))),t({className:"gutter-trl-.5"},o("create_icon"),t({className:"gutter-t-.5"},j({options:U.map((e=>({value:e,label:e,icon:`/Assets/custom-icon/${e}`}))),components:{Option:P,SingleValue:L,Placeholder:A},placeholder:o("select_base_icon"),onChange:S,value:R}),z?t(t({className:"flex vhcenter gutter-t-.5"},p(C.Provider,{value:{current:T,setRef:X}},N({width:128,height:128,loading:B},t({className:"custom-icon",style:{backgroundImage:z?`url(${z})`:void 0,filter:`brightness(${_}) sepia(${I}) saturate(${k}) hue-rotate(${n}deg) contrast(${x})`}})))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4"},o("saturation"),":"),t({className:"grow gutter-tb"},r({formatLabel:e=>`${V(100*e)}%`,value:k,minValue:0,maxValue:5,step:.01,onChange:y}))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4"},o("hue_rotation"),":"),t({className:"grow gutter-tb"},r({formatLabel:e=>`${V(e)}deg`,value:n,minValue:0,maxValue:360,step:1,onChange:d}))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4"},o("brightness"),":"),t({className:"grow gutter-tb"},r({formatLabel:e=>`${V(100*e)}%`,value:_,minValue:0,maxValue:2,step:.01,onChange:q}))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4"},o("contrast"),":"),t({className:"grow gutter-tb"},r({formatLabel:e=>`${V(100*e)}%`,value:x,minValue:0,maxValue:5,step:.01,onChange:$}))),a({className:"box gutter-trbl-.5 flex-s"},t({className:"box-4"},o("sepia"),":"),t({className:"grow gutter-tb"},r({formatLabel:e=>`${V(100*e)}%`,value:I,minValue:0,maxValue:1,step:.01,onChange:O}))),t({className:"flex gutter-t-.5"},l({className:"box gutter-trbl-1",onClick:E},o("use_icon")),t({className:"gutter-r-.5"}),l({className:"gutter-trbl-1",onClick:G},o("cancel")))):void 0))))}));