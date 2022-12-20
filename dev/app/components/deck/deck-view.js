import factory from "/Utils/elements.js";
import { useEffect, useState, useCallback} from "/cdn/react"
import deckCard from "./deck-card.js";

function DeckViewComponent(props){

    return props.cards.map(deckCardProps=>{
        return deckCard(deckCardProps)
    })
}

export default factory(DeckViewComponent)