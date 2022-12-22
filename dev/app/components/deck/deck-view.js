import factory, { div } from "/Utils/elements.js";
import { useEffect, useState, useCallback, createElement} from "/cdn/react"
import deckCard from "/Components/deck/deck-card.js";
import useAssetCache from "/Utils/use-asset-cache.js";
import { calculateRowsAndColsForCardsRecursivelyWithCacheUse } from "/Components/batch-renderer.js";
import svgWrap from "/Components/card-template/svg-wrap.js";
import { svgRefference } from "/Views/card-editor.js";
import linkAsset from "/Utils/load-css.js";

const cssLoaded = linkAsset("/Components/deck/deck-view.css")

function DeckViewComponent(props){

    const gridResolution = useAssetCache(updateGrid=>{
        const grid = calculateRowsAndColsForCardsRecursivelyWithCacheUse(
            props.cards.map(cardMetadata=>cardMetadata.card)
        )
        updateGrid(grid)
    }, [props.cards], {})

    const doNothing = useCallback(()=>{}, [])

    return svgWrap(
        { width: gridResolution.width, height: gridResolution.height, loading: props.loading },
        div(
            { className: "svg-deck" },
            createElement(
                svgRefference.Provider,
                { value: {
                    current: null,
                    setRef: doNothing,
                } },
                props.cards.map(deckCardProps=>{
                    const cardId = deckCardProps.card.id || deckCardProps.card.cardCode
                    return deckCard({
                        key: cardId,
                        ...deckCardProps,
                        gridColumns: gridResolution.cols,
                        gridRows: gridResolution.rows,
                        cardSize: gridResolution.resolution
                    })
                }),
            )
        )
    )
}

export default factory(DeckViewComponent, cssLoaded)