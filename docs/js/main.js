const App=function(){let e={currentView:void 0};proxymity(document.body,e);return window.addEventListener("popstate",(function(e){let o=e.state;o.focus&&App[o.focus].focus()})),"serviceWorker"in navigator&&(e.swReady=navigator.serviceWorker.register("./service-worker.js",{scope:document.location.pathname}).then((function(e){console.log("Registration successful, scope is:",e.scope)})).catch((function(e){console.log("Service worker registration failed, error:",e)}))),e}();