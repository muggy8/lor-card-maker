!function(t){let e=App.unitController=Object.create(App.baseBuilderController);e.clearCard=function(){let t=this,e=t.card=t.card||{};t.cardId="",e.name="",e.clan="",e.effect="",e.effectHeight=0,e.lvup="",e.lvupHeight=0,e.keywords=[],e.mana=0,e.art="",e.transform={x:0,y:0,scale:1},e.rarity="gemless",e.power=0,e.health=0,e.faction=[],e.blueWords=[],e.orangeWords=[],e.effectFontSize=34,e.levelFontSize=34,t.exporting=!1},e.createPreview=function(t){let e=this,n=t||e.card;n.effectFontSize=34,n.levelFontSize=34;let a=n.keywords.length>1?n.keywords.map(t=>createMiniKeyword("/assets/symbol/"+cardOptionsData.icons[t])):n.keywords.map(t=>createWideKeyword(t,"/assets/symbol/"+cardOptionsData.icons[t]));if(a.lenght<=0)a="";else if(1===a.lenght)a=` <gtransform="translate(${340-a[0].width/2}, 425)"> ${a[0].content} </g>`;else{let t=340-a.reduce((t,e)=>t+e.width,0)/2,e=0;a=a.reduce((n,a)=>{let r=n+` <g transform="translate(${t+e}, 425)"> ${a.content} </g>`;return e+=a.width,r},"")}let r=` <svg width="680" height="1024" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 680 1024" class="{:this.app.cardInstance = this:}" > ${e.artMask} ${n.art?` <image id="card-art" clip-path="url(#art-mask)" xlink:href="${n.art}" x="{:this.app.card.transform.x:}|{card.transform.x}|" y="{:this.app.card.transform.y:}|{card.transform.y}|" preserveAspectRatio="xMidYMid meet" width="{:680 * this.app.card.transform.scale:}|{card.transform.scale}|" height="{:1024 * this.app.card.transform.scale:}|{card.transform.scale}|" />`:""} <image id="art-shade" clip-path="url(#art-mask)" width="680" height="1024" x="0" y="0" xlink:href="/assets/common/theencrouchingdarkness.png"/> <image id="card-frame" width="680" height="1024" x="0" y="0" xlink:href="${e.framePath}${n.rarity}.png"/> ${n.faction.length?` <image id="card-region-box" width="120" height="360" x="557" y="37" href="/assets/regions/champion1/regionbox${n.faction.length<3?n.faction.length:3}.png"/> <image id="card-region-1" width="90" height="90" x="574" y="66" href="/assets/regions/${n.faction[0]}.png"/>`:""} ${n.faction.length>1?`<image id="card-region-1" width="90" height="90" x="574" y="156" href="/assets/regions/${n.faction[1]}.png"/>`:""} ${n.faction.length>2?`<image id="card-region-1" width="90" height="90" x="574" y="246" href="/assets/regions/${n.faction[2]}.png"/>`:""} ${n.clan?` <image id="card-clan" width="360" height="84" x="160" y="14" xlink:href="/assets/champion/typing.png"/> <rect id="clan-text-area" width="200" height="46" x="240" y="32" opacity="0"/> <text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff">${n.clan}</text>`:""} <rect id="mana-cost" width="120" height="120" x="31" y="44" opacity="0"/> <text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.mana}</text> ${Object.prototype.hasOwnProperty.call(n,"power")?`<rect id="power" width="86" height="82" x="44" y="873" opacity="0"/> <text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.power}</text>`:""} ${Object.prototype.hasOwnProperty.call(n,"health")?`<rect id="health" width="86" height="82" x="552" y="873" opacity="0"/> <text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {valign: 'middle'})).catch(()=>{}):}" font-size="50" fill="#fff" stroke="#fff">${n.health}</text>`:""} <g id="all-text-group" transform="translate(0, {: ${!!n.lvup} ? ( 130 - this.app.card.lvupHeight > 0 ? 130 - this.app.card.lvupHeight : 0 ) : 174 :}|{card.lvupHeight}|)"> <foreignObject style="background-color: rgba(0,0,0,0);" id="level-up-condition" width="510" height="130" x="85" y="720"> <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.levelFontSize:}|{card.levelFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #d6946b" data-init="{:proxymity.on.renderend.then(()=>this.app.effectResize(this, 'levelFontSize')).then(()=>this.app.card.lvupHeight = this.scrollHeight):}">${e.decorateText(n.lvup)}</div> </foreignObject> ${n.lvup?'<image id="card-level-bar" width="680" height="44" x="0" y="680" xlink:href="/assets/champion/levelupbar.png"/>':""} <g id="effect-group" transform="translate(0, {: 162 - this.app.card.effectHeight > 0 ? 162 - this.app.card.effectHeight : 0:}|{card.effectHeight}|)"> <foreignObject style="background-color: rgba(0,0,0,0);" id="effect" width="510" height="162" x="85" y="520"> <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app.effectResize(this, 'effectFontSize')).then(()=>this.app.card.effectHeight = this.scrollHeight):}">${e.decorateText(n.effect)}</div> </foreignObject> \x3c!-- <rect id="keywords" width="560" height="70" fill="#CFF" x="60" y="450" opacity="0.75"/> --\x3e ${a} <rect id="name" width="510" height="70" x="85" y="${n.keywords.length?380:450}" opacity="0"/> ${n.name?`<text class="key-text {:proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">${n.name?n.name.toUpperCase():""}</text>`:""} </g> </g> <g class="{:!${!!n.art} || this.app.exporting ? 'hide' : '' :}|{exporting}|"> <path d=" M 340, 10 l 35, 60 h -70 Z " fill="#fff" opacity="0.8" id="arrow-up" onclick="this.app.card.transform.y -= 10" class="clickable" /> <path d=" M 340, 980 l 35, -60 h -70 Z " fill="#fff" opacity="0.8" id="arrow-down" onclick="this.app.card.transform.y += 10" class="clickable" /> <path d=" M 0, 550 l 60, -35 v 70 Z " fill="#fff" opacity="0.8" id="arrow-left" onclick="this.app.card.transform.x -= 10" class="clickable" /> <path d=" M 680, 550 l -60, -35 v 70 Z " fill="#fff" opacity="0.8" id="arrow-right" onclick="this.app.card.transform.x += 10" class="clickable" /> <text font-size="156" x="180" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale += 0.05">+</text> <text font-size="156" x="440" y="345" fill="#fff" stroke="#fff" opacity="0.8" class="clickable" onclick="this.app.card.transform.scale -= 0.05">-</text> </g> </svg>`;return proxymity(r,e)},e.gemOptions=void 0,e.framePath="/assets/champion/frame1",e.template=void 0,e.artMask=' <clipPath id="art-mask"> <path d=" M 25, 50 h 630 v 900 l -315, 15 l -315, -15 Z " /> </clipPath> ',e.generateView=function(){let t=this;t.clearCard();let e=t.card,n=` <main class="flex hcenter"> <div class="card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3">  {:this.app.createPreview():}|${Object.keys(t.generateView.watcherList).map(n=>Object.prototype.hasOwnProperty.call(e,n)?`{${t.generateView.watcherList[n]}}`:null).filter(t=>!!t).join(",")}|  <div class="flex hcenter gutter-tb"> <button onclick="this.app.exportCard()">Export</button> <div class="gutter-rl"></div> <button onclick="this.app.saveCard()">Save Card</button> <div class="gutter-rl"></div> <button onclick="this.app.deleteCard()" class="{:this.app.cardId ? '' : 'hide':}|{cardId}|">Delete Card</button> </div>  <div class="gutter-b-3"></div> </div> <div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3"> {:this.app.cardOptionsController = App.cardOptions(this.app.card, ${JSON.stringify(t.gemOptions)}):} </div> </main> `;return proxymity(n,t)},e.generateView.watcherList={name:"card.name",effect:"card.effect",lvup:"card.lvup",keywords:"card.keywords.length",mana:"card.mana",art:"card.art",rarity:"card.rarity",faction:"card.faction.length",clan:"card.clan",blueWords:"card.blueWords.*",orangeWords:"card.orangeWords.*",power:"card.power",health:"card.health"}}();