import e from"/Components/card-template/svg-wrap.js";import{isRitoCard as s}from"./card-name.js";import t,{div as a}from"/Utils/elements.js";import n from"/Utils/load-css.js";import c from"/Utils/use-asset-cache.js";import o from"/Utils/datauri.js";import{isExternalImage as l}from"./deck-card.js";const r=n("/Components/deck/deck-stats-card.css");export default t((function(t){const n=c((e=>{const a={cards:0,units:0,followers:0,champions:0,spells:0,equipments:0,landmarks:0,externals:0};(t.cards||[]).forEach((e=>{a.cards+=e.count;const{card:t}=e,n=s(t),c=l(t);n?("Unit"===t.type?(a.units+=e.count,"Champion"!==t.supertype&&(a.followers+=e.count)):"Equipment"===t.type?a.equipments+=e.count:"Landmark"===t.type?a.landmarks+=e.count:"Spell"===t.type&&(a.spells+=e.count),"Champion"===t.supertype&&(a.champions+=e.count)):c?a.externals+=e.count:"champion1"===t.type||"champion2"===t.type||"champion3"===t.type?(a.units+=e.count,a.champions+=e.count):"follower"===t.type?a.followers+=e.count:"landmark"===t.type?a.landmarks+=e.count:"spell"===t.type&&("equipment"===t.speed?a.equipments+=e.count:a.spells+=e.count)})),console.log(a,t.cards),e(a)}),[t.cards]),r=c((e=>{o("/Assets/deck/card-icon.png").then(e)})),d=c((e=>{o("/Assets/deck/unit-icon.png").then(e)})),m=c((e=>{o("/Assets/deck/champ-icon.png").then(e)})),i=c((e=>{o("/Assets/deck/follower-icon.png").then(e)})),p=c((e=>{o("/Assets/deck/spell-icon.png").then(e)})),u=c((e=>{o("/Assets/deck/landmark-icon.png").then(e)})),h=c((e=>{o("/Assets/deck/equipment-icon.png").then(e)})),k=c((e=>{o("/Assets/deck/external-icon.png").then(e)}));return n&&n.cards?e(a({className:"deck-stats-card"},a({className:"deck-stat"},a({style:{width:128,height:128,backgroundImage:`url(${r})`}}),n.cards),a({className:"deck-stat"},a({style:{width:128,height:128,backgroundImage:`url(${d})`}}),n.units),a({className:"deck-stat"},a({style:{width:128,height:128,backgroundImage:`url(${m})`}}),n.champions),a({className:"deck-stat"},a({style:{width:128,height:128,backgroundImage:`url(${i})`}}),n.followers),a({className:"deck-stat"},a({style:{width:128,height:128,backgroundImage:`url(${p})`}}),n.spells),a({className:"deck-stat"},a({style:{width:128,height:128,backgroundImage:`url(${u})`}}),n.landmarks),a({className:"deck-stat"},a({style:{width:128,height:128,backgroundImage:`url(${h})`}}),n.equipments),a({className:"deck-stat"},a({style:{width:128,height:128,backgroundImage:`url(${k})`}}),n.externals))):null}),r);