import factory, { div } from "/Utils/elements.js"
import { useState, useCallback } from "/cdn/react" 

function ListComponent(props){
    return div(
        "placeholder"
    )
}

const List = factory(ListComponent)
export default List