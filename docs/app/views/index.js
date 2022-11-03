import{useState,useCallback,useEffect,useRef,createContext,createElement}from"/cdn/react";import factory,{section}from"/Utils/elements.js";import List from"/Views/list.js";import{BannerBar,SideBar}from"/Components/index.js";import{getSettings,saveSettings}from"/Utils/service.js";export const Globals=createContext({lang:"en",card:null});export let navigationHistory=[];function App(t){const[e,n]=useState({lang:"en",view:List,defaultBg:!0,settings:{}});let s={...e};const r=useCallback(t=>{let r={...s,...t};Object.keys(r).forEach(t=>{void 0===r[t]&&delete r[t]}),s=r;Object.keys(r).map(t=>r[t]!==e[t]).reduce((t,e)=>t||e,!1)&&n(r)},[e,n]);useEffect(()=>{getSettings().then(t=>r({settings:t}))},[]);const i=useCallback(t=>{const n={...e.settings,...t};r({settings:n}),saveSettings(n)},[e.settings,r]),o=useRef();useEffect(()=>{o.current=r},[r]);const a=useRef(()=>!0);useEffect(()=>{navigationHistory.push(e.view);const t=function(t){if(!1===a.current())return t.preventDefault(),t.stopPropagation(),void history.pushState({},"");navigationHistory.splice(-1,1);const n=navigationHistory[navigationHistory.length-1];if(!n)return navigationHistory.push(e.view),o.current({view:List});o.current({view:n})};return window.addEventListener("popstate",t),function(){window.removeEventListener("popstate",t)}},[]);const c=useCallback(t=>{o.current({view:t}),history.pushState({},""),navigationHistory.push(t)},[]);return useEffect(()=>{if(!t.root)return;const n=(e.bannerHeight||0)+"px";t.root.style.setProperty("padding-top",n),t.root.style.setProperty("--banner-height",n)},[e.bannerHeight,t.root]),createElement(Globals.Provider,{value:{state:e,setState:n,patchState:r,setView:c,patchSettings:i,allowBack:a.current,setAllowBack:t=>{a.current=t}}},BannerBar(),SideBar(),e.view())}export default factory(App);