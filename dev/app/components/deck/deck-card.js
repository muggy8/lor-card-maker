import svgWrap from "/Components/card-template/svg-wrap.js";
import { createElement } from "/cdn/react"
import { isRitoCard } from "./card-name.js";
import factory, { div } from "/Utils/elements.js";
import { getRitoCardImage } from "/Utils/service.js";
import linkAsset from "/Utils/load-css.js";
import { typeToComponent } from "/Views/list.js";
import useAssetCache from "/Utils/use-asset-cache.js";

const cssLoaded = linkAsset("/Components/deck/deck-card.css")

const emptyArray = []

function deckCardComponent(props){

    const [cardSvg, cardShadow, shadowList] = useAssetCache(setCache=>{
        const currentCardIsRitoCard = isRitoCard(props.card) 

        const cardSvg = currentCardIsRitoCard
            ? InDeckRitoCard(props.card)
            : InDeckCustomCard(props.card)
    
        const cardShadow = currentCardIsRitoCard 
            ? cardSvg
            : InDeckCustomCard({
                ...props.card,
                name: undefined,
                blueWords: emptyArray,
                orangeWords: emptyArray,
                effectText: "",
                levelText: "",
                keywords: emptyArray,
            })
        
        const shadowList = []

        // i starts at 1 because we dont want any shadows if there's only 1 card
        for (let i = 1; i < (props.count || 1); shadowList.push(undefined), i++);

        setCache([cardSvg, cardShadow, shadowList])
    }, [props.card, props.count], [undefined, undefined, []])

    return div(
        { 
            style: { 
                width: (props.cardSize || {}).width, 
                height: (props.cardSize || {}).height 
            }, 
            className: "in-deck-card-stack"
        },
        shadowList.map((_, index)=>div(
            { 
                key: index,
                className: "shadow-card"
            }, 
            cardShadow
        )),
        div({ className: "real-card" }, cardSvg),
    )

    return cardSvg // dev related code for testing and debugging
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