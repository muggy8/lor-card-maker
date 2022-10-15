import factory, { div } from "/Utils/elements.js"
import { useState, useCallback, useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"

function ListComponent(props){
    const globalState = useContext(Globals)

    console.log(globalState)

    return div(
        "placeholder"
    )
}

const List = factory(ListComponent)
export default List