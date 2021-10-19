function createMiniKeyword(t){let e=` <image class="keyword-frame" width="120" height="100" x="0" y="0" xlink:href="./assets/keyword/keywordmini.png"/> <image class="keyword-icon" width="45" height="45" x="18" y="12" xlink:href="${t}" transform="scale(1.5)"/>`;return{width:120,height:100,content:e,svg:` <svg width="120" height="100" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 100" xmlns:xlink="http://www.w3.org/1999/xlink" >${e}</svg>`}}function createWideKeyword(t,e){t=t.toUpperCase();let i=e?55:0;for(let e=0;e<t.length;i+=createMiniKeyword.textSizeMap[t[e++]]||0);i=Math.ceil(i);let n=203,r="";for(let t=0;i>n&&t<20;t++)if(i>n+63)r+=`<image id="card-frame-m-extention" width="63" height="104" x="${n+28}" y="0" xlink:href="./assets/keyword/keywordmiddleextend.png"/>`,n+=63;else{let t=i-n;r+=`<image id="card-frame-m-extention" width="${t}" height="104" x="${n+28}" y="0" xlink:href="./assets/keyword/keywordmiddleextend.png" preserveAspectRatio="xMidYMin slice"/>`,n+=t}let d=15;i<n?(d=28+n/2-i/2,e&&(d-=20)):e||(d=28);let h=` <image id="card-frame-r" width="28" height="104" x="0" y="0" xlink:href="./assets/keyword/keywordleft.png"/> <image id="card-frame-m" width="203" height="104" x="28" y="0" xlink:href="./assets/keyword/keywordmiddle.png"/> ${r} <image id="card-frame-r" width="28" height="104" x="${n+28}" y="0" xlink:href="./assets/keyword/keywordright.png"/> ${e?(d+=65,`<image id="keyword-icon" width="40" height="40" x="${d-65}" y="17" xlink:href="${e}" transform="scale(1.5)"/>`):""} <text y="70" x="${d}" stroke="#EDCB75" fill="#EDCB75" font-size="48" class="key-text">${t}</text>`;return{width:n+28+28,height:100,content:h,svg:` <svg width="${n+28+28}" height="100" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 ${n+28+28} 100" xmlns:xlink="http://www.w3.org/1999/xlink" >${h}</svg>`}}createMiniKeyword.textSizeMap={"'":15.066666603088379," ":17.983333587646484,A:36,B:30.66666603088379,C:30.66666603088379,D:34.849998474121094,E:26.299999237060547,F:24.383333206176758,G:33.21666717529297,H:35.56666564941406,I:15.066666603088379,J:17.983333587646484,K:34,L:26.116666793823242,M:42.20000076293945,N:34.70000076293945,O:36.099998474121094,P:28.133333206176758,Q:38,R:30.616666793823242,S:25.91666603088379,T:31.100000381469727,U:33.5,V:35.41666793823242,W:50,X:34,Y:33,Z:29.183332443237305," ":0};