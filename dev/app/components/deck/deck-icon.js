import deckView from "/Components/deck/deck-view.js";
import { useRef, useState } from "/cdn/react"
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
        datauri(`/Assets/deck/frame.png`).then(updateFrame)
    }, [props.region])

    const deckNameRef = useRef()
    const [nameFontSize, updateNameFontsize] = useState(56)
    useEffectDebounce(()=>{
        scaleFontSize(deckNameRef.current, 32, 24).then(()=>{
            
            updateNameFontsize(deckNameRef.current.offsetHeight)
        })
    }, 150, [props.name])

    return svgWrap(
        { width: 336, height: 512 },
        div(
            { 
                className: "deck-frame", 
                style: {
                    backgroundImage: frameUri ? `url(${frameUri})` : undefined,
                    "--name-height": nameFontSize + "px"
                } 
            },

            props.cards 
                ? div(
                    { className: "deck-contents-preview" },
                    deckView({cards: props.cards})
                )
                : undefined
        ),

        div(
            { className: "deck-name fitty-wrap card-text-bold", ref: deckNameRef },
            props.name
        )
    )
}

export default factory(deckIconComponent, cssLoaded)