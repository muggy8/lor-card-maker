import s,{div as r}from"/Utils/elements.js";import o from"/Components/deck/deck-card.js";import c from"/Utils/use-asset-cache.js";import{calculateRowsAndColsForCardsRecursivelyWithCacheUse as d}from"/Components/batch-renderer.js";import t from"/Components/card-template/svg-wrap.js";import a from"/Utils/load-css.js";import e from"./deck-stats-card.js";const i=a("/Components/deck/deck-view.css");export default s((function(s){const a=c((r=>{r(d(s.cards.length?s.cardStats?[...s.cards.map((s=>s.card)),{}]:s.cards.map((s=>s.card)):[]))}),[s.cards,s.cardStats],{}),[i,n]=c((r=>{const o={width:0,height:0},c=[];if(!s.showAssociatedCards)return r([o,c]);console.log(s.cards)}),[s.cards,s.showAssociatedCards],[{},[]]);return t({width:a.width,height:a.height,loading:s.loading,isInclusion:s.isInclusion},r({className:"svg-deck"},s.cards.map((s=>{const r=s.card.id||s.card.cardCode||s.card.url;return o({key:r,...s,gridColumns:a.cols,gridRows:a.rows,cardSize:a.resolution,isInclusion:!0})})),s.cardStats?e({cards:s.cards,isInclusion:!0}):void 0,void s.showAssociatedCards))}),i);