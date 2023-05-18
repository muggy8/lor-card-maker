import factory, { div, button, strong, input, section } from "/Utils/elements.js"
import { useContext, useState, useMemo } from "/cdn/react"
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import { deleteCard, getCardList } from "/Utils/service.js"
import listLimit from "/Components/list-limit.js"
import { typeToComponent } from "/Views/list.js"
import useToggle from "/Utils/use-toggle.js"

const cssLoaded = loadCss("/Views/batch-delete.css")

function BatchDeleteComponent(props){
    const globalState = useContext(Globals)

    const translate = useLang()
    const [refetch, refreshCardData] = useToggle(false)

    const savedCards = useAssetCache(updateSavedCards=>{
        getCardList({include: "deck"}).then(updateSavedCards)
    }, [refetch], [])

    const [searchTerm, updateSearchTerm] = useState("")

    const renderedItems = useMemo(()=>savedCards.map(cardData=>{
        const renderingComponent = typeToComponent(cardData.type)

        if (!renderingComponent){
            return null
        }

        if (searchTerm && cardData.name && !cardData.name.toLowerCase().includes(searchTerm)){
            return null
        }

        return ConfirmDeleteWrapper(
            {
                key: cardData.id,
                onConfirm: ()=>{
                    deleteCard(cardData.id).then(refreshCardData)
                }
            },
            renderingComponent(cardData)
        )
    }).filter(item=>!!item), [savedCards, searchTerm, refreshCardData])

    return section(
        { id: "bulk-delete" },
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
            listLimit(renderedItems),
        )
    )
}

export function ConfirmDeleteWrapperComponent(props){
    const [showConfirmOverlay, updateShowCondirmOverlay] = useState(false)

    const translate = useLang()

    return div(
        {
            className: "clickable gutter-trbl-.5 box-xs-6 box-m-3 flex column vhcenter relative",
        },
        ...(Array.isArray(props.children) ? props.children : [props.children]),
        showConfirmOverlay 
            ? div(
                { className: "confirm-overlay active gutter-trbl-2 flex vhcenter" },
                div(
                    strong(translate("confirm_delete")),
                    div(
                        { className: "flex gutter-t-1" },
                        button(
                            { className: "grow gutter-trbl-0.5 flex vhcenter", onClick: props.onConfirm}, 
                            strong(translate("yes")),
                        ),
                        div({ className: "gutter-rl-.5 gutter-tb-1.5" }),
                        button(
                            { className: "grow gutter-trbl-0.5 flex vhcenter", onClick: ()=>updateShowCondirmOverlay(false) }, 
                            strong(translate("no")),                    )
                    ),
                )
            )
            : div(
                { 
                    className: "confirm-overlay delete-icon gutter-trbl-1 flex vhcenter",
                    onClick: ()=>{
                        updateShowCondirmOverlay(true)
                    }
                },
                div( {className: "icon multiply"} ),
            )
    )
}

export const ConfirmDeleteWrapper = factory(ConfirmDeleteWrapperComponent)

export default factory(BatchDeleteComponent, cssLoaded)