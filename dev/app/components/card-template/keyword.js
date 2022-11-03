import factory, { div } from "/Utils/elements.js"
import { useRef, useState, useEffect, useContext } from "/cdn/react"
import { Globals } from "/Views/index.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import useEffectDebounce from "/Utils/use-debounce-effect.js"

const cssLoaded = loadCss("/Components/card-template/keyword.css")

function KeywordComponent(props){

    const [frameUri, updateFrameUri] = useState("")
    const [divisionUri, updateDivisionUri] = useState("")
    useEffect(()=>{
        datauri("/Assets/keyword/frame.png").then(updateFrameUri)
        datauri("/Assets/keyword/division.png").then(updateDivisionUri)
    }, [])

    const nameRef = useRef()
    useEffectDebounce(()=>{
        scaleFontSize(nameRef.current, 60, 16)
    }, 200, [props.name, !!frameUri])

    return SvgWrap(
        {
            width: 512,
            height: 512,
            loading: !frameUri,
        },
        frameUri
            ? div(
                { 
                    className: "keyword", 
                    id: props.id,
                    style: {
                        backgroundImage: frameUri ? `url(${frameUri})` : "none"
                    }
                },
                div(
                    { className: "content" },

                    div(
                        { className: "name orange-word", ref: nameRef },
                        props.name
                    ),

                    div({ 
                        className: "division",
                        style: {
                            backgroundImage: divisionUri ? `url(${divisionUri})` : "none"
                        },
                    }),

                    
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

                ),
            )
            : null
        ,
    )
}

export default factory(KeywordComponent, cssLoaded)