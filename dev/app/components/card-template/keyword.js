import factory, { div } from "/Utils/elements.js"
import { useRef, useLayoutEffect, useState, useEffect, useContext } from "/cdn/react"
import { Globals } from "/Views/index.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"

const cssLoaded = loadCss("/Components/card-template/keyword.css")

function KeywordComponent(props){

    const [frameUri, updateFrameUri] = useState("")
    useEffect(()=>{
        datauri("/Assets/keyword/frame.png").then(updateFrameUri)
    }, [])

    return SvgWrap(
        {
            width: 512,
            height: 512,
        },
        div(
            { 
                className: "keyword", 
                id: props.id,
                style: {
                    backgroundImage: frameUri ? `url(${frameUri})` : "none"
                }
            },

        )
    )
}

export default factory(KeywordComponent)