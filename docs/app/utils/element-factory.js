import React,{useEffect,useState}from"/cdn/react";const debugRender=!1;function factory(e,t){return function(){let n=arguments,r=n[0],o={},c=Array.prototype.slice.call(n,1);if(React.isValidElement(r)||"object"!=typeof r||Array.isArray(r)?c=Array.prototype.slice.call(n,0):o=r,t){let n={component:e,componentProps:o,componentChildren:c,waitFor:t};return void 0!==o.key&&(n.key=o.key,delete o.key),React.createElement(DeferRenderComponent,n)}return React.createElement.apply(React,[e,o,...c])}}function DeferRenderComponent(e){const[t,n]=useState(!1);if(useEffect(()=>{e.waitFor.then(()=>n(!0))},[]),!t)return null;const{component:r,componentProps:o,componentChildren:c}=e;return React.createElement.apply(React,[r,o,...c])}export const DeferRender=factory(DeferRenderComponent);export default factory;