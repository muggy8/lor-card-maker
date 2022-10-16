import factory, { div } from "/Utils/elements.js"
import { useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"

// dev imports
import SvgWrap from "/Components/card-template/svg-wrap.js"
import UnitRenderer from "/Components/card-template/unit.js"

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
        div(
            { className: "card-render-test" }, 
            SvgWrap(
                UnitRenderer({
                    mana: 5,
                    faction: ["noxus", "ionia", "runeterra"],
                    clan: "spider",
                    power: 5,
                    health: 5,
                    name: "test card",
                    keywords: [
                        "immobile",
                        "trap",
                        "lifesteal"
                    ]
                })
            )
        )
    )
}

const List = factory(ListComponent)
export default List