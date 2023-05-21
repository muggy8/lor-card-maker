import r,{div as e,range as o}from"/Utils/elements.js";import{getTrackBackground as t}from"/cdn/react-range";import{useMemo as n,useCallback as a}from"/cdn/react";function l(r){if(1===r.length)return["var(--color-primary)","var(--color-light)"];const e=["var(--color-light)"];for(let o=0;o<r.length-1;o++)e.push("var(--color-primary)");return e.push("var(--color-light)"),e}export default r((function(r){const{value:i,min:s,max:c,step:m,onChange:h,formatLabel:d}=r,u=n((()=>Array.isArray(i)?i:"number"==typeof i?[i]:[s,c]),[i,s,c]),p=a((r=>{1!=r.length?h(r):h(r[0])}),[h]);return o({values:u,min:s,max:c,step:m||1,onChange:p,renderTrack:({props:r,children:o})=>e({onMouseDown:r.onMouseDown,onTouchStart:r.onTouchStart,style:{...r.style,height:"2em",display:"flex",width:"100%"}},e({ref:r.ref,style:{height:"0.5em",width:"100%",borderRadius:"0.25em",background:t({min:s,max:c,colors:l(u),values:u}),alignSelf:"center"}},o)),renderThumb:({index:r,props:o,isDragged:t})=>e({...o,style:{...o.style,height:"1em",width:"1em",borderRadius:"0.25em",backgroundColor:"var(--color-white)",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"0px 2px 6px var(--color-dark)"}},e({style:{height:"0.5em",width:"0.2em",backgroundColor:t?"var(--color-primary)":"var(--color-dark)"}}),e({style:{position:"absolute",top:"-1.5em",color:"var(--color-text)",fontWeight:"bold",fontSize:"0.75em"}},d?d(u[r]):u[r]))})}));