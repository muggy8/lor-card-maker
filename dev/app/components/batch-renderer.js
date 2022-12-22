import factory, { div } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import { createElement, useState, useCallback } from "/cdn/react"
import { typeToComponent } from "/Views/list.js"
import { svgRefference } from "/Views/card-editor.js"

import SvgWrap from "/Components/card-template/svg-wrap.js"


const cssLoaded = loadCss("/Components/batch-renderer.css")

export function getResolutionFor(type){
    if (type === "deck"){
        return {
            width: 256,
            height: 256,
        }
    }

    if (type === "keyword"){
        return {
            width: 512,
            height: 512,
        }
    }

    return {
        width: 680,
        height: 1024,
    }
}

const calculationCache = {
    list: undefined,
    pairs: {},
}

export function calculateRowsAndColsForCardsRecursivelyWithCacheUse(cards, cols = 1){

    if (calculationCache.list === cards){
        // the cache we have is valid for the current collection

        if (calculationCache.pairs[cols]){
            return calculationCache.pairs[cols]
        }
    }
    else{
        calculationCache.pairs = {}
        calculationCache.list = cards
    }

    const numberOfCards = cards.length

    const rows = Math.ceil(numberOfCards / cols)

    if (!cards.length){
        return calculationCache.pairs[cols] = {rows, cols}
    }

    const largestResolution = cards
        .map(card=>getResolutionFor(card.type))
        .reduce((biggestSoFar, resolutionToCheck)=>{
            if (!biggestSoFar){
                return resolutionToCheck
            }

            if (resolutionToCheck.width > biggestSoFar.width){
                return resolutionToCheck
            }

            return biggestSoFar
        })

    const sigleItemAspectRatio = largestResolution.width / largestResolution.height
    const aspectRatioMaxedOutWidth = ((largestResolution.width + 1) * 3) / largestResolution.height
    const aspectRatioMaxedOutHeight = largestResolution.width / (largestResolution.height - 1)

    const collectiveAspectRatio = (largestResolution.width * cols) / (largestResolution.height * rows)

    calculationCache.pairs[cols] = {
        cols, rows, 
        width: largestResolution.width * cols, 
        height: largestResolution.height * rows, 
        resolution: largestResolution
    } // fallback in case nothing gets found

    if (numberOfCards === 3){
		// special case for 3 cards.
		const rows = 1
		return calculationCache.pairs[cols] = {rows, cols: 3,  width: largestResolution.width * 3, height: largestResolution.height * rows, resolution: largestResolution}
	}

    if (sigleItemAspectRatio === collectiveAspectRatio){
        return calculationCache.pairs[cols]
    }

    // console.log({collectiveAspectRatio, sigleItemAspectRatio, upperbound: sigleItemAspectRatio * 2, lowerBound: sigleItemAspectRatio * 0.75})

    if (collectiveAspectRatio > aspectRatioMaxedOutWidth){
        if (cols > 1){
            calculationCache.pairs[cols] = calculateRowsAndColsForCardsRecursivelyWithCacheUse(cards, cols - 1)
        }
    }
    else if (collectiveAspectRatio < aspectRatioMaxedOutHeight){
        calculationCache.pairs[cols] = calculateRowsAndColsForCardsRecursivelyWithCacheUse(cards, cols + 1)
    }

    return calculationCache.pairs[cols]
}

function useOldListIfNothingChanged(newList){
    const [previousList, updatePreviousList] = useState([...newList]) // we create a new list here as a deep copy of the list. that way if the list is manipulated by something else, we'll still remember it's original state before the manipulation.

    const updatedListToUseIfUpdatesDetected = [...newList]

    if (previousList.length !== newList.length){
        updatePreviousList(updatedListToUseIfUpdatesDetected)
        return updatedListToUseIfUpdatesDetected
    }

    const listLenght = newList.length

    for(let i = 0; i < listLenght; i++){
        const existing = previousList[i]
        const checking = newList[i]

        if (existing !== checking){
            updatePreviousList(updatedListToUseIfUpdatesDetected)
            return updatedListToUseIfUpdatesDetected
        }
    }

    return previousList
}

function BatchRendererComponent(props){
    // we gotta make sure that the list that we give to the calculator is the same list as long as the items in it is the same even if in memory, the list is different.
    const cardsList = useOldListIfNothingChanged(props.cards)

    const {width, height, resolution} = calculateRowsAndColsForCardsRecursivelyWithCacheUse(cardsList)

    const doNothing = useCallback(()=>{}, [])

    return SvgWrap(
        {width, height, loading: props.loading},
        createElement(
            svgRefference.Provider,
            { value: { // replace teh svg ref so the stuff below dont ruin the fun for our exporter
                current: null,
                setRef: doNothing,
            } },
            div(
                { className: "cards-grid" },

                props.cards.map((cardData)=>{
                    const renderingComponent = typeToComponent(cardData.type)
                    if (!renderingComponent){
                        return div({key: cardData.id})
                    }
                    return div(
                        {
                            className: "card",
                            key: cardData.id,
                            style: {
                                width: `${resolution.width}px`,
                                height: `${resolution.height}px`,
                            }
                        },
                        renderingComponent(cardData)
                    )
                }),
            ),
        ),
    )
}

export default factory(BatchRendererComponent, cssLoaded)
