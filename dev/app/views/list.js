import factory, { div } from "/Utils/elements.js"
import { useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"

// dev imports
import UnitRenderer from "/Components/card-template/landmark.js"

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
            UnitRenderer({
                mana: 5,
                faction: ["noxus", "ionia", "runeterra"],
                clan: "spider",
                // power: 5,
                // health: 5,
                name: "test card",
                keywords: [
                    "immobile",
                    "trap",
                    "lifesteal"
                ],
                effect: "<skill/>Play: create a Testing Text",
                lvup: "I've seen you play Testing Text",
                orangeWords: ["Play"],
                blueWords: ["Testing Text"]
            })

        )
    )
}

const List = factory(ListComponent)
export default List