import e,{div as t,label as n,strong as r,small as o,fragment as s}from"/Utils/elements.js";import a from"/Utils/use-lang.js";import{useCallback as c,useState as i,useRef as d,useEffect as l,useContext as u}from"/cdn/react";import{keywords as m}from"/Components/card-template/keyword-renderer.js";import f from"/Utils/load-css.js";import p from"/Utils/datauri.js";import g from"/Utils/use-debounce-callback.js";import{Globals as x}from"/Views/index.js";import{ContextMenu as h,ContextMenuItem as N,useContextMenu as y}from"/cdn/usecontextmenu-react";import b from"/Utils/use-asset-cache.js";const k=f("/Components/card-config/edit-effect.css"),T=e(h),w=e(N);function v(e,t){const n=t||m[e],r=document.createDocumentFragment();return n.forEach((n=>{const o=document.createElement("img");o.classList.add("keyword-img"),o.dataset.keywordName=e,r.appendChild(o),p(t?n:`/Assets/keyword/${n}`).then((e=>{o.src=e}))})),r}const E=e((function(e){const n=b((t=>{if(e.icons){const n=e.icons.map((e=>p(e)));Promise.all(n).then(t)}else if(e.name){const n=m[e.name].map((e=>p(`/Assets/keyword/${e}`)));Promise.all(n).then(t)}}),[e.name,e.icons],[]);return t({contentEditable:!1,className:"keyword-icon-wrapper","data-keyword-name":e.name,style:{height:"1em",width:n.length+"em"}},n.map(((e,n)=>t({key:n,className:"keyword-icon",style:{backgroundImage:`url(${e})`}}))))}));function C(e){let t=!1;return Array.prototype.map.call(e.childNodes,(e=>t?(t=!1,e instanceof Image&&e.nextSibling instanceof Image&&e.nextSibling.dataset.keywordName===e.dataset.keywordName&&(t=!0),""):e instanceof Image?(e.nextSibling instanceof Image&&e.nextSibling.dataset.keywordName===e.dataset.keywordName&&(t=!0),`<${e.dataset.keywordName}/>`):e instanceof Text?e.textContent:e instanceof HTMLBRElement?"\n":e instanceof HTMLDivElement?"\n"+C(e):C(e))).join("")}const W=Object.keys(m).filter((e=>m[e].length));export default e((function(e){const f=a(),{customKeywords:p}=u(x),h=d();l((()=>{e.value&&(h.current&&h.current.innerText||h.current.replaceChildren(function(e,t){let n=[e];W.forEach((e=>{const t=`<${e}/>`;n=n.map((n=>{if("string"!=typeof n)return n;let r=n.split(t);if(1===r.length)return r[0];for(let t=r.length-1;t;t--)r.splice(t,0,v(e));return r})).flat()})),t.forEach((e=>{const t=`<${e.id}/>`;n=n.map((n=>{if("string"!=typeof n)return n;let r=n.split(t);if(1===r.length)return r[0];for(let t=r.length-1;t;t--)r.splice(t,0,v(e.id,e.icons));return r})).flat()})),n=n.map((e=>{if("string"!=typeof e)return e;let t=e.split(/\n+/g);if(1===t.length)return t[0];for(let e=t.length-1;e;e--)t.splice(e,0,document.createElement("br"));return t})).flat();const r=document.createDocumentFragment();return n=n.forEach((e=>{if("string"!=typeof e)return r.appendChild(e);r.appendChild(new Text(e))})),r}(e.value,p)))}),[!!e.value]);const N=g((()=>{const t=C(h.current);e.updateValue(t)}),600,[e.updateValue]),[b,k]=i(),O=c((()=>{const e=window.getSelection(),t=e.focusNode;e&&(t===h.current||h.current.contains(t))&&k({node:t,offset:e.focusOffset,selectedText:t instanceof Text&&e.focusOffset!==e.anchorOffset?t.textContent.substring(e.anchorOffset,e.focusOffset):void 0});const n=h.current.querySelectorAll(".keyword-icon-wrapper");n.length&&Array.prototype.forEach.call(n,(e=>{e.nextSibling instanceof Text||(e.nextSibling?e.parentNode.insertBefore(document.createTextNode(" "),e.nextSibling):e.parentNode.appendChild(document.createTextNode(" ")))})),N()}),[N]),L=c((t=>{if(!b)return;t=t.trim();e.orangeWords.reduce(((e,n)=>e||n===t),!1)||e.updateOrangeWords([...e.orangeWords,t])}),[b,e.orangeWords,e.updateOrangeWords]),j=c((t=>{if(!b)return;t=t.trim();e.blueWords.reduce(((e,n)=>e||n===t),!1)||e.updateBlueWords([...e.blueWords,t])}),[b,e.blueWords,e.updateBlueWords]),B=c((t=>{if(!b)return;const n=b.node,r=f(t);if(n instanceof HTMLDivElement)n.appendChild(v(t)),n.appendChild(document.createTextNode(r));else if(n instanceof Text){const e=n.splitText(b.offset);e.parentNode.insertBefore(v(t),e),e.parentNode.insertBefore(document.createTextNode(r),e)}else n.after(v(t),document.createTextNode(r));e.orangeWords.reduce(((e,t)=>e||t===r),!1)||e.updateOrangeWords([...e.orangeWords,r]),N()}),[e.updateValue,b,e.orangeWords,e.updateOrangeWords,N]),S=c((t=>{if(!b)return;const n=b.node,r=t.name;if(n instanceof HTMLDivElement)n.appendChild(v(t.id,t.icons)),n.appendChild(document.createTextNode(r));else if(n instanceof Text){const e=n.splitText(b.offset);e.parentNode.insertBefore(v(t.id,t.icons),e),e.parentNode.insertBefore(document.createTextNode(r),e)}else n.after(v(t.id,t.icons),document.createTextNode(r));e.orangeWords.reduce(((e,t)=>e||t===r),!1)||e.updateOrangeWords([...e.orangeWords,r]),N()}),[e.updateValue,b,e.orangeWords,e.updateOrangeWords,N]),{menuProps:I,onContextMenu:M,visibleOnPosition:U}=y(),[$,A]=i(!1),D=c((e=>{O(e),A(!1)}),[O]),V=d();return V.current=O,l((()=>{function e(){A(!1)}function t(){V.current&&V.current()}return document.addEventListener("scroll",e),window.addEventListener("resize",e),document.addEventListener("click",e),document.addEventListener("selectionchange",t),function(){document.removeEventListener("scroll",e),window.removeEventListener("resize",e),document.removeEventListener("click",e),document.removeEventListener("selectionchange",t)}}),[]),n({className:"box edit-effect"},t(r(e.label)," ",o(f("insert_icon_instruction"))),t({className:"flex column gutter-b-2"},t({className:"gutter-trbl-.5"},t({ref:h,contentEditable:!0,className:"textarea box gutter-trbl-.5","data-placeholder":f("insert_icon_instruction"),onInput:D,onFocus:O,onBlur:O,onContextMenu:(...e)=>{M(...e),A(!0)}}))),T({...I,visible:$},b&&b.selectedText?s(w({onClick:()=>L(b.selectedText),className:"orange-text"},b.selectedText),w({onClick:()=>j(b.selectedText),className:"blue-text"},b.selectedText)):void 0,Object.keys(m).filter((e=>m[e].length)).sort().map((e=>w({key:e,onClick:()=>B(e),className:"flex vend"},E({name:e}),f(e)))),p.filter((e=>e.icons&&e.icons.length)).map((e=>w({key:e.id,onClick:()=>S(e),className:"flex vend",preventClose:!0},E({icons:e.icons}),e.name)))))}),k);