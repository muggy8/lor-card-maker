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
                clan: "Asian dad",
                power: 5,
                health: 5,
                name: "Steven He's Father",
                keywords: [
                    "immobile",
                    "trap",
                    "lifesteal"
                ],
                effect: "<skill/>Play: Create a Emotional Damage if you don't already have one.\n<last breath/>Last Breath: Grant Emotional Damage Everywhere +1 damange.\nRound Start: Flow: Reduce the cost of Emotional Damage Everywhere by 1 this round.",
                lvup: "You play Emotional Damage 3+ times",
                orangeWords: ["Play", "Last Breath", "Everywhere", "Round Start", "Flow"],
                blueWords: ["Emotional Damage"]
            })

        )
    )
}

const List = factory(ListComponent)
export default List