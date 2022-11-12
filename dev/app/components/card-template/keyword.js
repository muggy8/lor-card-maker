import factory, { div } from "/Utils/elements.js"
import { useRef, useState, useEffect, useContext } from "/cdn/react"
import { Globals } from "/Views/index.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import ArtRenderer from "/Components/card-template/image-render.js"
import useEffectDebounce from "/Utils/use-debounce-effect.js"
import concurrencyManagerFactory from "/Utils/concurrency-manager.js"

const cssLoaded = loadCss("/Components/card-template/keyword.css")

function KeywordComponent(props){

    const [frameUri, updateFrameUri] = useState("")
    const [divisionUri, updateDivisionUri] = useState("")
    useEffect(()=>{
        datauri("/Assets/keyword/frame.png").then(updateFrameUri)
        datauri("/Assets/keyword/division.png").then(updateDivisionUri)
    }, [])

    const concurrencyManagerRef = useRef()
    useEffect(()=>{
		concurrencyManagerRef.current = concurrencyManagerFactory()
	}, [])

    const nameRef = useRef()
    useEffectDebounce(()=>{
		if (!frameUri){
			return
		}
        concurrencyManagerRef.current.concurrent(()=>scaleFontSize(nameRef.current, 60, 16))
    }, 200, [props.name, !!frameUri])

    const textAreaRef = useRef()
    useEffectDebounce(()=>{
		if (!frameUri){
			return
		}
        concurrencyManagerRef.current.sequential(()=>scaleFontSize(textAreaRef.current))
    }, 200, [props.effect, !!frameUri])

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
                    { className: "content", ref: textAreaRef },

                    div(
                        { className: "name-area" },
                        props.icons && props.icons.length
                            ? props.icons.map(iconUri=>{
                                return  div({
                                    className: "keyword-icon",
                                    style: {
                                        backgroundImage: `url(${iconUri})`,
                                    },
                                    key: iconUri
                                })
                            })
                            : undefined
                        ,
                        div(
                            { className: "name orange-word", ref: nameRef },
                            props.name
                        ),
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
								effectText: props.effect
                            }
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
