App.cardOptions=function(t,e){return function(t,n){let a={subTemplates:e,rarityOptions:n};a.card=t;a.factionOptions=cardOptionsData.factionOptions,a.spellSpeedOptions=cardOptionsData.spellSpeedOptions,a.keywords=Object.keys(cardOptionsData.icons),a.toggleKeyword=function(e){let n=t.keywords.indexOf(e);-1===n?t.keywords.push(e):t.keywords.splice(n,1)},a.toggleFaction=function(e){let n=t.faction.indexOf(e);-1===n?t.faction.push(e):t.faction.splice(n,1)};function i(t){if("selectionStart"in t&&document.activeElement==t)return{start:t.selectionStart,end:t.selectionEnd};if(t.createTextRange){var e=document.selection.createRange();if(e.parentElement()===t){var n=t.createTextRange();n.moveToBookmark(e.getBookmark());for(var a=0;n.compareEndPoints("EndToStart",n)>0;n.moveEnd("character",-1))a++;n.setEndPoint("StartToStart",t.createTextRange());for(var i={start:0,end:a};n.compareEndPoints("EndToStart",n)>0;n.moveEnd("character",-1))i.start++,i.end++;return i}}return-1}function s(t,e,n,a){return t.slice(0,e)+a+t.slice(e+Math.abs(n))}a.insertEffectSymbol=function(e){let n=a.cursorPos;n.start===n.end&&(t.effect=s(t.effect,n.start,0,`<${e}/>`))};a.cursorPos={start:0,end:0};a.rememberCursorPosition=function(){let t=i(a.effectInputArea);-1!==t&&(a.cursorPos=t)},a.processArtUpload=function(e){let n=new FileReader,a=e.files[0];n.addEventListener("load",(function(){t.art=n.result})),a&&(console.log(a),n.readAsDataURL(a))};a.levelPos={start:0,end:0};a.rememberLevelCursorPosition=function(){let t=i(a.levelInputArea);-1!==t&&(a.levelPos=t)},a.insertLevelEffectSymbol=function(e){let n=a.levelPos;n.start===n.end&&(t.lvup=s(t.lvup,n.start,0,`<${e}/>`))};return a.mbShowConfigs=!1,a.toggleMBShow=function(){a.mbShowConfigs=!a.mbShowConfigs,!1===a.mbShowConfigs?history.back():history.pushState({},"Configuring Card")},proxymity('\n<div class="mobile-config-footer gutter-trbl flex hcenter clickable" onclick="this.app.toggleMBShow()" data-init="{: document.body.style.setProperty(\'--footer-height\', this.offsetHeight + \'px\') :}|{ mbShowConfigs }|"> <strong>{:App.lang[App.langChoice].card_configs:}</strong>\n</div>\n<div class="slide-up gutter-tb {:this.app.mbShowConfigs ? \'active\' : \'\':}|{mbShowConfigs}|"> {:Object.prototype.hasOwnProperty.call(this.app.card, "name") ? proxymity(this.app.subTemplates.cardNameUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "mana") ? proxymity(this.app.subTemplates.manaCostUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "speed") ? proxymity(this.app.subTemplates.speedSelectorUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "rarity") && this.app.rarityOptions ? proxymity(this.app.subTemplates.raritySelectorUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "faction") ? proxymity(this.app.subTemplates.regionSelectorUI, this.app) : undefined:} \x3c!-- text break --\x3e <div class="flex power-health"> {:Object.prototype.hasOwnProperty.call(this.app.card, "power") ? proxymity(this.app.subTemplates.powerUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "health") ? proxymity(this.app.subTemplates.healthUI, this.app) : undefined:} </div> {:Object.prototype.hasOwnProperty.call(this.app.card, "art") ? proxymity(this.app.subTemplates.artUploadUI, this.app) : undefined:} {:Object.prototype.hasOwnProperty.call(this.app.card, "artist") ? proxymity(this.app.subTemplates.cardArtistUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "keywords") ? proxymity(this.app.subTemplates.keywordChoiceUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "effect") ? proxymity(this.app.subTemplates.cardEffectUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "lvup") ? proxymity(this.app.subTemplates.cardLevelUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "blueWords") ? proxymity(this.app.subTemplates.blueWordsUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "orangeWords") ? proxymity(this.app.subTemplates.orangeWordsUI, this.app) : undefined:} \x3c!-- text break --\x3e {:Object.prototype.hasOwnProperty.call(this.app.card, "clan") ? proxymity(this.app.subTemplates.cardClanUI, this.app) : undefined:}\n</div>\n',a)}}(0,{regionSelectorUI:' <label> <div> <strong>{:App.lang[App.langChoice].faction:}</strong> </div> <div class="flex gutter-b-2"> \x3c!-- forEach: "index" --\x3e <div class="box-3 gutter-trbl-.25 clickable flex column vhcenter {:this.app.card.faction.some(word=>word===this.app.factionOptions[this.index]) ? \'\' : \'ghost\' :}|{card.faction.length}|" onclick="this.app.toggleFaction(this.app.factionOptions[this.index])"> <img src="./assets/regions/{:this.app.factionOptions[this.index]:}.png" /> </div> \x3c!-- in: factionOptions --\x3e </div> </label>',raritySelectorUI:' <label> <div> <strong>{:App.lang[App.langChoice].rarity:}</strong> </div> <div class="flex gutter-b-2"> <select name="rarity" class="box-12" onchange="this.app.card.rarity = this.value" data-value="{:this.app.card.rarity:}|{card.rarity}|"> \x3c!-- forEach: "rarityIndex" --\x3e <option value="{:this.app.rarityOptions[this.rarityIndex]:}">{:App.lang[App.langChoice][this.app.rarityOptions[this.rarityIndex]]:}</option> \x3c!-- in: rarityOptions --\x3e </select> </div> </label> ',manaCostUI:' <label> <div> <strong>{:App.lang[App.langChoice].mana_cost:}</strong> </div> <div class="flex gutter-b-2"> <input class="box-12" name="mana-cost" type="number" data-value="{:this.app.card.mana:}|{card.mana}|" onchange="this.app.card.mana = this.valueAsNumber" onkeyup="this.app.card.mana = this.valueAsNumber" > </div> </label> ',powerUI:' <label class="grow"> <div> <strong>{:App.lang[App.langChoice].power:}</strong> </div> <div class="flex gutter-b-2"> <input class="box-12" name="power" type="number" data-value="{:this.app.card.power:}|{card.power}|" onchange="this.app.card.power = this.valueAsNumber || 0" onkeyup="this.app.card.power = this.valueAsNumber || 0" > </div> </label> ',healthUI:' <label class="grow"> <div> <strong>{:App.lang[App.langChoice].health:}</strong> </div> <div class="flex gutter-b-2"> <input class="box-12" name="power" type="number" data-value="{:this.app.card.health:}|{card.health}|" onchange="this.app.card.health = this.valueAsNumber || 0" onkeyup="this.app.card.health = this.valueAsNumber || 0" > </div> </label> ',cardNameUI:' <label> <div> <strong>{:App.lang[App.langChoice].name:}</strong> </div> <div class="flex gutter-b-2"> <input class="box-12" name="card-name" type="text" data-value="{:this.app.card.name:}|{card.name}|" onchange="this.app.card.name = this.value || \'\'" onkeyup="this.app.card.name = this.value || \'\'" > </div> </label> ',cardArtistUI:' <label> <div> <strong>{:App.lang[App.langChoice].artist:}</strong> </div> <div class="flex gutter-b-2"> <input class="box-12" name="card-artist" type="text" data-value="{:this.app.card.artist:}|{card.artist}|" onchange="this.app.card.artist = this.value || \'\'" onkeyup="this.app.card.artist = this.value || \'\'" > </div> </label> ',cardClanUI:' <label> <div> <strong>{:App.lang[App.langChoice].clan:}</strong> </div> <div class="flex gutter-b-2"> <input class="box-12" name="card-name" type="text" data-value="{:this.app.card.clan:}|{card.clan}|" onchange="this.app.card.clan = this.value || \'\'" onkeyup="this.app.card.clan = this.value || \'\'" > </div> </label> ',cardEffectUI:' <label> <div> <strong>{:App.lang[App.langChoice].effect:}</strong> </div> <div class="flex gutter-b-2"> <div class="grow-wrap box-12"> <textarea data-init="{:this.app.effectInputArea = this:}" name="card-effect" data-value="{:this.app.card.effect:}|{card.effect}|" onInput="this.parentNode.dataset.replicatedValue = this.value" onchange="this.app.card.effect = this.value || \'\'" onkeyup="this.app.rememberCursorPosition()" onclick="this.app.rememberCursorPosition()" ></textarea> </div> </div> </label> <div> <div> <strong>{:App.lang[App.langChoice].key_symbol_effect:}</strong> </div> <div class="flex"> \x3c!-- forEach: "index" --\x3e <div class="box-2 flex column vhcenter gutter-trbl-.25 clickable" onclick="this.app.insertEffectSymbol(this.app.keywords[this.index])" data-init="{:this.innerHTML = createMiniKeyword(\'./assets/symbol/\' + cardOptionsData.icons[this.app.keywords[this.index]]).svg:}"></div> \x3c!-- in: keywords --\x3e </div> </div> ',cardLevelUI:' <label> <div> <strong>{:App.lang[App.langChoice].lv_up:}</strong> </div> <div class="flex gutter-b-2"> <div class="grow-wrap box-12"> <textarea data-init="{:this.app.levelInputArea = this:}" name="level-cond" data-value="{:this.app.card.lvup:}|{card.lvup}|" onInput="this.parentNode.dataset.replicatedValue = this.value" onchange="this.app.card.lvup = this.value || \'\'" onkeyup="this.app.rememberLevelCursorPosition()" onclick="this.app.rememberLevelCursorPosition()" ></textarea> </div> </div> </label> <div> <div> <strong>{:App.lang[App.langChoice].key_symbol_lv_up:}</strong> </div> <div class="flex"> \x3c!-- forEach: "index" --\x3e <div class="box-2 flex column vhcenter gutter-trbl-.25 clickable" onclick="this.app.insertLevelEffectSymbol(this.app.keywords[this.index])" data-init="{:this.innerHTML = createMiniKeyword(\'./assets/symbol/\' + cardOptionsData.icons[this.app.keywords[this.index]]).svg:}"></div> \x3c!-- in: keywords --\x3e </div> </div> ',keywordChoiceUI:' <div> <div> <strong>{:App.lang[App.langChoice].select_keyword:}</strong> </div> <div class="flex"> \x3c!-- forEach: "index" --\x3e <label class="box-3 flex column vhcenter gutter-trbl-.25 clickable {:this.app.card.keywords.some(word=>word===this.app.keywords[this.index]) ? \'\' : \'ghost\' :}|{card.keywords.length}|" onclick="this.app.toggleKeyword(this.app.keywords[this.index])"> <div data-init="{:this.innerHTML = createMiniKeyword(\'./assets/symbol/\' + cardOptionsData.icons[this.app.keywords[this.index]]).svg:}"></div> </label> \x3c!-- in: keywords --\x3e </div> </div> ',speedSelectorUI:' <label> <div> <strong>{:App.lang[App.langChoice].frame_type:}</strong> </div> <div class="flex gutter-b-2"> <select name="speed" class="box-12" onchange="this.app.card.speed = this.value" data-value="{:this.app.card.speed:}|{card.speed}|"> \x3c!-- forEach: "index" --\x3e <option value="{:this.app.spellSpeedOptions[this.index]:}">{:App.lang[App.langChoice][this.app.spellSpeedOptions[this.index]]:}</option> \x3c!-- in: spellSpeedOptions --\x3e </select> </div> </label> ',blueWordsUI:' <div class="gutter-t-.5 {:this.app.card.blueWords.length ? \'gutter-b-2-.5\' : \'\' :}|{card.blueWords.length}|"> <div class="flex gutter-b-2-.5"> <div class="grow"> <strong>{:App.lang[App.langChoice].other_card_mentioned:}</strong> </div> <button onclick="this.app.card.blueWords.push(\'\')">{:App.lang[App.langChoice].add_mention:}</button> </div> \x3c!-- forEach: "index" --\x3e <label class="flex gutter-tb-.5"> <div class="grow flex gutter-r"> <input class="box-12" name="mentions-{:this.index:}" data-value="{:this.app.card.blueWords[this.index]:}|{card.blueWords[this.index]}|" onchange="this.app.card.blueWords[this.index] = this.value" onkeyup="this.app.card.blueWords[this.index] = this.value" /> </div> <button onclick="this.app.card.blueWords.splice(this.index, 1)">X</button> </label> \x3c!-- in: card.blueWords --\x3e </div> ',orangeWordsUI:' <div class="gutter-t-.5 {:this.app.card.orangeWords.length ? \'gutter-b-2-.5\' : \'\' :}|{card.orangeWords.length}|"> <div class="flex gutter-b-2-.5"> <div class="grow"> <strong>{:App.lang[App.langChoice].key_text_mentioned:}</strong> </div> <button onclick="this.app.card.orangeWords.push(\'\')">{:App.lang[App.langChoice].add_mention:}</button> </div> \x3c!-- forEach: "index" --\x3e <label class="flex gutter-tb-.5"> <div class="grow flex gutter-r"> <input class="box-12" name="mentions-{:this.index:}" data-value="{:this.app.card.orangeWords[this.index]:}|{card.orangeWords[this.index]}|" onchange="this.app.card.orangeWords[this.index] = this.value" onkeyup="this.app.card.orangeWords[this.index] = this.value" /> </div> <button onclick="this.app.card.orangeWords.splice(this.index, 1)">X</button> </label> \x3c!-- in: card.orangeWords --\x3e </div> ',artUploadUI:' <strong>{:App.lang[App.langChoice].card_art:}</strong> <label class="flex hcenter"> <button class="gutter-trbl grow" onclick="document.getElementById(\'uplaod-art\').click()"> <strong>{:App.lang[App.langChoice].upload_image:}</strong> </button> <input class="hide" type="file" id="uplaod-art" name="art" accept="image/*" onchange="this.app.processArtUpload(this)"/> </label> <div class="flex hcenter">{:App.lang[App.langChoice].or_enter_image_url:}</div> <label class="flex hcenter gutter-b-2"> <input class="box-12" type="url" placeholder="{:App.lang[App.langChoice].image_url:}" onchange="this.app.card.art = this.value"> </label> '});