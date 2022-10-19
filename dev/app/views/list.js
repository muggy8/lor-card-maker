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

const types = [
    {
        component: Champion1, 
        labelKey: "champ1",
        editor: factory(
            CardEditorFactory(
                Champion1,
                {
                    name: "",
                    mana: 0,
                    power: 0,
                    health: 0,
                    clan: "",
                    art: "",
                    id: "",
                    faction: [],
                    keywords: [],
                    effect: "",
                    lvup: "",
                    rarity: "gem",
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
                    name: "",
                    mana: 0,
                    power: 0,
                    health: 0,
                    clan: "",
                    art: "",
                    id: "",
                    faction: [],
                    keywords: [],
                    effect: "",
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
                    name: "",
                    mana: 0,
                    power: 0,
                    health: 0,
                    clan: "",
                    art: "",
                    id: "",
                    faction: [],
                    keywords: [],
                    effect: "",
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
                    name: "",
                    mana: 0,
                    clan: "",
                    art: "",
                    id: "",
                    faction: [],
                    keywords: [],
                    effect: "",
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
                    name: "",
                    mana: 0,
                    clan: "",
                    art: "",
                    id: "",
                    faction: [],
                    keywords: [],
                    effect: "",
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
                    name: "",
                    mana: 0,
                    power: 0,
                    health: 0,
                    clan: "",
                    art: "",
                    id: "",
                    faction: [],
                    keywords: [],
                    effect: "",
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
            })
        ),
    )
}

const List = factory(ListComponent)
export default List