!function(){function e(e){return async function(a,t){let n;try{n=await fetch("./pseudo-api/card-list/"+e).then(e=>e.json())}catch(e){console.error(e),n=[]}let o=n.map((async function(e){try{return!!(await fetch("./pseudo-api/card/"+e).then(e=>e.json())).name&&e}catch(e){return!1}}));n=(await Promise.all(o)).filter(e=>!!e);let i=Date.now().toString();return t||(t=i,n.push(t)),await fetch("./pseudo-api/card-list/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),await fetch("./pseudo-api/card/"+t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}),t}}function a(e){return async function(){let a;try{a=await fetch("./pseudo-api/card-list/"+e).then(e=>e.json())}catch(e){console.error(e),a=[]}return a=await Promise.all(a.map((async function(e){return{id:e,cardData:await fetch("./pseudo-api/card/"+e).then(e=>e.json()).then(e=>("string"==typeof e.faction&&(e.faction=[e.faction]),e))}}))),a.filter(e=>e.cardData.name)}}function t(e){return async function(a){let t;try{t=await fetch("./pseudo-api/card-list/"+e).then(e=>e.json())}catch(e){console.error(e),t=[]}let n=t.indexOf(a);return n>-1&&t.splice(n,1),await fetch("./pseudo-api/card-list/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),await fetch("./pseudo-api/card/"+a,{method:"DEL",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:e})}),!!n}}App.storage={saveFollower:e("follower"),saveChampion1:e("champion1"),saveChampion2:e("champion2"),saveChampion3:e("champion3"),saveLandmark:e("landmark"),saveKeyword:e("keyword"),saveSpell:e("spell"),getSavedFollower:a("follower"),getSavedChampion1:a("champion1"),getSavedChampion2:a("champion2"),getSavedChampion3:a("champion3"),getSavedLandmark:a("landmark"),getSavedKeyworkd:a("keyword"),getSavedSpell:a("spell"),delSavedFollower:t("follower"),delSavedChampion1:t("champion1"),delSavedChampion2:t("champion2"),delSavedChampion3:t("champion3"),delSavedLandmark:t("landmark"),delSavedKeyword:t("keyword"),delSavedSpell:t("spell")}}();