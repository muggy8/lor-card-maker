import factory, { div } from "/Utils/elements.js";
import { useEffect, useState, useCallback, createElement} from "/cdn/react"
import deckCard from "/Components/deck/deck-card.js";
import useAssetCache from "/Utils/use-asset-cache.js";
import { calculateRowsAndColsForCardsRecursivelyWithCacheUse } from "/Components/batch-renderer.js";
import svgWrap from "/Components/card-template/svg-wrap.js";
import linkAsset from "/Utils/load-css.js";
import deckStatsCard from "./deck-stats-card.js";

const cssLoaded = linkAsset("/Components/deck/deck-view.css")

function DeckViewComponent(props){

    const gridResolution = useAssetCache(updateGrid=>{
        const grid = calculateRowsAndColsForCardsRecursivelyWithCacheUse(
            props.cards.length 
                ? (
                    props.cardStats 
                        ? [
                            ...props.cards.map(cardMetadata=>cardMetadata.card),
                            {}
                        ]
                        : props.cards.map(cardMetadata=>cardMetadata.card)
                )
                : []
        )
        updateGrid(grid)
    }, [props.cards, props.cardStats], {})

    const [associatedCardsGridResolution, associatedCards] = useAssetCache(updateAssociatedGrid=>{
        const associatedCardsGrid = {width: 0, height: 0},
            associatedCards = []
        if (!props.showAssociatedCards){
            return updateAssociatedGrid([
                associatedCardsGrid,
                associatedCards,
            ])
        }

        console.log(props.cards)
    }, [props.cards, props.showAssociatedCards], [{}, []])

    return svgWrap(
        { 
            width: gridResolution.width, 
            height: gridResolution.height, 
            loading: props.loading,
            isInclusion: props.isInclusion,
        },
        div(
            { className: "svg-deck" },
            props.cards.map(deckCardProps=>{
                const cardId = deckCardProps.card.id || deckCardProps.card.cardCode || deckCardProps.card.url
                return deckCard({
                    key: cardId,
                    ...deckCardProps,
                    gridColumns: gridResolution.cols,
                    gridRows: gridResolution.rows,
                    cardSize: gridResolution.resolution,
                    isInclusion: true
                })
            }),
            props.cardStats 
                ? deckStatsCard({
                    cards: props.cards,
                    isInclusion: true,
                })
                : undefined
            ,
            props.showAssociatedCards
                ? undefined
                : undefined
        )
    )
}

export default factory(DeckViewComponent, cssLoaded)