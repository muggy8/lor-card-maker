!function(t){let e=Object.create(App.baseBuilderController);e.cardId="";let n=e.card={};(e.clearCard=function(){n.name="",n.clan="",n.effect="",n.effectHeight=0,n.keywords=[],n.mana=0,n.art="",n.transform={x:0,y:0,scale:1},n.power=0,n.health=0,n.faction=[],n.blueWords=[],n.orangeWords=[],n.effectFontSize=34,e.exporting=!1})();e.createPreview=function(t){let n=t||e.card;n.effectFontSize=34;let a=n.keywords.length>1?n.keywords.map(t=>createMiniKeyword("./assets/symbol/"+cardOptionsData.icons[t])):n.keywords.map(t=>createWideKeyword(t,"./assets/symbol/"+cardOptionsData.icons[t]));if(a.lenght<=0)a="";else if(1===a.lenght)a=`\n\t\t\t<gtransform="translate(${340-a[0].width/2}, 565)">\n\t\t\t\t${a[0].content}\n\t\t\t</g>`;else{let t=340-a.reduce((t,e)=>t+e.width,0)/2,e=0;a=a.reduce((n,a)=>{let r=n+`\n\t\t\t\t\t<g transform="translate(${t+e}, 565)">\n\t\t\t\t\t\t${a.content}\n\t\t\t\t\t</g>`;return e+=a.width,r},"")}let r=`\n\t\t\t<svg\n\t\t\t\twidth="680" height="1024"\n\t\t\t\txmlns="http://www.w3.org/2000/svg"\n\t\t\t\tviewbox="0 0 680 1024"\n\t\t\t\tclass="{:this.app.cardInstance = this:}"\n\t\t\t>\n\n\t\t\t\t<clipPath id="art-mask">\n\t\t\t\t\t<path\n\t\t\t\t\t\td="\n\t\t\t\t\t\t\tM 25, 50\n\t\t\t\t\t\t\th 630\n\t\t\t\t\t\t\tv 900\n\t\t\t\t\t\t\tl -315, 15\n\t\t\t\t\t\t\tl -315, -15\n\t\t\t\t\t\t\tZ\n\t\t\t\t\t\t"\n\t\t\t\t\t/>\n\t\t\t\t</clipPath>\n\n\t\t\t\t${n.art?`\n\t\t\t\t\t<image\n\t\t\t\t\t\tid="card-art"\n\t\t\t\t\t\tclip-path="url(#art-mask)"\n\t\t\t\t\t\txlink:href="${n.art}"\n\t\t\t\t\t\tx="{:this.app.card.transform.x:}|{card.transform.x}|"\n\t\t\t\t\t\ty="{:this.app.card.transform.y:}|{card.transform.y}|"\n\t\t\t\t\t\tpreserveAspectRatio="xMidYMid meet"\n\t\t\t\t\t\twidth="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|"\n\t\t\t\t\t\theight="{:1024 * this.app.card.transform.scale:}|{card.transform.scale}|"\n\t\t\t\t\t/>`:""}\n\n\t\t\t\t<image id="card-frame" width="680" height="1024" x="0" y="0" xlink:href="./assets/champion/frame2.png"/>\n\n\t\t\t\t${n.faction.length?`\n\t\t\t\t\t<image id="card-region-box" width="120" height="360" x="557" y="37" href="./assets/regions/champion2/regionbox${n.faction.length<3?n.faction.length:3}.png"/>\n\t\t\t\t\t<image id="card-region-1" width="90" height="90" x="574" y="66" href="./assets/regions/${n.faction[0]}.png"/>`:""}\n\n\t\t\t\t${n.faction.length>1?`<image id="card-region-1" width="90" height="90" x="574" y="156" href="./assets/regions/${n.faction[1]}.png"/>`:""}\n\n\t\t\t\t${n.faction.length>2?`<image id="card-region-1" width="90" height="90" x="574" y="246" href="./assets/regions/${n.faction[2]}.png"/>`:""}\n\n\t\t\t\t${n.clan?`\n\t\t\t\t\t\t<image id="card-clan" width="360" height="84" x="160" y="14" xlink:href="./assets/champion/typing.png"/>\n\t\t\t\t\t\t<rect id="clan-text-area" width="200" height="46" x="240" y="32" opacity="0"/>\n\t\t\t\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff">${n.clan}</text>`:""}\n\n\t\t\t\t<rect id="mana-cost" width="120" height="120" x="31" y="44" opacity="0"/>\n\t\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.mana}</text>\n\n\t\t\t\t<rect id="power" width="86" height="82" x="44" y="873" opacity="0"/>\n\t\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.power}</text>\n\n\t\t\t\t<rect id="health" width="86" height="82" x="552" y="873" opacity="0"/>\n\t\t\t\t<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.health}</text>\n\n\t\t\t\t<g id="group-moveable" transform="translate(0, {: 192 - this.app.card.effectHeight > 0 ? 192 - this.app.card.effectHeight : 0:}|{card.effectHeight}|)">\n\t\t\t\t\t<foreignObject style="background-color: rgba(0,0,0,0);" id="effect" width="550" height="192" x="60" y="660">\n\t\t\t\t\t\t<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app.effectResize(this)).then(()=>this.app.card.effectHeight = this.scrollHeight):}">${e.decorateText(n.effect)}</div>\n\t\t\t\t\t</foreignObject>\n\n\t\t\t\t\t\x3c!--<rect id="keywords" width="560" height="70" fill="#CFF" x="60" y="590" opacity="0.75"/>--\x3e\n\t\t\t\t\t${a}\n\n\t\t\t\t\t<rect id="name" width="560" height="70" x="60" y="${n.keywords.length?515:585}" opacity="0"/>\n\t\t\t\t\t${n.name?`<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${n.name?n.name.toUpperCase():""}</text>`:""}\n\t\t\t\t</g>\n\n\t\t\t\t<g class="{:!this.app.card.art || this.app.exporting ? 'hide' : '' :}|{card.art},{exporting}|">\n\t\t\t\t\t<path d="\n\t\t\t\t\t\tM 340, 10\n\t\t\t\t\t\tl 35, 60\n\t\t\t\t\t\th -70\n\t\t\t\t\t\tZ\n\t\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-up" onclick="this.app.card.transform.y -= 10" class="clickable" />\n\t\t\t\t\t<path d="\n\t\t\t\t\t\tM 340, 980\n\t\t\t\t\t\tl 35, -60\n\t\t\t\t\t\th -70\n\t\t\t\t\t\tZ\n\t\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-down" onclick="this.app.card.transform.y += 10" class="clickable" />\n\t\t\t\t\t<path d="\n\t\t\t\t\t\tM 0, 550\n\t\t\t\t\t\tl 60, -35\n\t\t\t\t\t\tv 70\n\t\t\t\t\t\tZ\n\t\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-left" onclick="this.app.card.transform.x -= 10" class="clickable" />\n\t\t\t\t\t<path d="\n\t\t\t\t\t\tM 680, 550\n\t\t\t\t\t\tl -60, -35\n\t\t\t\t\t\tv 70\n\t\t\t\t\t\tZ\n\t\t\t\t\t" fill="#fff" opacity="0.8" id="arrow-right" onclick="this.app.card.transform.x += 10" class="clickable" />\n\n\t\t\t\t\t<text font-size="156" x="180" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale += 0.05">+</text>\n\t\t\t\t\t<text font-size="156" x="440" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale -= 0.05">-</text>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t`;return proxymity(r,e)};App.championLv2Builder=e;let a=proxymity('\n\t<main class="flex hcenter gutter-rl-.5">\n\t\t<div class="card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">\n\t\t\t{:this.app.createPreview():}|{card.name},{card.effect},{card.keywords.length},{card.mana},{card.art},{card.transform.x},{card.transform.y},{card.transform.scale},{card.faction.length},{card.clan},{card.blueWords.*},{card.orangeWords.*},{card.power},{card.health}|\n\n\t\t\t<div class="flex hcenter gutter-tb">\n\t\t\t\t<button onclick="this.app.exportCard()">Export</button>\n\t\t\t\t<div class="gutter-rl"></div>\n\t\t\t\t<button onclick="this.app.saveCard()">Save Card</button>\n\t\t\t\t<div class="gutter-rl"></div>\n\t\t\t\t<button onclick="this.app.deleteCard()" class="{:this.app.cardId ? \'\' : \'hide\':}|{cardId}|">Delete Card</button>\n\t\t\t</div>\n\n\t\t\t<div class="gutter-b-3"></div>\n\t\t</div>\n\t\t<div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">\n\t\t\t{:this.app.cardOptionsController = App.cardOptions(this.app.card):}\n\t\t</div>\n\t</main>\n',e);e.focus=e.focusFactory(a,"championLv2Builder","Champion Lv2 Builder")}();