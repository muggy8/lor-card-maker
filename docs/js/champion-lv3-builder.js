!function(){let a=Object.create(App.unitController);a.saveCard=async function(){let a=this;a.cardId=await App.storage.saveChampion3(a.card,a.cardId)},a.deleteCard=async function(){await App.storage.delSavedChampion3(this.cardId),window.location.reload()};App.championLv3Builder=a,a.gemOptions=void 0,a.rendererOptions={framePath:"./assets/champion/frame3",clan:{bgPath:"./assets/champion/typing.png"},region:{bgPath:"./assets/regions/champion3/regionbox",offsetBottom:11,offsetRight:6}};let e=a.generateView();a.focus=a.focusFactory(e,"championLv3Builder","Champion Lv3 Builder")}();