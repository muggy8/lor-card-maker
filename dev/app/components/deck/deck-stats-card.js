import svgWrap from "/Components/card-template/svg-wrap.js";
import { isRitoCard } from "./card-name.js";
import factory, { div } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";
import useAssetCache from "/Utils/use-asset-cache.js";
import datauri from "/Utils/datauri.js"


const cssLoaded = linkAsset("/Components/deck/deck-stats-card.css")

function deckStatsCard(props){
    const deckStats = useAssetCache(updateCache=>{
        const stats = {
            cards: 0,
            units: 0,
            followers: 0,
            champions: 0,
            spells: 0,
            equipments: 0,
            landmarks: 0,
        }

        ;(props.cards || []).forEach(cardData => {
            stats.cards += cardData.count
            const { card }  = cardData
            const currentCardIsRitoCard = isRitoCard(card) 


            if (currentCardIsRitoCard){
                if (card.type === "Unit"){
                    stats.units += cardData.count
                    if (card.supertype !== "Champion"){
                        stats.followers += cardData.count
                    }
                }
                else if (card.type === "Equipment"){
                    stats.equipments += cardData.count
                }
                else if (card.type === "Landmark"){
                    stats.landmarks += cardData.count
                }
                else if (card.type === "Spell"){
                    stats.spells += cardData.count
                }
                if (card.supertype === "Champion"){
                    stats.champions += cardData.count
                }
            }
            else{
                if (card.type === "champion1" || card.type === "champion2" || card.type === "champion3"){
                    stats.units += cardData.count
                    stats.champions += cardData.count
                }
                else if (card.type === "follower"){
                    stats.followers += cardData.count
                }
                else if (card.type === "landmark"){
                    stats.landmarks += cardData.count
                }
                else if (card.type === "spell"){
                    if (card.speed === "equipment"){
                        stats.equipments += cardData.count
                    }
                    else{
                        stats.spells += cardData.count
                    }
                }
            }
        });

        console.log(stats, props.cards)

        updateCache(stats)
    }, [props.cards])

    const cardIcon = useAssetCache(updateCache=>{ datauri("/Assets/deck/card-icon.png").then(updateCache) })
    const unitIcon = useAssetCache(updateCache=>{ datauri("/Assets/deck/unit-icon.png").then(updateCache) })
    const champIcon = useAssetCache(updateCache=>{ datauri("/Assets/deck/champ-icon.png").then(updateCache) })
    const followerIcon = useAssetCache(updateCache=>{ datauri("/Assets/deck/follower-icon.png").then(updateCache) })
    const spellIcon = useAssetCache(updateCache=>{ datauri("/Assets/deck/spell-icon.png").then(updateCache)})
    const landmarkIcon = useAssetCache(updateCache=>{ datauri("/Assets/deck/landmark-icon.png").then(updateCache) })
    const equipmentIcon = useAssetCache(updateCache=>{ datauri("/Assets/deck/equipment-icon.png").then(updateCache) })

    if (!deckStats || !deckStats.cards){
        return null
    }
    return svgWrap(
        div(
            { className: "gutter-t flex column hsend vcenter gutter-b-3 deck-stats-card" },
            div(
                { className: "flex vhcenter" },
                div({
                    style: {
                        width: 128,
                        height: 128,
                        backgroundImage: `url(${cardIcon})`
                    }
                }),
                deckStats.cards
            ),
            div(
                { className: "flex vhcenter" },
                div({
                    style: {
                        width: 128,
                        height: 128,
                        backgroundImage: `url(${unitIcon})`
                    }
                }),
                deckStats.units
            ),
            div(
                { className: "flex vhcenter" },
                div({
                    style: {
                        width: 128,
                        height: 128,
                        backgroundImage: `url(${champIcon})`
                    }
                }),
                deckStats.champions
            ),
            div(
                { className: "flex vhcenter" },
                div({
                    style: {
                        width: 128,
                        height: 128,
                        backgroundImage: `url(${followerIcon})`
                    }
                }),
                deckStats.followers
            ),
            div(
                { className: "flex vhcenter" },
                div({
                    style: {
                        width: 128,
                        height: 128,
                        backgroundImage: `url(${spellIcon})`
                    }
                }),
                deckStats.spells
            ),
            div(
                { className: "flex vhcenter" },
                div({
                    style: {
                        width: 128,
                        height: 128,
                        backgroundImage: `url(${landmarkIcon})`
                    }
                }),
                deckStats.landmarks
            ),
            div(
                { className: "flex vhcenter" },
                div({
                    style: {
                        width: 128,
                        height: 128,
                        backgroundImage: `url(${equipmentIcon})`
                    }
                }),
                deckStats.equipments
            ),
        ),
    )
}

export default factory(deckStatsCard, cssLoaded)