export default function linkAsset(e,t={}){const n=document.createElement(t.element||"link");n.setAttribute(t.srcAttr||"href",e),n.setAttribute("rel","stylesheet");const r=new Promise(e=>{n.addEventListener("load",e)});return document.head.appendChild(n),r}