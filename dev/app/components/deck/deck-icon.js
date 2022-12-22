import svgWrap from "/Components/card-template/svg-wrap.js";
import datauri from "/Utils/datauri.js";
import factory, { div, img } from "/Utils/elements.js";
import linkAsset from "/Utils/load-css.js";
import useAssetCache from "/Utils/use-asset-cache.js";

const cssLoaded = linkAsset("/Components/deck/deck-icon.css")

function deckIconComponent(props){
    const frameUri = useAssetCache(updateFrame=>{
        datauri("/Assets/deck/frame-0.png").then(updateFrame)
    }, [])

    const backgroundUri = useAssetCache(updateBackground=>{
        datauri("/Assets/keyword/frame.png").then(updateBackground)
    }, [])

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
        )
    )
}

export default factory(deckIconComponent, cssLoaded)