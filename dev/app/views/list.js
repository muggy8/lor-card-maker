import factory, { div } from "/Utils/elements.js"
import { useState, useCallback, useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"

loadCss("/Views/list.css")

function ListComponent(props){
    const globalState = useContext(Globals)

    return div(
        {
            style: {
                marginTop: globalState.state.bannerHeight || 0,
            },
            className: "gutter-trbl-.5 flex",
        },
        "placeholder"
    )
}

const List = factory(ListComponent)
export default List