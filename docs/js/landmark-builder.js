!function(){let t=Object.create(App.unitController);t.clearCard=function(){App.unitController.clearCard.call(this);let a=t.card;delete a.power,delete a.health};t.saveCard=async function(){let t=this;t.cardId=await App.storage.saveLandmark(t.card,t.cardId)},t.deleteCard=async function(){await App.storage.delSavedLandmark(this.cardId),window.location.reload()};t.gemOptions=["gemless","common","rare","epic"],t.framePath="./assets/landmark/frame",t.artMask=' <clipPath id="art-mask"> <path d=" M 50, 60 h 580 v 830 l -290, 65 l -290, -65 Z " /> </clipPath> ';let a=proxymity(t.template,t);t.focus=t.focusFactory(a,"landmarkBuilder","Landmark Builder"),App.landmarkBuilder=t}();