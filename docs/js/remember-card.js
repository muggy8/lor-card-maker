!function(){function e(e){return function(a,t){let l=localStorage.getItem(e);l=l?JSON.parse(l):[];let o=Date.now().toString();return t||(l.push(o),t=o),localStorage.setItem(e,JSON.stringify(l)),localStorage.setItem(o,JSON.stringify(a)),t}}function a(e){return function(){let a=localStorage.getItem(e);return a=a?JSON.parse(a):[],a.map((function(e){return{id:e,cardData:JSON.parse(localStorage.getItem(e))}}))}}function t(e){return function(a){let t=localStorage.getItem(e);t=t?JSON.parse(t):[];let l=t.indexOf(a);return l>-1&&t.splice(l,1),localStorage.setItem(e,JSON.stringify(t)),localStorage.removeItem(a),!!l}}App.storage={saveFollower:e("follower"),saveChampion1:e("champion1"),saveChampion2:e("champion2"),saveLandmark:e("landmark"),saveSpell:e("spell"),getSavedFollower:a("follower"),getSavedChampion1:a("champion1"),getSavedChampion2:a("champion2"),getSavedLandmark:a("landmark"),getSavedSpell:a("spell"),delSavedFollower:t("follower"),delSavedChampion1:t("champion1"),delSavedChampion2:t("champion2"),delSavedLandmark:t("landmark"),delSavedSpell:t("spell")}}();