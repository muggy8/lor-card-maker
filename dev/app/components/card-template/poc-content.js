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

    const divisionUri = useAssetCache(updateDivisionUri=>{
        datauri("/Assets/keyword/division.png").then(updateDivisionUri)
    }, [])

    const concurrencyManagerRef = useRef()
    useEffect(()=>{
		concurrencyManagerRef.current = concurrencyManagerFactory()
	}, [])

    const cardTextAreaRef = useRef()
    useEffectDebounce(()=>{
		if (!background){
			return
		}
        concurrencyManagerRef.current.sequential(()=>{
            return scaleFontSize(cardTextAreaRef.current)
        })
    }, 300, [props.name, props.effect, props.pocType, props.rarity,, !!background])
    
    const nameRef = useRef()
    useEffectDebounce(()=>{
		if (!background){
			return
		}
        concurrencyManagerRef.current.concurrent(()=>{
            return scaleFontSize(nameRef.current, 60, 16)
        })
    }, 200, [props.name, props.effect, props.pocType, props.rarity, !!background])
    
    const typeTextRef = useRef()
    useEffectDebounce(()=>{
		if (!background){
			return
		}
        concurrencyManagerRef.current.concurrent(()=>{
            return scaleFontSize(typeTextRef.current, 40, 16)
        })
    }, 100, [props.name, props.effect, props.pocType, props.rarity,, !!background])

    if (props.showOnlyIcon){
        return SvgWrap(
            {
                loading: !background || props.loading,
                onTransform: props.updateTransform, 
                ...(props.transform || {x: 0, y: 0, scale: 1}),
                width: 256,
                height: 256,
            },
            pocIcon({
                className: "poc-content icon-only",
                ...props
            }),
        )
    }

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

                    div(
                        { className: "poc-content-icon" },
                        pocIcon(props),
                    ),

                    div({
                        className: "division",
                        style: {
                            backgroundImage: divisionUri ? `url(${divisionUri})` : "none"
                        },
                    }),

                    div(
                        { className: "card-text-wrapper", ref: cardTextAreaRef },
    
                        props.name
                            ? div(
                                { className: "name fitty-wrap card-text-bold card-text-outline", ref: nameRef },
                                props.name
                            )
                            : undefined
                        ,


                        div(
                            div(
                                { className: `type-text fitty-wrap card-text-outline ${props.rarity}`, ref: typeTextRef },
                                `${props.rarity} ${props.pocType}`
                            )
                        ),
    
                        EffectText({
                            blueWords: props.blueWords,
                            orangeWords: props.orangeWords,
                            className: "effect-container card-text-universe",
                            effectText: props.effect
                        })
                    )
                ),
            )
            : undefined
        ,
    )
}

export default factory(PoCContent, cssLoaded)