!function(t){let e={},n=e.focus=function(){App.currentView!==a&&(App.currentView=a,history.replaceState({focus:"cardTypePicker"},"LoR Card Makern"))};e.savedChampions1=App.storage.getSavedChampion1(),e.savedChampions2=App.storage.getSavedChampion2(),e.savedFollowers=App.storage.getSavedFollower(),e.savedLandmarks=App.storage.getSavedLandmark(),e.savedSpells=App.storage.getSavedSpell(),e.transferData=function(t,e){Object.keys(e).forEach((function(n){t[n]=e[n]}))},App.cardTypePicker=e;let a=proxymity('\n<div class="flex hcenter">\n\t<h2>I want to create a...</h2>\n</div>\n<main class="gutter-trbl-.5 flex">\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Champion Lv 1</strong>\n\t\t<div class="clickable" onclick="App.championLv1Builder.focus()">\n\t\t\t<img src="./assets/champion/frame1gem.png" />\n\t\t</div>\n\t</div>\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Champion Lv 2</strong>\n\t\t<div class="clickable"  onclick="App.championLv2Builder.focus()">\n\t\t\t<img src="./assets/champion/frame2.png" />\n\t\t</div>\n\t</div>\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Landmark</strong>\n\t\t<div class="clickable"  onclick="App.landmarkBuilder.focus()">\n\t\t\t<img src="./assets/landmark/framegemless.png" />\n\t\t</div>\n\t</div>\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Spell</strong>\n\t\t<div class="clickable"  onclick="App.spellBuilder.focus()">\n\t\t\t<img src="./assets/spell/frameslownone.png" />\n\t\t</div>\n\t</div>\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Follower</strong>\n\t\t<div class="clickable" onclick="App.followerBuilder.focus()">\n\t\t\t<img src="./assets/follower/framegemless.png" />\n\t\t</div>\n\t</div>\n\n\t\x3c!-- key: "index" --\x3e\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Edit</strong>\n\t\t<div class="clickable" onclick="App.championLv1Builder.focus().then(_=>{this.app.transferData(App.championLv1Builder.card, this.app.savedChampions1[this.index].cardData); App.championLv1Builder.cardId = this.app.savedChampions1[this.index].id})">\n\t\t\t{:App.championLv1Builder.createPreview(this.app.savedChampions1[this.index].cardData):}\n\t\t</div>\n\t</div>\n\t\x3c!-- in: savedChampions1 --\x3e\n\n\t\x3c!-- key: "index" --\x3e\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Edit</strong>\n\t\t<div class="clickable" onclick="App.championLv2Builder.focus().then(_=>{this.app.transferData(App.championLv2Builder.card, this.app.savedChampions2[this.index].cardData); App.championLv2Builder.cardId = this.app.savedChampions2[this.index].id})">\n\t\t\t{:App.championLv2Builder.createPreview(this.app.savedChampions2[this.index].cardData):}\n\t\t</div>\n\t</div>\n\t\x3c!-- in: savedChampions2 --\x3e\n\n\t\x3c!-- key: "index" --\x3e\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Edit</strong>\n\t\t<div class="clickable" onclick="App.landmarkBuilder.focus().then(_=>{this.app.transferData(App.landmarkBuilder.card, this.app.savedLandmarks[this.index].cardData); App.landmarkBuilder.cardId = this.app.savedLandmarks[this.index].id})">\n\t\t\t{:App.landmarkBuilder.createPreview(this.app.savedLandmarks[this.index].cardData):}\n\t\t</div>\n\t</div>\n\t\x3c!-- in: savedLandmarks --\x3e\n\n\t\x3c!-- key: "index" --\x3e\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Edit</strong>\n\t\t<div class="clickable" onclick="App.spellBuilder.focus().then(_=>{this.app.transferData(App.spellBuilder.card, this.app.savedSpells[this.index].cardData); App.spellBuilder.cardId = this.app.savedSpells[this.index].id})">\n\t\t\t{:App.spellBuilder.createPreview(this.app.savedSpells[this.index].cardData):}\n\t\t</div>\n\t</div>\n\t\x3c!-- in: savedSpells --\x3e\n\n\t\x3c!-- key: "index" --\x3e\n\t<div class="gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter">\n\t\t<strong>Edit</strong>\n\t\t<div class="clickable" onclick="App.followerBuilder.focus().then(_=>{this.app.transferData(App.followerBuilder.card, this.app.savedFollowers[this.index].cardData); App.followerBuilder.cardId = this.app.savedFollowers[this.index].id})">\n\t\t\t{:App.followerBuilder.createPreview(this.app.savedFollowers[this.index].cardData):}\n\t\t</div>\n\t</div>\n\t\x3c!-- in: savedFollowers --\x3e\n</main>\n',e);n()}();