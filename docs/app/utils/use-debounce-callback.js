import{useCallback,useRef}from"/cdn/react";export default function useCallbackDebounce(e,t,u){const c=useRef(e);c.current=e;const n=useRef();return useCallback((function(...e){clearTimeout(n.current),n.current=setTimeout((function(){Function.prototype.apply.call(c.current,void 0,e)}),t)}),u)}