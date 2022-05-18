!function(t){let e=Object.create(App.baseBuilderController);e.attached=!1,e.cardId="";e.card={},e.clearCard=function(){let t=this,e=t.card=t.card||{};t.cardId="",t.exporting=!1,e.name="",e.effect="",e.transform={x:0,y:0,scale:1},e.blueWords=[],e.orangeWords=[],e.effectFontSize=34,e.frameType=0};e.clearCard();e.contentValues={frame0:{nameY:146,effectY:210},frame1:{nameY:126,effectY:190},frame2:{nameY:106,effectY:170},frame3:{nameY:86,effectY:150},frame4:{nameY:66,effectY:130},frame5:{nameY:46,effectY:110}};e.resetText=function(t){let e=new Text(t.textContent);t.replaceChildren(e),t.removeAttribute("x"),t.removeAttribute("y"),t.removeAttribute("transform"),t.removeAttribute("style"),t.removeAttribute("text-anchor")},e.createPreview=function(t){let e=this,r=t||e.card;r.effectFontSize=34;let a=`\n        <svg\n            width="524" height="373"\n            xmlns="http://www.w3.org/2000/svg"\n            viewbox="0 0 524 373"\n        >\n            <image id="frame-bg-${e.cardId}" width="524" height="373" x="0" y="0" href="./assets/keyword/frame{:this.app.card.frameType:}|{card.frameType}|.png"/>\n            <rect id="name-text-area-${e.cardId}" width="450" height="56" x="37" y="{:this.app.contentValues['frame' + this.app.card.frameType].nameY:}|{card.frameType}|" fill="#FFF" opacity="0"/>\n            ${r.name?`<text class="{:this.app.resetText(this); proxymity.on.renderend.then(()=>this.app.wrapText(this, true)).catch(()=>{}):}|{card.frameType}|" font-size="36" fill="#fad65a" stroke="#fad65a" font-style="900">${r.name?r.name.toUpperCase():""}</text>`:""}\n\n            <foreignObject style="background-color: rgba(0,0,0,0);" id="effect-${e.cardId}" width="450" height="210" x="37" y="{:this.app.contentValues['frame' + this.app.card.frameType].effectY:}|{card.frameType}|"> <div xmlns="http://www.w3.org/1999/xhtml"  class="key-text" style="font-size:{:this.app.card.effectFontSize:}|{card.effectFontSize}|px; text-align: center; overflow: hidden; max-height: 100%; color: #fff" data-init="{:proxymity.on.renderend.then(()=>this.app && this.app.effectResize(this)).then(()=>this.app && this.app.reselectFrame(this)):}">${e.decorateText(r.effect)}</div> </foreignObject>\n\n            <rect id="artist-area-${e.cardId}" width="220" height="30" fill="#FFF" x="20" y="350" opacity="0"/>\n            ${r.artist?`<text class="{:proxymity.on.renderend.then(()=>this.app.wrapText(this, true, {align:'left'})).catch(()=>{}):}" font-size="36" fill="#fff" stroke="#fff" font-style="900">✍: ${r.artist?r.artist:""}</text>`:""}\n        </svg>\n        `,n=proxymity(a,e);return n.when.detach((function(){n.unlink()})),n},e.reselectFrame=function(t){let e=this;if(t.isConnected)return new Promise(r=>setTimeout((function(){e.card.frameType=Math.floor(t.scrollHeight/e.card.effectFontSize),e.card.frameType>5&&(e.card.frameType=5),r()}),1))};e.saveCard=async function(){let t=this;t.cardId=await App.storage.saveKeyword(t.card,t.cardId)},e.deleteCard=async function(){await App.storage.delSavedKeyword(this.cardId),window.location.reload()};App.keywordBuilder=e;let r=proxymity('\n    <main class="flex hcenter gutter-rl-.5"> <div class="card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3"> {:this.app.attached && this.app.createPreview():}|{card.name},{card.effect},{card.blueWords.*},{card.orangeWords.*},{attached}| <div class="flex hcenter gutter-tb"> <button onclick="this.app.deleteCard()" class="{:this.app.cardId ? \'\' : \'hide\':}|{cardId}|">Delete Keyword</button> <div class="gutter-rl"></div> <button onclick="this.app.saveCard()">Save Keyword</button> <div class="gutter-rl"></div> <button onclick="this.app.exportCard()">Export</button> </div> <div class="gutter-b-3"></div> </div> <div class="card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3"> {:this.app.cardOptionsController = App.cardOptions(this.app.card):} </div> </main>\n',e);e.focus=e.focusFactory(r,"keywordBuilder","keyword Builder")}();