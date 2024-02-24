import factory, { div } from "/Utils/elements.js"
import { useRef, useState, useEffect, useContext } from "/cdn/react"
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import ArtRenderer from "/Components/card-template/image-render.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"
import fitty from "/cdn/fitty"
import datauri from "/Utils/datauri.js"
import useEffectDebounce from "/Utils/use-debounce-effect.js"
import concurrencyManagerFactory from "/Utils/concurrency-manager.js"
import useAssetCache, { useAssetCacheDebounced } from "/Utils/use-asset-cache.js"
import { AutoFitClanText } from "/Components/card-template/unit.js"
import useLang from "/Utils/use-lang.js"

const cssLoaded = loadCss("/Components/card-template/poc-icon.css")

function PoCIcon(props){
    const globalState = useContext(Globals)

    const backdropUri = useAssetCache(updateBackdropUri=>{
        datauri("/Assets/spell/backdrop.png").then(updateBackdropUri)
    }, [])

    const iconFrame = useAssetCache(updateFrameUri=>{
        switch(props.pocType){
            case "item":
                datauri("/Assets/keyword/poc-item-frame.png").then(updateFrameUri)
                break
            case "relic":
                datauri("/Assets/keyword/poc-relic-frame.png").then(updateFrameUri)
                break
            case "power": 
            default: 
                datauri("/Assets/keyword/poc-frame-overlay.png").then(updateFrameUri)
        }
        
    }, [props.pocType])

    const iconFrameCover = useAssetCache(updateFrameCoverUri=>{
        switch(props.pocType){
            case "item":
            case "relic":
                updateFrameCoverUri("")
                break
            case "power":
            default: 
                datauri("/Assets/keyword/poc-frame-overlay-cover.png").then(updateFrameCoverUri)
        }
    }, [props.pocType,])

    const iconRarityFrame = useAssetCache(updateFrameRarityUri=>{
        switch(props.pocType){
            case "item":
                switch(props.rarity){
                    case "common": 
                        datauri("/Assets/keyword/poc-item-frame-overlay-common.png").then(updateFrameRarityUri)
                        break
                    case "rare": 
                        datauri("/Assets/keyword/poc-item-frame-overlay-rare.png").then(updateFrameRarityUri)
                        break
                    case "epic": 
                        datauri("/Assets/keyword/poc-item-frame-overlay-epic.png").then(updateFrameRarityUri)
                        break
                    case "champion": 
                    case "legendary": 
                        datauri("/Assets/keyword/poc-item-frame-overlay-legendary.png").then(updateFrameRarityUri)
                        break
                    case "special": 
                        datauri("/Assets/keyword/poc-item-frame-overlay-special.png").then(updateFrameRarityUri)
                        break
                    default:
                        datauri("/Assets/keyword/poc-item-frame-overlay-color.png").then(updateFrameRarityUri)
                }
                break
            case "relic":
                switch(props.rarity){
                    case "common": 
                        datauri("/Assets/keyword/poc-relic-frame-overlay-common.png").then(updateFrameRarityUri)
                        break
                    case "rare": 
                        datauri("/Assets/keyword/poc-relic-frame-overlay-rare.png").then(updateFrameRarityUri)
                        break
                    case "epic": 
                        datauri("/Assets/keyword/poc-relic-frame-overlay-epic.png").then(updateFrameRarityUri)
                        break
                    case "champion": 
                    case "legendary": 
                        datauri("/Assets/keyword/poc-relic-frame-overlay-legendary.png").then(updateFrameRarityUri)
                        break
                    case "special": 
                        datauri("/Assets/keyword/poc-relic-frame-overlay-special.png").then(updateFrameRarityUri)
                        break
                    default:  
                        datauri("/Assets/keyword/poc-relic-frame-overlay-color.png").then(updateFrameRarityUri)
                }
                break
            case "power":
            default: 
                switch(props.rarity){
                    case "common": 
                        datauri("/Assets/keyword/poc-frame-overlay-common.png").then(updateFrameRarityUri)
                        break
                    case "rare": 
                        datauri("/Assets/keyword/poc-frame-overlay-rare.png").then(updateFrameRarityUri)
                        break
                    case "epic": 
                        datauri("/Assets/keyword/poc-frame-overlay-epic.png").then(updateFrameRarityUri)
                        break
                    case "champion": 
                    case "legendary":
                        datauri("/Assets/keyword/poc-frame-overlay-legendary.png").then(updateFrameRarityUri) 
                        break
                    case "special": 
                        datauri("/Assets/keyword/poc-frame-overlay-special.png").then(updateFrameRarityUri)
                        break
                    default:
                        datauri("/Assets/keyword/poc-frame-overlay-color.png").then(updateFrameRarityUri)
                }
        }
    }, [props.pocType, props.rarity])

    const iconGem = useAssetCache(updaterRarityGem=>{
        switch(props.rarity){
            case "common": 
                datauri("/Assets/keyword/poc-common.png").then(updaterRarityGem)
                break
            case "rare": 
                datauri("/Assets/keyword/poc-rare.png").then(updaterRarityGem)
                break
            case "epic": 
                datauri("/Assets/keyword/poc-epic.png").then(updaterRarityGem)
                break
            case "champion": 
            case "legendary":
                datauri("/Assets/keyword/poc-legendary.png").then(updaterRarityGem)
                break 
            case "special": 
                datauri("/Assets/keyword/poc-special.png").then(updaterRarityGem)
                break
            default:
                updaterRarityGem("")
        }
    }, [props.rarity])

    console.log({iconGem})

    return div(
        { className: `poc-icon-sticker ${props.rarity} ${props.pocType} ${props.className}` },
        div(
            {
                className: "art",
                style: {
                    backgroundImage: !props.art && globalState.state.defaultBg && backdropUri
                        ? `url(${backdropUri})`
                        : "none"
                    ,
                    "--scale": props.transform ? props.transform.scale : 1,
                    "--left": props.transform ? props.transform.x : 0,
                    "--top": props.transform ? props.transform.y : 0,
                },
            },
            div(
                {className: "scale-adjuster"},
                ArtRenderer({ url: props.art })
            )
        ),

        iconFrame
            ? div(
                { 
                    className: "frame-overlay", 
                    style: {
                        backgroundImage: `url(${iconFrame})`
                    }
                }
            )
            : undefined
        ,
        iconFrameCover 
            ? div(
                { 
                    className: "frame-overlay-cover",
                    style: {
                        backgroundImage: `url(${iconFrameCover})`
                    }
                }
            )
            : undefined
        ,
        iconRarityFrame 
            ? div(
                { 
                    className: "frame-rarity",
                    style: {
                        backgroundImage: `url(${iconRarityFrame})`
                    }
                }
            )
            : undefined
        ,
        iconGem 
            ? div(
                { 
                    className: "frame-rarity-gem",
                    style: {
                        backgroundImage: `url(${iconGem})`
                    }
                }
            )
            : undefined
        ,
    )
}

export default factory(PoCIcon, cssLoaded)