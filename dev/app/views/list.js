import factory, { div } from "/Utils/elements.js"
import { useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"

// dev imports
import UnitRenderer from "/Components/card-template/follower.js"

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
                power: 5,
                health: 5,
                name: "The pulsing neutron star underneath the golden spacecraft",
                keywords: [
                    "immobile",
                    "trap",
                    "lifesteal"
                ],
                effect: "<skill/>Play: Create a Testing Text if you don't already have one and give it +1|0 for each card you played this round unit the end of your opponent's next round.",
                //\n<last breath/>Last Breath: Grant Testing Text Everywhere +1 damange.\nRound Start: Flow: Reduce the cost of Testing Text Everywhere by 1 this round.
                lvup: "You play Testing Text 3+ times",
                orangeWords: ["Play", "Last Breath", "Everywhere", "Round Start", "Flow"],
                blueWords: ["Testing Text"]
            })

        )
    )
}

const List = factory(ListComponent)
export default List