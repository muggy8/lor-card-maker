!function(){let a=Object.create(App.unitController);a.attached=!1;a.saveCard=async function(){let a=this;a.cardId=await App.storage.saveChampion2(a.card,a.cardId)},a.deleteCard=async function(){await App.storage.delSavedChampion2(this.cardId),window.location.reload()};App.championLv2Builder=a,a.gemOptions=["gemless","gem"],a.rendererOptions={framePath:"./assets/champion/frame2",clan:{bgPath:"./assets/champion/typing.png"},region:{bgPath:"./assets/regions/champion2/regionbox"}};let e=a.generateView();a.focus=a.focusFactory(e,"championLv2Builder","Champion Lv2 Builder")}();