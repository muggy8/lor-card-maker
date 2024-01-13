import factory,  { div, strong, button, nav, section, label, fragment, img }  from "/Utils/elements.js"
import { useState, useCallback, useRef, useEffect, useContext, useLayoutEffect, createElement } from "/cdn/react"
import datauri from "/Utils/datauri.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import loadCss from "/Utils/load-css.js"

const cssLoaded = loadCss("/Components/deck/poc-relic-item-selection-modal-icon.css")

function relicItemSelectionModalRitoIcon(props){
    const [expanded, updateExpanded] = useState(false)

    const iconUri = useAssetCache(updateIconUri=>{
        datauri(props.url).then(updateIconUri)
    }, [props.url])

    const [fullIconUri, updateFullIconUri] = useState()
    const loadFullIcon = useCallback(()=>{
        datauri(props.urlFull).then(updateFullIconUri)
    }, [props.urlFull])

    const expandIcon = useCallback((ev)=>{
        ev.preventDefault()
        if (expanded){
            return
        }

        updateExpanded(true)

        if (!fullIconUri){
            loadFullIcon()
        }
    }, [fullIconUri, expanded])

    const collapseIcon = useCallback((ev)=>{
        ev.preventDefault()
        updateExpanded(false)
    }, [])

    if (expanded){
        return div(
            { 
                className: `text-center box-12 clickable poc-relic-item-selection-modal-icon-box rectangle image-background ${fullIconUri ? "" : "loading"}` , 
                onContextMenu: collapseIcon,
                style: {
                    backgroundImage: fullIconUri ? undefined : `url(${iconUri})`, // when the full icon is loading, show the smol icon and the loading spinner together
                }
            },
            fullIconUri
                ? img({
                    src: fullIconUri
                })
                : 
                div({ 
                    className: "loading-placeholder icon loading",
                })
        )
    }

    return div(
        { 
            className: `text-center box-4 box-s-3 clickable poc-relic-item-selection-modal-icon-box square${iconUri ? "" : "loading"}` , 
            onContextMenu: expandIcon
        },
        iconUri
            ? img({
                src: iconUri
            })
            : div({ className: "loading-placeholder icon loading" })
    )
}

export default factory(relicItemSelectionModalRitoIcon)