!function(t){let e={},n=(e.focus=function(){iconCache.promise.then(()=>{App.currentView=r,a(),window.scroll(0,0)})},e.card={}),a=e.clearCard=function(){n.name="",n.clan="",n.effect="",n.effectHeight=0,n.keywords=[],n.mana=0,n.art="",n.transform={x:0,y:0,scale:1},n.power=0,n.health=0,n.faction="",n.blueWords=[],n.orangeWords=[],n.effectFontSize=34,e.exporting=!1};a();e.createPreview=function(){let t=n.keywords.length>1?n.keywords.map(t=>createMiniKeyword("/assets/symbol/"+cardOptionsData.icons[t])):n.keywords.map(t=>createWideKeyword(t,"/assets/symbol/"+cardOptionsData.icons[t]));if(t.lenght<=0)t="";else if(1===t.lenght)t=`\n\t\t\t<gtransform="translate(${340-t[0].width/2}, 565)">\n\t\t\t\t${t[0].content}\n\t\t\t</g>`;else{let e=340-t.reduce((t,e)=>t+e.width,0)/2,n=0;t=t.reduce((t,a)=>{let r=t+`\n\t\t\t\t\t<g transform="translate(${e+n}, 565)">\n\t\t\t\t\t\t${a.content}\n\t\t\t\t\t</g>`;return n+=a.width,r},"")}let a=n.blueWords.reduce((t,e)=>e?t.split(e).join(`<span style="color: #49a0f8" xmlns="http://www.w3.org/1999/xhtml">${e}</span>`):t,n.effect);a=n.orangeWords.reduce((t,e)=>e?t.split(e).join(`<span style="color: #fad65a" xmlns="http://www.w3.org/1999/xhtml">${e}</span>`):t,a),Object.keys(cardOptionsData.icons).forEach(t=>{let e=`<${t}/>`;a=a.split(e).join(`<div xmlns="http://www.w3.org/1999/xhtml" style="height: 0.8em; width: 1em; display:inline-block; background-repeat: no-repeat; background-size: contain; background-image: url('${iconCache[t]}');"></div>`)}),a=a.split("\n").map(t=>`<div>${t}</div>`).join("");let r=`\n\t\t\t<svg\n\t\t\t\twidth="680" height="1024"\n\t\t\t\txmlns="http://www.w3.org/2000/svg"\n\t\t\t\tviewbox="0 0 680 1024"\n\t\t\t\tclass="{:this.app.cardInstance = this:}"\n\t\t\t>\n\n\t\t\t\t<clipPath id="art-mask">\n\t\t\t\t\t<path\n\t\t\t\t\t\td="\n\t\t\t\t\t\t\tM 25, 50\n\t\t\t\t\t\t\th 630\n\t\t\t\t\t\t\tv 900\n\t\t\t\t\t\t\tl -315, 15\n\t\t\t\t\t\t\tl -315, -15\n\t\t\t\t\t\t\tZ\n\t\t\t\t\t\t"\n\t\t\t\t\t/>\n\t\t\t\t</clipPath>\n\n\t\t\t\t${n.art?`\n\t\t\t\t\t<image\n\t\t\t\t\t\tid="card-art"\n\t\t\t\t\t\tclip-path="url(#art-mask)"\n\t\t\t\t\t\txlink:href="${n.art}"\n\t\t\t\t\t\tx="{:this.app.card.transform.x:}|{card.transform.x}|"\n\t\t\t\t\t\ty="{:this.app.card.transform.y:}|{card.transform.y}|"\n\t\t\t\t\t\tpreserveAspectRatio="xMidYMid meet"\n\t\t\t\t\t\twidth="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"\n\t\t\t\t\t\theight="{:1024 * this.app.card.transform.scale:}|{card.transform.scale}|"\n\t\t\t\t\t/>`:""}\n\n\t\t\t\t<image id="card-frame" width="680" height="1024" x="0" y="0" xlink:href="/assets/champion/frame2.png"/>\n\n\t\t\t\t${n.faction?`<image id="card-region" width="100" height="100" x="290" y="864" xlink:href="/assets/regions/${n.faction}.png"/>`:""}\n\n\t\t\t\t${n.clan?`\n\t\t\t\t\t\t<image id="card-clan" width="360" height="84" x="160" y="14" xlink:href="/assets/champion/typing.png"/>\n\t\t\t\t\t\t<rect id="clan-text-area" width="200" height="46" x="240" y="32" opacity="0"/>\n\t\t\t\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff">${n.clan}</text>`:""}\n\n\t\t\t\t<rect id="mana-cost" width="120" height="120" x="31" y="44" opacity="0"/>\n\t\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.mana}</text>\n\n\t\t\t\t<rect id="power" width="86" height="82" x="44" y="873" opacity="0"/>\n\t\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.power}</text>\n\n\t\t\t\t<rect id="health" width="86" height="82" x="552" y="873" opacity="0"/>\n\t\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.health}</text>\n\n\t\t\t\t<g id="group-moveable" transform="translate(0, {: 192 - this.app.card.effectHeight > 0 ? 192 - this.app.card.effectHeight : 0:}|{card.effectHeight}|)">\n\t\t\t\t\t<foreignObject id="effect" width="550" height="192" x="60" y="660">\n\t\t\t\t\t\t<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app.effectResize(this)).then(()=>this.app.card.effectHeight = this.scrollHeight):}">${a}</div>\n\t\t\t\t\t</foreignObject>\n\n\t\t\t\t\t\x3c!--<rect id="keywords" width="560" height="70" fill="#CFF" x="60" y="590" opacity="0.75"/>--\x3e\n\t\t\t\t\t${t}\n\n\t\t\t\t\t<rect id="name" width="560" height="70" x="60" y="${n.keywords.length?515:585}" opacity="0"/>\n\t\t\t\t\t${n.name?`<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${n.name?n.name.toUpperCase():""}</text>`:""}\n\t\t\t\t</g>\n\n\t\t\t\t<g class="{:!this.app.card.art || this.app.exporting ? 'hide' : '' :}|{card.art},{exporting}|">\n\t\t\t\t\t<path d="\n\t\t\t\t\t\tM 340, 10\n\t\t\t\t\t\tl 35, 60\n\t\t\t\t\t\th -70\n\t\t\t\t\t\tZ\n\t\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-up" onclick="this.app.card.transform.y -= 10" class="clickable" />\n\t\t\t\t\t<path d="\n\t\t\t\t\t\tM 340, 980\n\t\t\t\t\t\tl 35, -60\n\t\t\t\t\t\th -70\n\t\t\t\t\t\tZ\n\t\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-down" onclick="this.app.card.transform.y += 10" class="clickable" />\n\t\t\t\t\t<path d="\n\t\t\t\t\t\tM 0, 550\n\t\t\t\t\t\tl 60, -35\n\t\t\t\t\t\tv 70\n\t\t\t\t\t\tZ\n\t\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-left" onclick="this.app.card.transform.x -= 10" class="clickable" />\n\t\t\t\t\t<path d="\n\t\t\t\t\t\tM 680, 550\n\t\t\t\t\t\tl -60, -35\n\t\t\t\t\t\tv 70\n\t\t\t\t\t\tZ\n\t\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-right" onclick="this.app.card.transform.x += 10" class="clickable" />\n\n\t\t\t\t\t<text font-size="156" x="180" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale += 0.05">+</text>\n\t\t\t\t\t<text font-size="156" x="440" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale -= 0.05">-</text>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t`;return proxymity(r,e)},e.wrapText=function(t,e,n={}){let a=d3plus.textwrap().container(d3.select(t)).resize(!!e);n.align?a.align(n.align):a.align("middle"),n.valign&&a.valign(n.valign),n.shape&&a.shape(n.shape),n.size&&a.size(n.size),a.draw()},e.effectResize=async function(t){let e=t.offsetHeight;for(;t.scrollHeight>e&&n.effectFontSize>24;)n.effectFontSize--,await proxymity.on.renderend},e.exportCard=async function(){let t=Array.from(e.cardInstance.querySelectorAll("image")).map(t=>getBase64FromImageUrl(t.href.baseVal).then(e=>t.setAttribute("xlink:href",e)));e.exporting=!0,t.push(proxymity.on.renderend),await Promise.all(t),e.cardInstance.querySelectorAll("foreignObject *").forEach(t=>t.removeAttribute("xmlns")),await saveSvgAsPng(e.cardInstance,(n.name||"lor-card")+".png"),e.exporting=!1};App.championLv2Builder=e;let r=proxymity('\n\t<main class="flex hcenter gutter-rl-.5">\n\t\t<div class="card-preview gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">\n\t\t\t{:this.app.createPreview():}|{card.name},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.transform.x},{card.transform.y},{card.transform.scale},{card.faction},{card.clan},{card.blueWords.*},{card.orangeWords.*},{card.power},{card.health}|\n\n\t\t\t<div class="flex hcenter gutter-tb">\n\t\t\t\t<button onclick="this.app.exportCard()">Export</button>\n\t\t\t</div>\n\n\t\t\t<div class="gutter-b-3"></div>\n\t\t</div>\n\t\t<div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">\n\t\t\t{:this.app.cardOptionsController = App.cardOptions(this.app.card):}\n\t\t</div>\n\t</main>\n',e)}();