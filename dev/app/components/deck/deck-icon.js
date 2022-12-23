import { useRef, useEffect } from "/cdn/react"
import { scaleFontSize } from "/Components/card-template/effect-text.js";
import svgWrap from "/Components/card-template/svg-wrap.js";
import datauri from "/Utils/datauri.js";
import factory, { div, img } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";
import useAssetCache from "/Utils/use-asset-cache.js";
import useEffectDebounce from "/Utils/use-debounce-effect.js";

const cssLoaded = linkAsset("/Components/deck/deck-icon.css")

function deckIconComponent(props){
    const frameUri = useAssetCache(updateFrame=>{
        datauri(`/Assets/deck/frame-${Math.min((props.region || []).length, 3)}.png`).then(updateFrame)
    }, [props.region])

    const backgroundUri = useAssetCache(updateBackground=>{
        datauri("/Assets/keyword/frame.png").then(updateBackground)
    }, [])

    const deckNameRef = useRef()
    useEffectDebounce(()=>{
        scaleFontSize(deckNameRef.current, 24, 16)
    }, 150, [props.name])

    return svgWrap(
        { width: 256, height: 256 },
        div(
            { 
                className: "deck-frame", 
                style: {
                    backgroundImage: backgroundUri ? `url(${backgroundUri})` : undefined
                } 
            },
            div(
                {
                    className: "deck-frame", 
                    style: {
                        backgroundImage: frameUri ? `url(${frameUri})` : undefined
                    } 
                }
            )
        ),

        div(
            { className: "deck-name fitty-wrap card-text-bold", ref: deckNameRef },
            props.name
        )
    )
}

export default factory(deckIconComponent, cssLoaded)