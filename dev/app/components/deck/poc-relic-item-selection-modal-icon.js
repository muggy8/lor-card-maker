import factory,  { div, strong, button, nav, section, label, fragment, img }  from "/Utils/elements.js"
import { useState, useCallback, useRef, useEffect, useContext, useLayoutEffect, createElement } from "/cdn/react"
import datauri from "/Utils/datauri.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import loadCss from "/Utils/load-css.js"
import { trimBase64StingIcon } from "/Components/card-template/keyword-renderer.js"

const cssLoaded = loadCss("/Components/deck/poc-relic-item-selection-modal-icon.css")

function modalIconSelectionSizer (props){
    const [expanded, updateExpanded] = useState(false)

    const expandIcon = useCallback((ev)=>{
        ev.preventDefault()
        if (expanded){
            return
        }

        updateExpanded(true)

    }, [expanded])

    const collapseIcon = useCallback((ev)=>{
        ev.preventDefault()
        updateExpanded(false)
    }, [])

    return div(
        {
            onContextMenu: expanded
                ? undefined
                : expandIcon
            ,
            className: expanded 
                ? "clickable box-12" 
                : "clickable box-4 box-s-3"
            ,
        },
        RelicItemRitoIcon({...props, expanded, expandIcon, collapseIcon})
    )
}

function relicItemRitoIcon(props){

    const iconUri = useAssetCache(updateIconUri=>{
        if (props.expanded || iconUri){
            return
        }
        datauri(props.url).then(updateIconUri)
    }, [props.url, props.expanded])

    const fullIconUri = useAssetCache(updateFullIconUri=>{
        if (!props.expanded || fullIconUri){
            return
        }
        datauri(props.urlFull).then(trimBase64StingIcon).then(updateFullIconUri)
    }, [props.urlFull, props.expanded])

    if (props.expanded){
        return div(
            { 
                className: `text-center poc-relic-item-selection-modal-icon-box rectangle image-background ${fullIconUri ? "" : "loading"}` , 
                style: {
                    backgroundImage: fullIconUri 
                        ? `url(${fullIconUri})` 
                        : `url(${iconUri})`
                    , // when the full icon is loading, show the smol icon and the loading spinner together
                    backgroundPosition: fullIconUri ? "top" : undefined
                }
            },
            fullIconUri
                ? div(
                    { className: "flex" },
                    button(
                        { className: "gutter-trbl-.5" },
                        div({ className: "icon no-eye", onClick: props.collapseIcon })
                    ),
                    div({ className: "gutter-l" }),
                    button(
                        { className: "gutter-trbl-.5" },
                        div({ className: "icon plus", onClick: props.onClick })
                    )
                )
                : div({ 
                    className: "loading-placeholder icon loading",
                })
        )
    }

    return div(
        { 
            className: `text-center poc-relic-item-selection-modal-icon-box square image-background ${iconUri ? "" : "loading"}` , 
            style: iconUri 
                ? {
                    backgroundImage: `url(${iconUri})`,
                    backgroundSize: "100% 100%"
                }
                : undefined
            ,
            onClick: iconUri
                ? props.onClick
                : undefined
            ,
        },
        iconUri
            ? undefined
            : div({ className: "loading-placeholder icon loading" })
    )
}

export const RelicItemRitoIcon = factory(relicItemRitoIcon)

export default factory(modalIconSelectionSizer, cssLoaded)