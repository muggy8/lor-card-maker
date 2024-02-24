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
import pocIcon from "/Components/card-template/poc-icon.js"

const cssLoaded = loadCss("/Components/card-template/poc-content.css")

function PoCContent(props){

    const background = useAssetCache(updateBackground=>{
        datauri("/Assets/keyword/frame.png").then(updateBackground)
    }, [])

    return SvgWrap(
        {
            loading: !background || props.loading,
            onTransform: props.updateTransform, 
            ...(props.transform || {x: 0, y: 0, scale: 1}),
        },
        background
            ? div(
                { className: `poc-content ${props.rarity} ${props.pocType}` },
                div(
                    {
                        className: "background",
                        style: {
                            backgroundImage: background ? `url(${background})` : "none"
                        }
                    },
                    pocIcon({
                        className: "poc-content-icon",
                        ...props
                    })
                ),
            )
            : undefined
        ,
    )
}

export default factory(PoCContent, cssLoaded)