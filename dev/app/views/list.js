import factory, { div, h2 } from "/Utils/elements.js"
import { useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"

import Spell from "/Components/card-template/spell.js"
import Champion1 from "/Components/card-template/champion1.js"
import Champion2 from "/Components/card-template/champion2.js"
import Champion3 from "/Components/card-template/champion3.js"
import Follower from "/Components/card-template/follower.js"
import Landmark from "/Components/card-template/landmark.js"
import CardEditorFactory from "/Views/card-editor.js"

const sharedDefaultCardData = {
    name: "",
    mana: 0,
    clan: "",
    art: "",
    id: "",
    faction: [],
    keywords: [],
    effect: "",
    orangeWords: [],
    blueWords: [],
}

const types = [
    {
        component: Champion1, 
        labelKey: "champ1",
        editor: factory(
            CardEditorFactory(
                Champion1,
                {
                    ...sharedDefaultCardData,
                    power: 0,
                    health: 0,
                    lvup: "",
                    rarity: "champion",
                }
            ),
        )
    },
    {
        component: Champion2, 
        labelKey: "champ2",
        editor: factory(
            CardEditorFactory(
                Champion2,
                {
                    ...sharedDefaultCardData,
                    power: 0,
                    health: 0,
                    lvup: "",
                    rarity: "",
                }
            )
        )
    },
    {
        component: Champion3, 
        labelKey: "champ3",
        editor: factory(
            CardEditorFactory(
                Champion3,
                {
                    ...sharedDefaultCardData,
                    power: 0,
                    health: 0,
                    lvup: "",
                    rarity: "",
                }
            ),
        )
    },
    {
        component: Landmark, 
        labelKey: "landmark",
        editor: factory(
            CardEditorFactory(
                Landmark,
                {
                    ...sharedDefaultCardData,
                    lvup: "",
                    rarity: "",
                }
            ),
        )
    },
    {
        component: Spell, 
        labelKey: "spell",
        editor: factory(
            CardEditorFactory(
                Spell,
                {
                    ...sharedDefaultCardData,
                    power: null,
                    health: null,
                    speed: "trap",
                    rarity: "",
                }
            ),
        )
    },
    {
        component: Follower, 
        labelKey: "follower",
        editor: factory(
            CardEditorFactory(
                Follower,
                {
                    ...sharedDefaultCardData,
                    power: 0,
                    health: 0,
                    lvup: "",
                    rarity: "",
                }
            ),
        )
    },
]

loadCss("/Views/list.css")

function ListComponent(props){
    const globalState = useContext(Globals)

    const translate = useLang()

    return div(
        {
            id: "card-type-list",
            // style: {
            //     marginTop: globalState.state.bannerHeight || 0,
            // },
        },
        div(
            { className: "flex hcenter"},
            h2(
                translate("i_want_to_make")
            ),
        ),
        div(
            { className: "gutter-trbl-.5 flex",},
            types.map((type)=>{
                return div(
                    { 
                        className: "gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter", 
                        key: type.labelKey,
                        onClick: ()=>{
                            globalState.setView(type.editor)
                        }
                    },
                    type.component({
                        name: translate(type.labelKey)
                    })
                )
            }),

            // stuff for testing
            /* 
            div(
                { className: "gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter" },
                Spell({
                    name: "Stat Stick",
                    mana: 3,
                    clan: "Emotional Damage",
                    art: "",
                    id: "",
                    faction: [ 'demacia',],
                    keywords: ["equipment","silence",],
                    rarity: "champion",
                    speed: "equipment",
                    power: 4,
                    health: 4,

                    // lvup: "All Tests Everywhere have concluded successfully",
                    // effect: "<skill/>Play: Test all systems Everywhere.",
                    // orangeWords: ["Play", "Test", "Everywhere"],
                    // blueWords: ["Tests"],
                })
            )
            */
        ),
    )
}

const List = factory(ListComponent)
export default List