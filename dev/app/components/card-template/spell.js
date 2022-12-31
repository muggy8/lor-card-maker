import factory, { div } from "/Utils/elements.js"
import { useRef, useState, useEffect, useContext } from "/cdn/react"
import { Globals } from "/Views/index.js"
import { FastAverageColor } from "/cdn/fast-average-color"
import loadCss from "/Utils/load-css.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import ArtRenderer from "/Components/card-template/image-render.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"
import fitty from "/cdn/fitty"
import datauri from "/Utils/datauri.js"
import { speedOptions } from "/Components/card-config/edit-speed.js"
import useEffectDebounce from "/Utils/use-debounce-effect.js"
import concurrencyManagerFactory from "/Utils/concurrency-manager.js"
import useAssetCache, { useAssetCacheDebounced } from "/Utils/use-asset-cache.js"
import webglArt from "/Components/card-template/webgl-art.js"

const cssLoaded = loadCss("/Components/card-template/spell.css")

function getSpeedFrom(keywords){
    if (!keywords){
        return
    }
    const lastInstanceOfSpeedKeyword = keywords.findLast(keyword=>{
        return speedOptions.some(speed=>speed === keyword)
    })

    return lastInstanceOfSpeedKeyword
}

function generateCleanedKeywordSet(keywords, speed){
    if (!keywords){
        return
    }

    const speedlessKeywords = keywords.filter(keyword=>{
        return !speedOptions.some(speed=>keyword === speed)
    })

    speed && speedlessKeywords.push(speed)

    return speedlessKeywords
}

const fac = new FastAverageColor()
function SpellComponent(props){
    const globalState = useContext(Globals)
    // console.log(globalState)

    // figure out the background and stuff so we can have a color for the card text back
    const concurrencyManager = useRef()
    useEffect(()=>{
        concurrencyManager.current = concurrencyManagerFactory()
    }, [])

    const imageAvgColor = useAssetCacheDebounced(updateImageAvgColor=>{
        const imageUrl = props.art || "/Assets/spell/backdrop.png"

        fac.getColorAsync(imageUrl)
            .then(color=>{
                updateImageAvgColor(color.hex)
            })
            .catch(console.warn)
    }, 200, [props.art], "var(--color-dark, #777777)")

    // manage the assets and convert them from URL form to base 64 form to make exporting easier
    const backgroundUri = useAssetCache(updateBackgroundUri=>{
        datauri("/Assets/spell/background.png").then(updateBackgroundUri)
    }, [])

    const backdropUri = useAssetCache(updateBackdropUri=>{
        datauri("/Assets/spell/backdrop.png").then(updateBackdropUri)
    }, [])

    const typingUri = useAssetCache(updateTypingUri=>{
        datauri("/Assets/landmark/typing.png").then(updateTypingUri)
    }, [])

    const frameUri = useAssetCache(updateFrameUri=>{
        const frameUrl = `/Assets/spell/frame${props.speed || "trap"}.png`
        datauri(frameUrl).then(updateFrameUri)
    }, [props.speed])

    const regionboxUri = useAssetCache(updateRegionboxUri=>{
        if (!props.faction || !props.faction.length){
            return
        }

        const regionBoxUrl = `/Assets/spell/regionbox${props.faction.length > 3 ? 3 : props.faction.length}.png`
        datauri(regionBoxUrl).then(updateRegionboxUri)
    }, [props.faction && props.faction.length])

    const regionNameUri = useAssetCache(updateRegionNameUri=>{
        if (!props.faction || !props.faction.length){
            return
        }
        const fetchJob = props.faction.map(regionName=>{
            const regionIconUrl = `/Assets/region/${regionName}.png`
            return datauri(regionIconUrl)
        })

        Promise.all(fetchJob).then(updateRegionNameUri)
    }, [props.faction && props.faction.length], [])

    const rarityGemUri = useAssetCache(updateRarityGemUriUri=>{
        if (props.rarity && props.rarity !== "gemless" && props.rarity !== "none"){
            const rarityUrl = `/Assets/shared/gem${props.rarity}.png`
            datauri(rarityUrl).then(updateRarityGemUriUri)
        }
        else{
            updateRarityGemUriUri("")
        }
    }, [props.rarity])

    // gotta manage all the stuff to do with card text size.
    const nameRef = useRef()
    const clanRef = useRef()
    const costRef = useRef()
    const powerRef = useRef()
    const healthRef = useRef()
    const cardTextAreaRef = useRef()

    const costFitty = useRef()
    const powerFitty = useRef()
    const healthFitty = useRef()
    
    useEffectDebounce(()=>{
        if (!frameUri){
            return
        }
        concurrencyManager.current.concurrent(()=>scaleFontSize(nameRef.current, 70, 16))
    }, 200, [props.name, !!frameUri])

    useEffectDebounce(()=>{
        if (!frameUri){
            return
        }
        scaleFontSize(clanRef.current, 40, 16)
    }, 200, [props.clan, !!frameUri])

    useEffectDebounce(()=>{
        if (!frameUri){
            return
        }
        const fittyInstance = costFitty.current

        if (!fittyInstance){
            if (!costRef.current){
                return
            }
            costFitty.current = fitty(costRef.current, { multiLine: false, maxSize: 90 })
            return
        }

        fittyInstance.fit()
    }, 200, [props.mana, !!frameUri])

    useEffectDebounce(()=>{
        if (!frameUri){
            return
        }
        if (typeof props.power !== "number"){
            return
        }

        const fittyInstance = powerFitty.current

        if (!fittyInstance){
            if (!powerRef.current){
                return
            }
            powerFitty.current = fitty(powerRef.current, { multiLine: false, maxSize: 70 })
            return
        }

        fittyInstance.fit()
    }, 200, [props.power, !!frameUri])

    useEffectDebounce(()=>{
        if (!frameUri){
            return
        }
        if (typeof props.health !== "number"){
            return
        }
        const fittyInstance = healthFitty.current

        if (!fittyInstance){
            if (!healthRef.current){
                return
            }
            healthFitty.current = fitty(healthRef.current, { multiLine: false, maxSize: 70 })
            return
        }

        fittyInstance.fit()
    }, 200, [props.health, !!frameUri])

    useEffectDebounce(()=>{
        if (!frameUri){
            return
        }
        concurrencyManager.current.sequential(()=>scaleFontSize(cardTextAreaRef.current))
    }, 300, [!!props.name, !!(props.keywords && props.keywords.length), props.effect, props.lvup, !!frameUri])

    // here we automate the stuff with the frame type and keep them in sync with wha the user has chosen in terms of speed
    const propsRef = useRef()
    propsRef.current = props
    useEffect(()=>{
        const props = propsRef.current
        const speed = props.speed

        if (!props.cardDataUpdaters){
            return
        }

        const currentSpeedBasedOnKeywords = getSpeedFrom(props.keywords)
        const cleanKeywords = generateCleanedKeywordSet(props.keywords, speed)

        if (!speed || currentSpeedBasedOnKeywords === speed){
            if (!props.keywords || !cleanKeywords){
                return
            }
            if (props.keywords.length === cleanKeywords.length){
                return
            }
            return props.cardDataUpdaters.keywords(cleanKeywords)
        }
        
        if (speed === "equipment"){
            props.cardDataUpdaters.power(0)
            props.cardDataUpdaters.health(0)
        }
        else{
            props.cardDataUpdaters.power(null)
            props.cardDataUpdaters.health(null)
        }

        props.cardDataUpdaters.keywords(cleanKeywords)
    }, [props.speed])
    useEffect(()=>{
        const props = propsRef.current
        
        if (!props.cardDataUpdaters){
            return
        }

        const currentSpeedBasedOnKeywords = getSpeedFrom(props.keywords)
        const cleanKeywords = generateCleanedKeywordSet(props.keywords, currentSpeedBasedOnKeywords)

        if (props.speed !== currentSpeedBasedOnKeywords){
            // update the speed prop.
            props.cardDataUpdaters.speed(currentSpeedBasedOnKeywords)

            if (currentSpeedBasedOnKeywords === "equipment"){
                props.cardDataUpdaters.power(0)
                props.cardDataUpdaters.health(0)
            }
            else{
                props.cardDataUpdaters.power(null)
                props.cardDataUpdaters.health(null)
            }
        }

        // optionally update the keywords set too if needed
        if (!cleanKeywords || !props.keywords){
            return
        }
        if (cleanKeywords.length !== props.keywords.length){
            props.cardDataUpdaters.keywords(cleanKeywords)
        }

    }, [props.keywords])

    return SvgWrap(
        {
            loading: !frameUri || props.loading,
            onTransform: props.updateTransform, 
            ...(props.transform || {x: 0, y: 0, scale: 1}),
        },
        frameUri 
            ? div(
                { className: `${props.speed} spell`, id: props.id },
                div(
                    {
                        className: "text-background",
                        style: {
                            backgroundColor: imageAvgColor,
                        }
                    },
                    div({
                        className: "text-background-image",
                        style: {
                            backgroundImage: backgroundUri ? `url(${backgroundUri})` : "none"
                        }
                    },),
                ),
                webglArt({
                    className: "art",
                    transform: props.transform,
                    art: props.art || globalState.state.defaultBg ? backdropUri : undefined ,
                    updateTransform: props.updateTransform,
                }),
                div(
                    {
                        className: "frame",
                        style: {
                            backgroundImage: frameUri ? `url(${frameUri})` : "none"
                        }
                    },
                ),
                div(
                    { className: "cost fitty-nowrap card-text-bold", ref: costRef},
                    props.mana,
                ),
                props.faction && props.faction.length
                    ? div(
                        {
                            className: "region-frame" ,
                            style: {
                                backgroundImage: regionboxUri ? `url(${regionboxUri})` : "none"
                            }
                        },
                        regionNameUri.map((dataUri, index)=>div(
                            {
                                key: dataUri,
                                className: "region-icon region-icon-" + index,
                                style: {
                                    backgroundImage: dataUri ? `url(${dataUri})` : "none"
                                }
                            },
                        ))
                    )
                    : undefined
                ,
                props.clan
                    ? div(
                        {
                            className: "clan",
                            style: {
                                backgroundImage: typingUri ? `url(${typingUri})` : "none"
                            }
                        },
                        div(
                            {
                                ref: clanRef,
                                className: "card-text-universe-condensed text-area fitty-nowrap"
                            },
                            props.clan
                        ),
                    )
                    : undefined
                ,
                props.rarity && props.rarity !== "gemless" && props.rarity !== "none"
                    ? div({
                        className: `${props.rarity || 'no'} rarity ${props.clan ? "with-clan" : ""}`,
                        style: {
                            backgroundImage: rarityGemUri ? `url(${rarityGemUri})` : "none"
                        },
                    })
                    : undefined
                ,
                typeof props.power === "number"
                    ? div(
                        { className: "power fitty-nowrap card-text-bold", ref: powerRef },
                        props.power || 0
                    )
                    : undefined
                ,
                typeof props.health === "number"
                    ? div(
                        { className: "health fitty-nowrap card-text-bold", ref: healthRef },
                        props.health || 0
                    )
                    : undefined
                ,
                div(
                    { className: "card-text-wrapper", ref: cardTextAreaRef },
                    // stuff to do with the card content goes here

                    props.name
                        ? div(
                            { className: "name fitty-wrap card-text-bold", ref: nameRef },
                            props.name
                        )
                        : undefined
                    ,

                    props.keywords && props.keywords.length
                        ? div(
                            { className: "keyword-container card-text-bold" },
                            props.keywords.map(keyword=>{

                                if (typeof keyword === "string"){
                                    return KeywordRenderer({
                                        key: keyword,
                                        name: keyword,
                                        size: props.keywords.length > 1 ? "small" : "large"
                                    })
                                }

                                return KeywordRenderer({
                                    name: keyword.name,
                                    icons: keyword.icons,
                                    key: keyword.id,
                                    size: props.keywords.length > 1 ? "small" : "large"
                                })
                                
                            })
                        )
                        : undefined
                    ,

                    EffectText({
                        blueWords: props.blueWords,
                        orangeWords: props.orangeWords,
                        className: "effect-container card-text-universe",
                        effectText: props.effect,
                        levelText: props.lvup,
                    })
                )
            ) 
            : null 
        ,
    )
}

export default factory(SpellComponent, cssLoaded)
