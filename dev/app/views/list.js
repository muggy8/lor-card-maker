import factory, { div } from "/Utils/elements.js"
import { useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"

// dev imports
import SpellComponent from "/Components/card-template/spell.js"

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
            SpellComponent({
                mana: 5,
                faction: ["noxus", "ionia", "runeterra"],
                clan: "Asian",
                power: 5,
                health: 5,
                name: "Emotional Damage",
                speed: "equipment",
                keywords: [
                    "immobile",
                    "trap",
                    "equipment"
                ],
                effect: "<skill/>Play: deal 1 damage to your nexus.\nWhen opponent attacks, I automatically block the strongest enemy.",
                orangeWords: ["Play"],
                blueWords: [],
                rarity: "common",
            })

        )
    )
}

const List = factory(ListComponent)
export default List