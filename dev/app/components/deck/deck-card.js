import svgWrap from "/Components/card-template/svg-wrap.js";
import { createElement } from "/cdn/react"
import { isRitoCard } from "./card-name.js";
import factory, { div } from "/Utils/elements.js";
import { getRitoCardImage } from "/Utils/service.js";
import linkAsset from "/Utils/load-css.js";
import { typeToComponent } from "/Views/list.js";
import useAssetCache from "/Utils/use-asset-cache.js";

const cssLoaded = linkAsset("/Components/deck/deck-card.css")

function deckCardComponent(props){
    const cardSvg = isRitoCard(props.card) 
        ? InDeckRitoCard(props.card)
        : InDeckCustomCard(props.card)

    return cardSvg // do this for testing but we can stack them later
}

function ritoCardRendererComponent(props){
    const cardId = props.cardCode
    const cardSet = props.set

    const cardImage = useAssetCache(updateCardImage=>{
        getRitoCardImage(cardSet, cardId).then(updateCardImage)
    }, [cardId, cardSet])

    return svgWrap(
        { loading: !cardImage },
        !!cardImage 
            ? div({
                className: "in-deck-rito-card",
                style: {
                    backgroundImage: `url(${cardImage})`
                }
            })
            : undefined
    )
}


function customCardRendererComponent(props){
    const cachedCard = useAssetCache(updateCachedCard=>{
        const renderingComponent = typeToComponent(props.type)
        updateCachedCard(renderingComponent(props))
    }, Object.keys(props).map(prop=>props[prop]))

    return cachedCard
}

export default factory(deckCardComponent, cssLoaded)
export const InDeckRitoCard = factory(ritoCardRendererComponent, cssLoaded)
export const InDeckCustomCard = factory(customCardRendererComponent, cssLoaded)