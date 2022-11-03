import{useContext,useRef,useEffect,useState}from"/cdn/react";import factory,{svg,rect,foreignObject,div}from"/Utils/elements.js";import{svgRefference}from"/Views/card-editor.js";import Gesto from"/cdn/gesto";import loadCss from"/Utils/load-css.js";const cssLoaded=loadCss("/Components/card-template/svg-wrap.css");function SvgWrapComponent(e){const t=useContext(svgRefference),r=useRef(),n=useRef({x:e.x||0,y:e.y||0,scale:e.scale||0}),c=useRef();c.current=e.onTransform;const[s,a]=useState("inherit");return useEffect(()=>{if(!e.onTransform)return;n.current.x=e.x||0,n.current.y=e.y||0,n.current.scale=e.scale||1;const s=r.current;s.addEventListener("wheel",i),a("grab");const o=new Gesto(s,{container:t.current,preventClickEventOnDrag:!0,preventClickEventOnDragStart:!0,pinchOutside:!0,preventDefault:!0}).on("dragStart",()=>{a("grabbing")}).on("drag",e=>{n.current.x+=e.deltaX*(1/n.current.scale),n.current.y+=e.deltaY*(1/n.current.scale),c.current({...n.current})}).on("dragEnd",()=>{a("grab")}).on("pinchStart",e=>{e.datas.startScale=n.current.scale,a("grabbing")}).on("pinch",e=>{n.current.scale=e.datas.startScale*e.scale,c.current({...n.current})}).on("pinchEnd",()=>{a("grab")});return c.current({...n.current}),function(){s.removeEventListener("wheel",i),o.unset(),a("inherit")};function i(e){e.preventDefault(),n.current.scale=n.current.scale*(1+e.deltaY/1e3),c.current({...n.current})}},[!!e.onTransform]),svg({width:e.width||"680",height:e.height||"1024",xmlns:"http://www.w3.org/2000/svg",viewBox:`0 0 ${e.width||"680"} ${e.height||"1024"}`,ref:e=>{e&&e!==t.current&&t.setRef(e)}},foreignObject({width:e.width||"680",height:e.height||"1024",style:{backgroundColor:"rgba(0,0,0,0)"}},e.children,e.loading?div({className:"loading-shade"},div({className:"icon"},div({className:"loading"}))):void 0),rect({x:0,y:0,width:e.width||"680",height:e.height||"1024",opacity:0,ref:r,style:{touchAction:"manipulation",cursor:s}}))}export default factory(SvgWrapComponent,cssLoaded);