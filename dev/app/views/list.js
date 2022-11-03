import factory, { div, section } from "/Utils/elements.js"
import { useContext, useEffect, useState } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { getCardList } from "/Utils/service.js"
import listLimit from "/Components/list-limit.js"

import Spell from "/Components/card-template/spell.js"
import Champion1 from "/Components/card-template/champion1.js"
import Champion2 from "/Components/card-template/champion2.js"
import Champion3 from "/Components/card-template/champion3.js"
import Follower from "/Components/card-template/follower.js"
import Landmark from "/Components/card-template/landmark.js"
import Keyword from "/Components/card-template/keyword.js"
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
    dataVersion: 2,
    transform: {x: 0, y: 0, scale: 1}
}

const shade = {
    blur: 15,
    darkness: 0.25,
    gradientLocation: [50, 75],
}

Object.freeze(shade)
Object.freeze(shade.gradientLocation)

export const defaultShade = shade

const types = [
    {
        component: Champion1, 
        labelKey: "champ1",
        editor: CardEditorFactory(
            Champion1,
            {
                ...sharedDefaultCardData,
                power: 0,
                health: 0,
                lvup: "",
                rarity: "champion",
                type: "champion1",
                shade,
            }
        ),
    },
    {
        component: Champion2, 
        labelKey: "champ2",
        editor: CardEditorFactory(
            Champion2,
            {
                ...sharedDefaultCardData,
                power: 0,
                health: 0,
                lvup: "",
                rarity: "",
                type: "champion2",
                shade,
            }
        )
    },
    {
        component: Champion3, 
        labelKey: "champ3",
        editor: CardEditorFactory(
            Champion3,
            {
                ...sharedDefaultCardData,
                power: 0,
                health: 0,
                lvup: "",
                rarity: "",
                type: "champion3",
                shade,
            }
        ),
    },
    {
        component: Spell, 
        labelKey: "spell",
        editor: CardEditorFactory(
            Spell,
            {
                ...sharedDefaultCardData,
                power: null,
                health: null,
                speed: undefined,
                rarity: "",
                type: "spell",
                power: null,
                health: null,
                mana: "",
            }
        ),
    },
    {
        component: Follower, 
        labelKey: "follower",
        editor: CardEditorFactory(
            Follower,
            {
                ...sharedDefaultCardData,
                power: 0,
                health: 0,
                lvup: "",
                rarity: "",
                type: "follower",
                shade,
            }
        ),
    },
    {
        component: Landmark, 
        labelKey: "landmark",
        editor: CardEditorFactory(
            Landmark,
            {
                ...sharedDefaultCardData,
                lvup: "",
                rarity: "",
                keywords: ["landmark"],
                type: "landmark",
                shade,
            }
        ),
    },
    {
        component: Keyword, 
        labelKey: "keyword",
        beta: true,
        editor: CardEditorFactory(
            Keyword,
            {
                name: "",
                type: "keyword",
                effect: "",
                blueWords: [],
                orangeWords: [],
                dataVersion: 2,
            }
        ),
    },
]

export function typeToComponent(type){
    switch(type){
        case "champion1": return Champion1
        case "champion2": return Champion2
        case "champion3": return Champion3
        case "landmark": return Landmark
        case "follower": return Follower
        case "spell": return Spell
        case "keyword": return Keyword
        default: return 
    }
}

const cssLoaded = loadCss("/Views/list.css")

function ListComponent(){
    const globalState = useContext(Globals)

    const translate = useLang()

    const [savedCards, updateSavedCards] = useState([])

    useEffect(()=>{
        getCardList().then(updateSavedCards)
    }, [])

    return section(
        {
            id: "card-type-list",
            className: "gutter-t-2",
        },
        div(
            { className: "gutter-trbl-.5 flex",},
            listLimit(
                types.map((type)=>{
                    return div(
                        { 
                            className: "clickable gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter", 
                            key: type.labelKey,
                            onClick: ()=>{
                                globalState.setView(type.editor)
                            }
                        },
                        type.component({
                            name: `${translate("new")} ${translate(type.labelKey)}` + (type.beta ? " " + translate("beta") : "")
                        })
                    )
                }),
    
                savedCards.map((cardData)=>{
                    const renderingComponent = typeToComponent(cardData.type)
                    if (!renderingComponent){
                        return div({key: cardData.id})
                    }
                    return div(
                        { 
                            className: "clickable gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter", 
                            key: cardData.id,
                            onClick: ()=>{
                                const editor = types.find(type=>type.component === renderingComponent)
                                
                                globalState.setView(editor.editor)
                                globalState.patchState({cardId: cardData.id})
                            }
                        },
                        renderingComponent(cardData)
                    )
                }),
            ),
        ),
    )
}

const List = factory(ListComponent, cssLoaded)
export default List