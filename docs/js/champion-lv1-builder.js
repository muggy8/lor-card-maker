!function(){let a=Object.create(App.unitController);a.saveCard=async function(){let a=this;a.cardId=await App.storage.saveChampion1(a.card,a.cardId)},a.deleteCard=async function(){await App.storage.delSavedChampion1(this.cardId),window.location.reload()};App.championLv1Builder=a,a.gemOptions=["gemless","gem"],a.framePath="./assets/champion/frame1";let e=proxymity(a.template,a);a.focus=a.focusFactory(e,"championLv1Builder","Champion Lv1 Builder")}();