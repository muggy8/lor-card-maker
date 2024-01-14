import svgWrap from "/Components/card-template/svg-wrap.js";
import { useState } from "/cdn/react"
import { isRitoCard } from "./card-name.js";
import factory, { div } from "/Utils/elements.js";
import { getRitoCardImage, getCard } from "/Utils/service.js";
import linkAsset from "/Utils/load-css.js";
import { typeToComponent } from "/Views/list.js";
import useAssetCache from "/Utils/use-asset-cache.js";
import datauri from "/Utils/datauri.js"
import pocStickerStack from "./poc-sticker-stack.js";

const cssLoaded = linkAsset("/Components/deck/deck-card.css")

const emptyArray = []

export function isExternalImage(card){
    return Object.keys(card).length === 1 && card.url
}

function deckCardComponent(props){

    const [cardUsesSpellFrame, updateCardUsesSpellFrame] = useState(false)
    const [cardSvg, cardShadow, shadowList] = useAssetCache(setCache=>{
        const shadowList = [] // set up the shadow list early because it'll be used by both branches down the line

        // i starts at 1 because we dont want any shadows if there's only 1 card
        for (let i = 1; i < (props.count || 1); shadowList.push(undefined), i++);

        // split the timeline between rito cards and custom cards
        const currentCardIsRitoCard = isRitoCard(props.card) 

        if (currentCardIsRitoCard){
            const cardSvg = InDeckRitoCard(props.card)
            const cardShadow = cardSvg
            setCache([cardSvg, cardShadow, shadowList])

            updateCardUsesSpellFrame(
                props.card.type === "Spell" ||
                props.card.type === "spell" ||
                props.card.type === "Equipment" ||
                props.card.type === "equipment"
            )
        }
        else if (isExternalImage(props.card)){
            const cardSvg = ExternalCustomCard(props.card)
            const cardShadow = cardSvg
            setCache([cardSvg, cardShadow, shadowList])

            updateCardUsesSpellFrame(true)
        }
        else {
            getCard(props.card.id).then(card=>{
                if (!Object.keys(card).length){
                    // if we cant find the card via our fake api. it's likely because the card got deleted so we'll just use the saved version as backup
                    card = props.card
                }

                const cardSvg = InDeckCustomCard(card)
                const cardShadow = InDeckCustomCard({
                    ...card,
                    name: undefined,
                    blueWords: emptyArray,
                    orangeWords: emptyArray,
                    effectText: "",
                    levelText: "",
                    keywords: emptyArray,
                })
                setCache([cardSvg, cardShadow, shadowList])
                updateCardUsesSpellFrame(
                    props.card.type === "Spell" ||
                    props.card.type === "spell"
                )
            })
        }
        
    }, [props.card, props.count], [undefined, undefined, []])

    const isCustomKeyword = props.card.type === "keyword"

    const isSingularMode = isCustomKeyword || props.single

    return isSingularMode
        ? cardSvg
        : div(
            { 
                style: { 
                    width: (props.cardSize || {}).width, 
                    height: (props.cardSize || {}).height 
                }, 
                className: "in-deck-card-stack"
            },
            div(
                { className: "in-deck-card-stack-sizer" },
                !isCustomKeyword 
                    ? shadowList.map((_, index)=>div(
                        { 
                            key: index,
                            className: "shadow-card",
                            style: {
                                transform: `translate(${
                                    Math.min( 50, 100 / ( (props.count - 1) || 1) ) * (index + 1)
                                }px, ${
                                    -Math.min( 50, 100 / ( (props.count - 1) || 1) ) * (index + 1)
                                }px)`,
                            }
                        }, 
                        cardShadow
                    )).reverse() 
                    : undefined
                ,
                div({ className: "real-card" }, cardSvg),

                props.stickers
                    ? div(
                        { className: `stickers ${cardUsesSpellFrame ? "spell" : "" }` },
                        pocStickerStack({
                            stickers: props.stickers
                        }),
                    )
                    : undefined
                ,
            ),
        )

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

function externalCustomCardComponent(props){

    const cardImage = useAssetCache(updateCardImage=>{
        datauri(props.url).then(updateCardImage)
    }, [props.url])

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
export const ExternalCustomCard = factory(externalCustomCardComponent, cssLoaded)