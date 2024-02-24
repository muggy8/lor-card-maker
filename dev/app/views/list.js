import factory, { button, div, input, label, section } from "/Utils/elements.js"
import { useContext, useState } from "/cdn/react"
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { getCardList } from "/Utils/service.js"
import listLimit from "/Components/list-limit.js"
import deckBuilder from "/Views/deck-builder.js"

import Spell from "/Components/card-template/spell.js"
import Champion1 from "/Components/card-template/champion1.js"
import Champion2 from "/Components/card-template/champion2.js"
import Champion3 from "/Components/card-template/champion3.js"
import Follower from "/Components/card-template/follower.js"
import Landmark from "/Components/card-template/landmark.js"
import Keyword from "/Components/card-template/keyword.js"
import CardEditorFactory from "/Views/card-editor.js"
import DeckBuilder from "/Views/deck-builder.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import deckIcon from "/Components/deck/deck-icon.js"
import pocContent from "/Components/card-template/poc-content.js"

const sharedDefaultCardData = {
    name: "",
    mana: 0,
    clan: [],
    art: "",
    id: "",
    faction: [],
    keywords: [],
    effect: "",
    orangeWords: [],
    blueWords: [],
    dataVersion: 2,
    transform: {x: 0, y: 0, scale: 1},
    associatedCards: [],
    fileName: "",
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
                textBgColor: null,
                mana: "",
                lvup: "",
            }
        ),
    },
    {
        component: Spell,
        labelKey: "equipment",
        editor: CardEditorFactory(
            Spell,
            {
                ...sharedDefaultCardData,
                power: null,
                health: null,
                speed: "equipment",
                rarity: "",
                keywords: ["equipment"],
                type: "spell",
                power: 0,
                health: 0,
                textBgColor: null,
                mana: 0,
                lvup: "",
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
        editor: CardEditorFactory(
            Keyword,
            {
                id: "",
                name: "",
                fileName: "",
                type: "keyword",
                effect: "",
                blueWords: [],
                orangeWords: [],
                dataVersion: 2,
                icons: [],
                largerIcon: false,
            }
        ),
    },
    {
        component: deckIcon,
        labelKey: "deck",
        beta: true,
        editor: deckBuilder
    },
    {
        component: pocContent,
        labelKey: "poc_power",
        editor: CardEditorFactory(
            pocContent,
            {
                id: "",
                name: "",
                fileName: "",
                type: "poc",
                pocType: "power",
                rarity: "",
                effect: "",
                blueWords: [],
                orangeWords: [],
                dataVersion: 2,
                art: "",
                transform: {x: 0, y: 0, scale: 1},
            }
        ),
        beta: true,
    },
    {
        component: pocContent,
        labelKey: "poc_item",
        editor: CardEditorFactory(
            pocContent,
            {
                id: "",
                name: "",
                fileName: "",
                type: "poc",
                pocType: "item",
                rarity: "",
                effect: "",
                blueWords: [],
                orangeWords: [],
                dataVersion: 2,
                art: "",
                transform: {x: 0, y: 0, scale: 1},
            }
        ),
        beta: true,
    },
    {
        component: pocContent,
        labelKey: "poc_relic",
        editor: CardEditorFactory(
            pocContent,
            {
                id: "",
                name: "",
                fileName: "",
                type: "poc",
                pocType: "relic",
                rarity: "",
                effect: "",
                blueWords: [],
                orangeWords: [],
                dataVersion: 2,
                art: "",
                transform: {x: 0, y: 0, scale: 1},
            }
        ),
        beta: true,
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
        case "deck": return deckIcon
        case "poc": return pocContent
        default: return
    }
}

const cssLoaded = loadCss("/Views/list.css")

function ListComponent(){
    const globalState = useContext(Globals)
    const lowSpecsMode = globalState.state.settings.lowSpecsMode === true

    const translate = useLang()

    const savedCards = useAssetCache(updateSavedCards=>{
        getCardList({include: "deck"}).then(updateSavedCards)
    }, [], [])

    const [searchTerm, updateSearchTerm] = useState("")

    return section(
        {
            id: "card-type-list",
            className: "gutter-t-2",
        },
        div(
            { className: "flex gutter-rbl" },
            div(
                { className: "flex grow gutter-r" },
                input({ 
                    className: "grow gutter-trbl-.5",
                    value: searchTerm,
                    placeholder: translate("search"),
                    type: "search",
                    onChange: (ev)=>{
                        updateSearchTerm((ev.target.value || "").toLowerCase())
                    },
                }),
            ),
            button(
                { className: "gutter-trbl-0.5 flex vhcenter", onClick: ()=>updateSearchTerm("") }, 
                div({ className: "icon multiply" }),
            )
        ),
        div(
            { className: "gutter-trbl-.5 flex",},
            listLimit(
                { defaultSize: lowSpecsMode ? 4 : undefined },
                types.map((type)=>{
                    const labelName = translate("new_label", {
                        cardType: translate(type.labelKey),
                        betaIf: type.beta ? translate("beta") : ""
                    }, false)

                    if (searchTerm && !labelName.toLowerCase().includes(searchTerm)){
                        return null
                    }

                    return div(
                        {
                            className: "clickable gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter",
                            key: type.labelKey,
                            onClick: ()=>{
                                globalState.setView(type.editor)
                            }
                        },
                        type.component({
                            ...type.editor.defaultCardData,
                            name: labelName
                        })
                    )
                }).filter(item=>!!item),

                savedCards.map((cardData)=>{
                    const renderingComponent = typeToComponent(cardData.type)
                    if (!renderingComponent){
                        return null
                    }

                    if (searchTerm && cardData.name && !cardData.name.toLowerCase().includes(searchTerm)){
                        return null
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
                        (()=>{
                            try {
                                return renderingComponent(cardData)
                            }
                            catch(err){
                                return renderingComponent({ 
                                    name: translate('error_loading_card', {
                                        cardName: cardData.name,
                                    }) 
                                })
                            }
                        })(),
                    )
                }).filter(item=>!!item),
            ),
        ),
    )
}

const List = factory(ListComponent, cssLoaded)
export default List
