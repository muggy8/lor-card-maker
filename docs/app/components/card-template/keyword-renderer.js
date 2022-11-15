import e,{div as n}from"/Utils/elements.js";import t from"/Utils/load-css.js";import a from"/Utils/use-lang.js";import{useRef as r,useLayoutEffect as l,useState as s,useEffect as o}from"/cdn/react";import g from"/Utils/datauri.js";const p=t("/Components/card-template/keyword-renderer.css");export const keywords={attune:["attune.png"],attach:["attach.png"],augment:["augment.png"],fleeting:["fleeting.png"],scout:["scout.png"],barrier:["barrier.png"],deep:["deep.png"],frostbite:["frostbite.png"],skill:["skill.png"],burst:["burst.png"],"double attack":["doubleattack.png"],"last breath":["lastbreath.png"],slow:["slow.png"],"can't attack":["cantattack.png"],elusive:["elusive.png"],lifesteal:["lifesteal.png"],landmark:["landmark.png"],stun:["stun.png"],"can't block":["cantblock.png"],ephemeral:["ephemeral.png"],overwhelm:["overwhelm.png"],tough:["tough.png"],capture:["capture.png"],fast:["fast.png"],"quick attack":["quickattack.png"],vulnerable:["vulnerable.png"],challenger:["challenger.png"],fearsome:["fearsome.png"],regeneration:["regeneration.png"],spellshield:["spellshield.png"],fury:["fury.png"],focus:["focus.png"],formidable:["formidable.png"],lurk:["lurk.png"],impact:["impact.png"],fated:["fated.png"],evolve:["evolve.png"],hallowed:["hallowed.png"],equipment:["equipment.png"],immobile:["cantattack.png","cantblock.png"],trap:[],boon:[],silence:["silence.png"],trigger:["trigger.png"],imbue:["imbue.png"]};export default e((function(e){const{name:t,size:p}=e,i=keywords[t]||[],c=a(),m=r(),[u,d]=s([]),[k,h]=s(""),[f,b]=s(""),[w,y]=s("");return o((()=>{g("/Assets/keyword/keywordleft.png").then(h),g("/Assets/keyword/keywordright.png").then(b),g("/Assets/keyword/keywordmiddle.png").then(y)}),[]),o((()=>{if(!i||!i.length||e.icons&&e.icons.length)return;const n=i.map((e=>g(`/Assets/keyword/${e}`)));Promise.all(n).then(d)}),[i,e.icons]),o((()=>{e.icons&&d(e.icons)}),[e.icons]),l((()=>{e.onDimension&&e.onDimension({width:m.current.clientWidth,height:m.current.clientHeight})}),[e.onDimension,u.length]),n({className:"keyword-wrapper",ref:m},n({className:"left-bumper",style:{backgroundImage:k?`url(${k})`:"none"}}),n({className:`contents ${i.length?p:"small"}`,style:{backgroundImage:w?`url(${w})`:"none"}},u.map((t=>n({key:t,className:"keyword-icon "+(e.icons&&e.icons.length?"custom":""),style:{backgroundImage:`url(${t})`}}))),"small"!==p||!u.length&&!i.length?n({className:"keyword-text card-text-bold"},c(t)):void 0),n({className:"right-bumper",style:{backgroundImage:f?`url(${f})`:"none"}}))}),p);