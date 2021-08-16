!function(t){let e={},n=(e.focus=function(){return iconCache.promise.then(()=>{e.cardOptionsController.app.mbShowConfigs=!1,App.currentView!==r&&(App.currentView=r,a(),window.scroll(0,0),history.pushState({focus:"spellBuilder"},"Spell Builder"))})},e.card={}),a=e.clearCard=function(){n.name="",n.effect="",n.keywords=[],n.mana=0,n.art="",n.transform={x:0,y:0,scale:1},n.rarity="none",n.speed="slow",n.faction="",n.blueWords=[],n.orangeWords=[],n.effectFontSize=34,e.exporting=!1};a();e.createPreview=function(t){let n=t||e.card;n.effectFontSize=34;let a=n.keywords.length>1?n.keywords.map(t=>createMiniKeyword("./assets/symbol/"+cardOptionsData.icons[t])):n.keywords.map(t=>createWideKeyword(t,"./assets/symbol/"+cardOptionsData.icons[t]));if(a.lenght<=0)a="";else if(1===a.lenght)a=`\n\t\t\t<gtransform="translate(${340-a[0].width/2}, 635)">\n\t\t\t\t${a[0].content}\n\t\t\t</g>`;else{let t=340-a.reduce((t,e)=>t+e.width,0)/2,e=0;a=a.reduce((n,a)=>{let r=n+`\n\t\t\t\t\t<g transform="translate(${t+e}, 635)">\n\t\t\t\t\t\t${a.content}\n\t\t\t\t\t</g>`;return e+=a.width,r},"")}let r=n.effect;Object.keys(cardOptionsData.icons).forEach(t=>{let e=`<${t}/>`;r=r.split(e).join(`<div xmlns="http://www.w3.org/1999/xhtml" style="height: 1.2em; width: 1.2em; display:inline-block; background-repeat: no-repeat; background-size: contain; background-image: url('${iconCache[t]}');vertical-align: middle;"></div>`)}),r=n.blueWords.reduce((t,e)=>e?t.split(e).join(`<span style="color: #49a0f8" xmlns="http://www.w3.org/1999/xhtml">${e}</span>`):t,r),r=n.orangeWords.reduce((t,e)=>e?t.split(e).join(`<span style="color: #fad65a" xmlns="http://www.w3.org/1999/xhtml">${e}</span>`):t,r),r=r.split("\n").map(t=>`<div>${t}</div>`).join("");let i=`\n\t\t<svg\n\t\t\twidth="680" height="1024"\n\t\t\txmlns="http://www.w3.org/2000/svg"\n\t\t\tviewbox="0 0 680 1024"\n\t\t\tclass="{:this.app.cardInstance = this:}"\n\t\t>\n\t\t\t<clipPath id="art-mask">\n\t\t\t\t<ellipse rx="240" ry="240" cx="340" cy="294"/>\n\t\t\t</clipPath>\n\n\t\t\t${n.art?`\n\t\t\t\t<image\n\t\t\t\t\tid="card-art"\n\t\t\t\t\tclip-path="url(#art-mask)"\n\t\t\t\t\txlink:href="${n.art}"\n\t\t\t\t\tx="{:this.app.card.transform.x:}|{card.transform.x}|"\n\t\t\t\t\ty="{:this.app.card.transform.y:}|{card.transform.y}|"\n\t\t\t\t\tpreserveAspectRatio="xMidYMid meet"\n\t\t\t\t\twidth="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"\n\t\t\t\t\theight="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"\n\t\t\t\t/>`:""}\n\n\t\t\t<image id="card-background" width="634" height="470" x="23" y="463" xlink:href="./assets/spell/background-inverted.png"/>\n\t\t\t${n.faction?`<image id="card-region" width="100" height="100" x="285" y="836" xlink:href="./assets/regions/${n.faction}.png"/>`:""}\n\t\t\t<image id="card-frame" width="680" height="1024" x="0" y="0" xlink:href="./assets/spell/frame${n.speed}${n.rarity}.png"/>\n\n\t\t\t<rect id="mana-cost" width="120" height="120" x="31" y="44" opacity="0"/>\n\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.mana}</text>\n\n\t\t\t<rect id="name" width="550" height="70" x="60" y="585" opacity="0"/>\n\t\t\t${n.name?`<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${n.name?n.name.toUpperCase():""}</text>`:""}\n\n\t\t\t\x3c!-- <rect id="keywords" width="550" height="70" fill="#CFF" x="60" y="655" opacity="0.75"/> --\x3e\n\t\t\t${a}\n\n\t\t\t<foreignObject style="background-color: rgba(0,0,0,0);" id="effect" width="550" height="145" x="60" y="740">\n\t\t\t\t<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app.effectResize(this)):}">${r}</div>\n\t\t\t</foreignObject>\n\n\t\t\t<g class="{:!this.app.card.art || this.app.exporting ? 'hide' : '' :}|{card.art},{exporting}|">\n\t\t\t\t<path d="\n\t\t\t\t\tM 340, 10\n\t\t\t\t\tl 35, 60\n\t\t\t\t\th -70\n\t\t\t\t\tZ\n\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-up" onclick="this.app.card.transform.y -= 10" class="clickable" />\n\t\t\t\t<path d="\n\t\t\t\t\tM 340, 575\n\t\t\t\t\tl 35, -60\n\t\t\t\t\th -70\n\t\t\t\t\tZ\n\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-down" onclick="this.app.card.transform.y += 10" class="clickable" />\n\t\t\t\t<path d="\n\t\t\t\t\tM 55, 300\n\t\t\t\t\tl 60, -35\n\t\t\t\t\tv 70\n\t\t\t\t\tZ\n\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-left" onclick="this.app.card.transform.x -= 10" class="clickable" />\n\t\t\t\t<path d="\n\t\t\t\t\tM 625, 300\n\t\t\t\t\tl -60, -35\n\t\t\t\t\tv 70\n\t\t\t\t\tZ\n\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-right" onclick="this.app.card.transform.x += 10" class="clickable" />\n\n\t\t\t\t<text font-size="156" x="180" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale += 0.05">+</text>\n\t\t\t\t<text font-size="156" x="440" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale -= 0.05">-</text>\n\t\t\t</g>\n\n\t\t</svg>`;return proxymity(i,e)},e.wrapText=function(t,e,n={}){let a=d3plus.textwrap().container(d3.select(t)).resize(!!e);n.align?a.align(n.align):a.align("middle"),n.valign&&a.valign(n.valign),n.shape&&a.shape(n.shape),n.size&&a.size(n.size),a.draw()},e.effectResize=async function(t){let e=t.offsetHeight;for(;t.scrollHeight>e&&n.effectFontSize>24;)n.effectFontSize--,await proxymity.on.renderend},e.exportCard=async function(){let t=Array.from(e.cardInstance.querySelectorAll("image")).map(t=>getBase64FromImageUrl(t.href.baseVal).then(e=>t.setAttribute("xlink:href",e)));e.exporting=!0,t.push(proxymity.on.renderend),await Promise.all(t),e.cardInstance.querySelectorAll("foreignObject *").forEach(t=>t.removeAttribute("xmlns")),await saveSvgAsPng(e.cardInstance,(n.name||"lor-card")+".png",{width:680,height:1024,scale:1/(window.devicePixelRatio||1)}),e.exporting=!1};e.cardId="";e.saveCard=function(){e.cardId=App.storage.saveSpell(e.card,e.cardId)},e.deleteCard=function(){App.storage.delSavedSpell(e.cardId),window.location.reload()};App.spellBuilder=e;let r=proxymity('\n\t<main class="flex hcenter gutter-rl-.5">\n\t\t<div class="card-preview gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">\n\t\t\t{:this.app.createPreview():}|{card.name},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.transform.x},{card.transform.y},{card.transform.scale},{card.rarity},{card.faction},{card.speed},{card.blueWords.*},{card.orangeWords.*}|\n\n\t\t\t<div class="flex hcenter gutter-tb">\n\t\t\t\t<button onclick="this.app.exportCard()">Export</button>\n\t\t\t\t<div class="gutter-rl"></div>\n\t\t\t\t<button onclick="this.app.saveCard()">Save Card</button>\n\t\t\t\t<div class="gutter-rl"></div>\n\t\t\t\t<button onclick="this.app.deleteCard()" class="{:this.app.cardId ? \'\' : \'hide\':}|{cardId}|">Delete Card</button>\n\t\t\t</div>\n\n\t\t\t<div class="gutter-b-3"></div>\n\t\t</div>\n\t\t<div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">\n\t\t\t{:this.app.cardOptionsController = App.cardOptions(this.app.card, [\n\t\t\t\t"none",\n\t\t\t\t"common",\n\t\t\t\t"rare",\n\t\t\t\t"epic"\n\t\t\t]):}\n\t\t</div>\n\t</main>\n',e)}();