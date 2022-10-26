import factory, { div, img } from "/Utils/elements.js"
import { useRef, useLayoutEffect, useState, useEffect } from "/cdn/react"
import { FastAverageColor } from "/cdn/fast-average-color"
import loadCss from "/Utils/load-css.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"
import fitty from "/cdn/fitty"
import datauri from "/Utils/datauri.js"

const cssLoaded = loadCss("/Components/card-template/spell.css")

function SpellComponent(props){

    const nameRef = useRef()
    const clanRef = useRef()
    const costRef = useRef()
    const powerRef = useRef()
    const healthRef = useRef()

    const costFitty = useRef()
    const powerFitty = useRef()
    const healthFitty = useRef()
    const facref = useRef()

    const [imageAvgColor, updateImageAvgColor] = useState("#000000")
    useLayoutEffect(()=>{
        let fac = facref.current
        if (!fac){
            fac = facref.current = new FastAverageColor();
        }

        const imageUrl = props.art || "/Assets/spell/backdrop.png"

        fac.getColorAsync(imageUrl)
            .then(color=>{
                // console.log(color)
                updateImageAvgColor(color.hex)
            })
            .catch(console.warn)
    }, [props.art])

    useLayoutEffect(()=>{
        scaleFontSize(nameRef.current, 70, 16)
    }, [props.name])

    useLayoutEffect(()=>{
        scaleFontSize(clanRef.current, 40, 16)
    }, [props.clan])

    useLayoutEffect(()=>{
        const fittyInstance = costFitty.current

        if (!fittyInstance){
            if (!costRef.current){
                return
            }
            costFitty.current = fitty(costRef.current, { multiLine: false, maxSize: 90 })
            return
        }

        fittyInstance.fit()
    }, [props.mana])

    useLayoutEffect(()=>{
        const fittyInstance = powerFitty.current

        if (!fittyInstance){
            if (!powerRef.current){
                return
            }
            powerFitty.current = fitty(powerRef.current, { multiLine: false, maxSize: 70 })
            return
        }

        fittyInstance.fit()
    }, [props.power])

    useLayoutEffect(()=>{
        const fittyInstance = healthFitty.current

        if (!fittyInstance){
            if (!healthRef.current){
                return
            }
            healthFitty.current = fitty(healthRef.current, { multiLine: false, maxSize: 70 })
            return
        }

        fittyInstance.fit()
    }, [props.health])

    const [backgroundUri, updateBackgroundUri] = useState("")
    const [backdropUri, updateBackdropUri] = useState("")
    const [frameUri, updateFrameUri] = useState("")
    const [regionboxUri, updateRegionboxUri] = useState("")
    const [typingUri, updateTypingUri] = useState("")
    const [regionNameUri, updateRegionNameUri] = useState([])
    const [rarityGemUri, updateRarityGemUriUri] = useState("")
    useEffect(()=>{
        datauri("/Assets/spell/background.png").then(updateBackgroundUri)
        datauri("/Assets/spell/backdrop.png").then(updateBackdropUri)
        datauri("/Assets/landmark/typing.png").then(updateTypingUri)
    }, [])
    useEffect(()=>{
        const frameUrl = `/Assets/spell/frame${props.speed || "trap"}.png`
        datauri(frameUrl).then(updateFrameUri)
    }, [props.speed])
    useEffect(()=>{
        if (!props.faction || !props.faction.length){
            return
        }

        const regionBoxUrl = `/Assets/spell/regionbox${props.faction.length > 3 ? 3 : props.faction.length}.png`
        datauri(regionBoxUrl).then(updateRegionboxUri)

        const fetchJob = props.faction.map(regionName=>{
            const regionIconUrl = `/Assets/region/${regionName}.png`
            return datauri(regionIconUrl)
        })

        Promise.all(fetchJob).then(updateRegionNameUri)
    }, [props.faction && props.faction.length])
    useEffect(()=>{
        if (props.rarity && props.rarity !== "gemless"){
            const rarityUrl = `/Assets/shared/gem${props.rarity}.png`
            datauri(rarityUrl).then(updateRarityGemUriUri)
        }
        else{
            updateRarityGemUriUri("")
        }
    }, [props.rarity])

    return SvgWrap(
        div(
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
                        backgroundImage: `url(${backgroundUri})`
                    }
                },),
            ),
            div(
                {
                    className: "art",
                    style: {
                        backgroundImage: `url(${backdropUri})`,
                    },
                },
            ),
            div(
                {
                    className: "frame",
                    style: {
                        backgroundImage: `url(${frameUri})`
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
                            backgroundImage: `url(${regionboxUri})`
                        }
                    },
                    regionNameUri.map((dataUri, index)=>div(
                        {
                            key: dataUri,
                            className: "region-icon region-icon-" + index,
                            style: {
                                backgroundImage: `url(${dataUri})`
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
                            backgroundImage: `url(${typingUri})`
                        }
                    },
                    div(
                        {
                            ref: clanRef,
                            className: "text-area fitty-nowrap text-area fitty-nowrap"
                        },
                        props.clan
                    ),
                )
                : undefined
            ,
            props.rarity && props.rarity !== "gemless"
                ? div({
                    className: `${props.rarity || 'no'} rarity ${props.clan ? "with-clan" : ""}`,
                    style: {
                        backgroundImage: `url(${rarityGemUri})`
                    },
                })
                : undefined
            ,
            typeof props.power !== "undefined"
                ? div(
                    { className: "power fitty-nowrap card-text-bold", ref: powerRef },
                    props.power
                )
                : undefined
            ,
            typeof props.health !== "undefined"
                ? div(
                    { className: "health fitty-nowrap card-text-bold", ref: healthRef },
                    props.health
                )
                : undefined
            ,
            div(
                { className: "card-text-wrapper" },
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
                        props.keywords.map(keywordName=>KeywordRenderer({
                            key: keywordName,
                            name: keywordName,
                            size: props.keywords.length > 1 ? "small" : "large"
                        }))
                    )
                    : undefined
                ,

                props.effect
                    ? EffectText(
                        {
                            blueWords: props.blueWords,
                            orangeWords: props.orangeWords,
                            className: "effect-container card-text-universe",
                        },
                        props.effect
                    )
                    : undefined
                ,
            )
        )
    )
}

export default factory(SpellComponent, cssLoaded)
