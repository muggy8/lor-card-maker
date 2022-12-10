import { useEffect, useState } from "/cdn/react";
import factory, { div } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";

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

function cardNameComponent(props){
    const [isCustomCard, updateIsCustomCard] = useState()
    useEffect(()=>{
        updateIsCustomCard(
            !isRitoCard(props.card)
        )
    }, [props.card])
    
    
    const [manaBallPath, updateManaBallPath] = useState("")
    useEffect(()=>{
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
                            return updateManaBallPath("/Assets/deck/mana-ball-slow.png")
                        default:
                            return updateManaBallPath("/Assets/deck/mana-ball-fast.png")
                    }
                case "champion1":
                case "champion2":
                case "champion3":
                    return updateManaBallPath("/Assets/deck/mana-ball-champ.png")
                case "landmark":
                case "follower":
                default: 
                    return updateManaBallPath("/Assets/deck/mana-ball-unit.png")

            }
        }
        else{
            switch(card.type.toLowerCase()){
                case "equipment":
                    return updateManaBallPath("/Assets/deck/mana-ball-slow.png")
                case "spell":
                    switch(card.spellSpeed.toLowerCase()){
                        case "slow":
                            return updateManaBallPath("/Assets/deck/mana-ball-slow.png")
                        default:
                            return updateManaBallPath("/Assets/deck/mana-ball-fast.png")
                    }
                case "unit":
                case "landmark":
                default:
                    switch(card.supertype.toLowerCase()){
                        case "champion":
                            return updateManaBallPath("/Assets/deck/mana-ball-champ.png")
                        default: 
                            return updateManaBallPath("/Assets/deck/mana-ball-unit.png")
                    }
            }
        }
    }, [isCustomCard]) // dont need to watch card since isCustomCard will change as a result of card getting changed

    return div(
        { 
            className: "card-shorthand " + props.className,
            style: {
                "--mana-ball-type": `url(${manaBallPath})`
            }
        },

        div(
            { className: "mana-cost" },
            props.card.cost
        ),
        
        div(
            { className: "shorthand-text" },
            props.children,
        )
    )
}

export default factory(cardNameComponent, cssLoaded)