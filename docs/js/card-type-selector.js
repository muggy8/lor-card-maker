!async function(t){let e={attached:!1},n=e.focus=function(){App.currentView!==a&&(App.currentView=a,history.replaceState({focus:"cardTypePicker"},"LoR Card Makern"),App.getSavedCards(e))};e.savedChampions1=[],e.savedChampions2=[],e.savedChampions3=[],e.savedFollowers=[],e.savedLandmarks=[],e.savedSpells=[],e.savedKeywords=[],e.transferData=function(t,e){Object.keys(e).forEach((function(n){t[n]=e[n]}))},App.cardTypePicker=e;let a=proxymity('\n<div class="flex hcenter"> <h2>{:App.lang[App.langChoice].i_want_to_make:}</h2>\n</div>\n<main class="gutter-trbl-.5 flex"> <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter"> <strong>{:App.lang[App.langChoice].champ1:}</strong> <div class="clickable" onclick="App.championLv1Builder.focus()"> <img src="./assets/champion/frame1gemless.png" /> </div> </div> <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter"> <strong>{:App.lang[App.langChoice].champ2:}</strong> <div class="clickable"  onclick="App.championLv2Builder.focus()"> <img src="./assets/champion/frame2gemless.png" /> </div> </div> <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter"> <strong>{:App.lang[App.langChoice].champ3:}</strong> <div class="clickable"  onclick="App.championLv3Builder.focus()"> <img src="./assets/champion/frame3gemless.png" /> </div> </div> <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter"> <strong>{:App.lang[App.langChoice].landmark:}</strong> <div class="clickable"  onclick="App.landmarkBuilder.focus()"> <img src="./assets/landmark/framegemless.png" /> </div> </div> <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter"> <strong>{:App.lang[App.langChoice].spell:}</strong> <div class="clickable"  onclick="App.spellBuilder.focus()"> <img src="./assets/spell/framenone.png" /> </div> </div> <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter"> <strong>{:App.lang[App.langChoice].follower:}</strong> <div class="clickable" onclick="App.followerBuilder.focus()"> <img src="./assets/follower/framegemless.png" /> </div> </div> <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter"> <strong>{:App.lang[App.langChoice].keyword:} {:App.lang[App.langChoice].beta:}</strong> <div class="clickable" onclick="App.keywordBuilder.focus()"> <img src="./assets/keyword/frame5.png" /> </div> </div> <div class="flex hcenter box-12"> <h2>{:App.lang[App.langChoice].i_want_to_edit:}</h2> </div> \x3c!-- forEach: "index" --\x3e \x3c!-- key: function(item, index, whole){ return item.id } --\x3e <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.championLv1Builder.focus().then(_=>{this.app.transferData(App.championLv1Builder.card, this.app.savedChampions1[this.index].cardData); App.championLv1Builder.cardId = this.app.savedChampions1[this.index].id})"> <strong>{:App.lang[App.langChoice].edit:} {: this.app.savedChampions1[this.index].cardData.name :}</strong> <div> {: this.app.attached && App.batchExporter.createPreview( this.app.savedChampions1[this.index].cardData, App.championLv1Builder, this.app.savedChampions1[this.index].id, ) :}|{attached}| </div> </div> \x3c!-- in: savedChampions1 --\x3e \x3c!-- forEach: "index" --\x3e \x3c!-- key: function(item, index, whole){ return item.id } --\x3e <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.championLv2Builder.focus().then(_=>{this.app.transferData(App.championLv2Builder.card, this.app.savedChampions2[this.index].cardData); App.championLv2Builder.cardId = this.app.savedChampions2[this.index].id})"> <strong>{:App.lang[App.langChoice].edit:} {: this.app.savedChampions2[this.index].cardData.name :}</strong> <div> {: this.app.attached && App.batchExporter.createPreview( this.app.savedChampions2[this.index].cardData, App.championLv2Builder, this.app.savedChampions2[this.index].id, ) :}|{attached}| </div> </div> \x3c!-- in: savedChampions2 --\x3e \x3c!-- forEach: "index" --\x3e \x3c!-- key: function(item, index, whole){ return item.id } --\x3e <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.championLv3Builder.focus().then(_=>{this.app.transferData(App.championLv3Builder.card, this.app.savedChampions3[this.index].cardData); App.championLv3Builder.cardId = this.app.savedChampions3[this.index].id})"> <strong>{:App.lang[App.langChoice].edit:} {: this.app.savedChampions3[this.index].cardData.name :}</strong> <div> {: this.app.attached && App.batchExporter.createPreview( this.app.savedChampions3[this.index].cardData, App.championLv3Builder, this.app.savedChampions3[this.index].id, ) :}|{attached}| </div> </div> \x3c!-- in: savedChampions3 --\x3e \x3c!-- forEach: "index" --\x3e \x3c!-- key: function(item, index, whole){ return item.id } --\x3e <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.landmarkBuilder.focus().then(_=>{this.app.transferData(App.landmarkBuilder.card, this.app.savedLandmarks[this.index].cardData); App.landmarkBuilder.cardId = this.app.savedLandmarks[this.index].id})"> <strong>{:App.lang[App.langChoice].edit:} {: this.app.savedLandmarks[this.index].cardData.name :}</strong> <div> {: this.app.attached && App.batchExporter.createPreview( this.app.savedLandmarks[this.index].cardData, App.landmarkBuilder, this.app.savedLandmarks[this.index].id, ) :}|{attached}| </div> </div> \x3c!-- in: savedLandmarks --\x3e \x3c!-- forEach: "index" --\x3e \x3c!-- key: function(item, index, whole){ return item.id } --\x3e <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.spellBuilder.focus().then(_=>{this.app.transferData(App.spellBuilder.card, this.app.savedSpells[this.index].cardData); App.spellBuilder.cardId = this.app.savedSpells[this.index].id})"> <strong>{:App.lang[App.langChoice].edit:} {: this.app.savedSpells[this.index].cardData.name :}</strong> <div> {: this.app.attached && App.batchExporter.createPreview( this.app.savedSpells[this.index].cardData, App.spellBuilder, this.app.savedSpells[this.index].id, ) :}|{attached}| </div> </div> \x3c!-- in: savedSpells --\x3e \x3c!-- forEach: "index" --\x3e \x3c!-- key: function(item, index, whole){ return item.id } --\x3e <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.followerBuilder.focus().then(_=>{this.app.transferData(App.followerBuilder.card, this.app.savedFollowers[this.index].cardData); App.followerBuilder.cardId = this.app.savedFollowers[this.index].id})"> <strong>{:App.lang[App.langChoice].edit:} {: this.app.savedFollowers[this.index].cardData.name :}</strong> <div> {: this.app.attached && App.batchExporter.createPreview( this.app.savedFollowers[this.index].cardData, App.followerBuilder, this.app.savedFollowers[this.index].id, ) :}|{attached}| </div> </div> \x3c!-- in: savedFollowers --\x3e \x3c!-- forEach: "index" --\x3e \x3c!-- key: function(item, index, whole){ return item.id } --\x3e <div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter clickable" onclick="App.keywordBuilder.focus().then(_=>{this.app.transferData(App.keywordBuilder.card, this.app.savedKeywords[this.index].cardData); App.keywordBuilder.cardId = this.app.savedKeywords[this.index].id})"> <strong>{:App.lang[App.langChoice].edit:} {: this.app.savedKeywords[this.index].cardData.name :}</strong> <div> {: this.app.attached && App.batchExporter.createPreview( this.app.savedKeywords[this.index].cardData, App.keywordBuilder, this.app.savedKeywords[this.index].id, ) :}|{attached}| </div> </div> \x3c!-- in: savedKeywords --\x3e\n</main>\n',e);n()}();