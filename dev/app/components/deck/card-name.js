import { useEffect, useState } from "/cdn/react";
import datauri from "/Utils/datauri.js";
import factory, { div } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";
import useAssetCache from "/Utils/use-asset-cache.js";

const cssLoaded = linkAsset("/Components/deck/card-name.css")

const ritoCardDataProperties = [
    "associatedCards",
    "associatedCardRefs",
    "assets",
    "regions",
    "regionRefs",
    "attack",
    "cost",
    "health",
    "description",
    "descriptionRaw",
    "levelupDescription",
    "levelupDescriptionRaw",
    "flavorText",
    "artistName",
    "name",
    "cardCode",
    "keywords",
    "keywordRefs",
    "spellSpeed",
    "spellSpeedRef",
    "rarity",
    "rarityRef",
    "subtypes",
    "supertype",
    "type",
    "collectible",
    "set"
]

export function isRitoCard(card){
    let numberOfRitoPropertiesThatExistsOnCard = 0
    ritoCardDataProperties.forEach(prop=>{
        if (typeof card[prop] !== "undefined"){
            numberOfRitoPropertiesThatExistsOnCard++
        }
    })

    return (numberOfRitoPropertiesThatExistsOnCard / ritoCardDataProperties.length) > 0.85
}

const getManaballUnit = datauri("/Assets/deck/mana-ball-unit.png")
const getManaballSlow = datauri("/Assets/deck/mana-ball-slow.png")
const getManaballFast = datauri("/Assets/deck/mana-ball-unit.png")
const getManaballChamp = datauri("/Assets/deck/mana-ball-champ.png")

function cardNameComponent(props){
    const isCustomCard = useAssetCache(updateIsCustomCard=>{
        updateIsCustomCard(
            !isRitoCard(props.card)
        )
    }, [props.card])
    
    
    const manaBallPath = useAssetCache(updateManaBallPath=>{
        if (typeof isCustomCard === "undefined"){
            return
        }

        const card = props.card

        if (isCustomCard){
            switch(card.type){
                case "spell": 
                    switch(card.speed){
                        case "slow":
                        case "equipment": 
                            return getManaballSlow.then(updateManaBallPath), undefined
                        default:
                            return getManaballFast.then(updateManaBallPath), undefined
                    }
                case "champion1":
                case "champion2":
                case "champion3":
                    return getManaballChamp.then(updateManaBallPath), undefined
                case "landmark":
                case "follower":
                default: 
                    return getManaballUnit.then(updateManaBallPath), undefined

            }
        }
        else{
            switch(card.type.toLowerCase()){
                case "equipment":
                    return getManaballSlow.then(updateManaBallPath), undefined
                case "spell":
                    switch(card.spellSpeed.toLowerCase()){
                        case "slow":
                            return getManaballSlow.then(updateManaBallPath), undefined
                        default:
                            return getManaballFast.then(updateManaBallPath), undefined
                    }
                case "unit":
                case "landmark":
                default:
                    switch(card.supertype.toLowerCase()){
                        case "champion":
                            return getManaballChamp.then(updateManaBallPath), undefined
                        default: 
                            return getManaballUnit.then(updateManaBallPath), undefined
                    }
            }
        }
    }, [isCustomCard]) // dont need to watch card since isCustomCard will change as a result of card getting changed

    return div(
        { 
            className: "card-shorthand " + props.className,
            style: {
                "--mana-ball-type": manaBallPath ? `url(${manaBallPath})` : "none"
            }
        },

        div(
            { className: "mana-cost" },
            Object.prototype.hasOwnProperty.call(props.card, "cost")
                ? props.card.cost 
                : props.card.mana
        ),
        
        div(
            { className: "shorthand-text capitalize" },
            props.children,
        )
    )
}

export default factory(cardNameComponent, cssLoaded)