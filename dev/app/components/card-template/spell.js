import factory, { div, img } from "/Utils/elements.js"
import { useRef, useLayoutEffect, useState } from "/cdn/react"
import { FastAverageColor } from "/cdn/fast-average-color"
import loadCss from "/Utils/load-css.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"
import fitty from "/cdn/fitty"

loadCss("/Components/card-template/spell.css")

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
            costFitty.current = fitty(costRef.current, { multiLine: false, maxSize: 100 })
            return 
        }

        fittyInstance.fit()
    }, [props.clan])

    useLayoutEffect(()=>{
        const fittyInstance = powerFitty.current

        if (!fittyInstance){
            powerFitty.current = fitty(powerRef.current, { multiLine: false, maxSize: 60 })
            return 
        }

        fittyInstance.fit()
    }, [props.clan])

    useLayoutEffect(()=>{
        const fittyInstance = healthFitty.current

        if (!fittyInstance){
            healthFitty.current = fitty(healthRef.current, { multiLine: false, maxSize: 60 })
            return 
        }

        fittyInstance.fit()
    }, [props.clan])

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
                img(
                    { 
                        src: "/Assets/spell/background.png"
                    },
                ),
            ),
            div(
                { 
                    className: "art",
                    style: {
                        backgroundImage: `url(/Assets/spell/backdrop.png)`,
                    },
                },
            ),
            div(
                { 
                    className: "frame",
                    style: {
                        backgroundImage: `url(/Assets/spell/frame${props.speed || "trap"}.png)`
                    }
                },
            ),
            div(
                { className: "cost fitty-nowrap", ref: costRef},
                props.mana,
            ),
            props.faction && props.faction.length
                ? div(
                    { 
                        className: "region-frame" ,
                        style: {
                            backgroundImage: `url(/Assets/spell/regionbox${props.faction.length > 3 ? 3 : props.faction.length}.png)`
                        }
                    },
                    props.faction.map((regionName, index)=>div(
                        { 
                            key: regionName,
                            className: "region-icon region-icon-" + index,
                            style: {
                                backgroundImage: `url(/Assets/region/${regionName}.png)`
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
                        ref: clanRef,
                        style: {
                            backgroundImage: `url(/Assets/landmark/typing.png)`
                        }
                    },
                    div(
                        {
                            className: "text-area fitty-nowrap"
                        },
                        props.clan
                    ),
                )
                : undefined
            ,
            props.rarity 
                ? img(
                    { 
                        className: `rarity ${props.clan ? "with-clan" : ""}`,
                        src: `/Assets/shared/gem${props.rarity}.png`,
                    },
                )
                : undefined
            ,
            typeof props.power !== "undefined"
                ? div(
                    { className: "power fitty-nowrap", ref: powerRef },
                    props.power
                )
                : undefined
            ,
            typeof props.health !== "undefined"
                ? div(
                    { className: "health fitty-nowrap", ref: healthRef },
                    props.health
                )
                : undefined
            ,
            div(
                { className: "card-text-wrapper" },
                // stuff to do with the card content goes here

                props.name
                    ? div(
                        { className: "name fitty-wrap", ref: nameRef },
                        props.name
                    )
                    : undefined
                ,

                props.keywords
                    ? div(
                        { className: "keyword-container" },
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
                            className: "effect-container",
                        }, 
                        props.effect
                    )
                    : undefined
                ,
            )
        )
    )
}

export default factory(SpellComponent)