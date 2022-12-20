import factory from "/Utils/elements.js";
import { useEffect, useState, useCallback} from "/cdn/react"
import deckCard from "./deck-card.js";

function DeckViewComponent(props){

    return props.cards.map(deckCardProps=>{
        const cardId = deckCardProps.card.id || deckCardProps.card.cardCode
        return deckCard({...deckCardProps, key: cardId})
    })
}

export default factory(DeckViewComponent)