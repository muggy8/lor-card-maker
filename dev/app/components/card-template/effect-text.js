import factory, { div, span, br } from "/Utils/elements.js"
import { keywords } from "/Components/card-template/keyword-renderer.js"
import { useRef, useLayoutEffect, useState, useEffect } from "/cdn/react"
import setImmediate from "/Utils/set-immediate-batch.js"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"

const cssLoaded = loadCss("/Components/card-template/effect-text.css")

const keywordWithIcons = Object.keys(keywords).filter(word=>keywords[word].length)
// const keywordTags = keywordWithIcons.map(word=>`<${word}/>`)

export const effectTextSize = 24

const isOverflown = ({ clientWidth, clientHeight, scrollWidth, scrollHeight }) => (scrollWidth > clientWidth) || (scrollHeight > clientHeight)

function avg(a, b){
    return (a + b) / 2
}

function nextTick(){
    return new Promise(accept=>setImmediate(accept))
}

export async function scaleFontSize(element, max = 36, min = effectTextSize){
    if (!element){
        return
    }

    let currentFontSize = window.getComputedStyle(element).getPropertyValue('font-size')
    currentFontSize = parseFloat(currentFontSize)

    if (currentFontSize == max && !isOverflown(element)){
        return
    }

    // perform binary search for the perfect font size
    let upperbound = max, lowerBound = min, checkSize = currentFontSize

    while(upperbound - lowerBound > 0.5){
        element.style.fontSize = `${checkSize + 0.5}px`
        await nextTick()
        const overflowAtNextIncriment = isOverflown(element)

        element.style.fontSize = `${checkSize}px`
        await nextTick()
        const overflowAtCurrentFontsize = isOverflown(element)

        if (!overflowAtCurrentFontsize && overflowAtNextIncriment){
            return
        }

        if (overflowAtCurrentFontsize){
            upperbound = checkSize
            checkSize = avg(upperbound, lowerBound)
        }
        else{
            lowerBound = checkSize
            checkSize = avg(upperbound, lowerBound)
        }
    }
}

function EffectTextComponent(props){
    let text = props.children
    if (text && typeof text !== "string"){
        throw new Error("Only strings accepted")
    }

    //~ let { blueWords, orangeWords } = props
    let blueWords = [...props.blueWords]
    let orangeWords = [...props.orangeWords]
    blueWords.sort((a, b)=>b.length - a.length)
    orangeWords.sort((a, b)=>b.length - a.length)

    const [contentArray, updateContentArray] = useState([])
    useEffect(()=>{
        let timeoutId = setTimeout(()=>{
            timeoutId = undefined

            let contentArray = [text]
            keywordWithIcons.forEach(word=>{
                const wordTag = `<${word}/>`
                const keywordIcons = keywords[word]
                contentArray = contentArray.map(textOrElement=>{
                    if (typeof textOrElement !== "string"){
                        return textOrElement
                    }
        
                    let splitUpText = textOrElement.split(wordTag)
        
                    if (splitUpText.length === 1){
                        return splitUpText[0]
                    }
        
                    for(let i = splitUpText.length - 1; i; i--){
                        splitUpText.splice(i, 0, keywordIcons.map((pngName)=>InlineIcon({
                            key: pngName+i,
                            pngName
                        })))
                    }
        
                    return splitUpText
                }).flat()
            })
        
            blueWords.forEach(word=>{
                if (!word){
                    return
                }
                contentArray = contentArray.map(textOrElement=>{
                    if (typeof textOrElement !== "string"){
                        return textOrElement
                    }
        
                    let splitUpText = textOrElement.split(word)
        
                    if (splitUpText.length === 1){
                        return splitUpText[0]
                    }
        
                    for(let i = splitUpText.length - 1; i; i--){
                        splitUpText.splice(i, 0, span({ className: "blue-word" }, word))
                    }
        
                    return splitUpText
                }).flat()
            })
        
            orangeWords.forEach(word=>{
                if (!word){
                    return
                }
                contentArray = contentArray.map(textOrElement=>{
                    if (typeof textOrElement !== "string"){
                        return textOrElement
                    }
        
                    let splitUpText = textOrElement.split(word)
        
                    if (splitUpText.length === 1){
                        return splitUpText[0]
                    }
        
                    for(let i = splitUpText.length - 1; i; i--){
                        splitUpText.splice(i, 0, span({ className: "orange-word" }, word))
                    }
        
                    return splitUpText
                }).flat()
            })
        
            // replace new lines with br tag... but br tag breaks during svg output so we just use a div instead
            contentArray = contentArray.map(textOrElement=>{
                if (typeof textOrElement !== "string"){
                    return textOrElement
                }
        
                let splitUpText = textOrElement.split(/\n+/g)
        
                if (splitUpText.length === 1){
                    return splitUpText[0]
                }
        
                for(let i = splitUpText.length - 1; i; i--){
                    splitUpText.splice(i, 0, div())
                }
        
                return splitUpText
            }).flat()

            contentArray = contentArray.filter(el=>!!el)

            updateContentArray(contentArray)
        }, 200)

        return function(){
            if (timeoutId){
                clearTimeout(timeoutId)
            }
        }
    }, [text, props.blueWords, props.orangeWords])

    const elementRef = useRef()

    useLayoutEffect(()=>{
        scaleFontSize(elementRef.current)
    }, [contentArray])

    return div.apply(factory, [{className: `effect-text ${props.className || ""}`, ref: elementRef}, ...contentArray])
}

function InlineIconComponent(props){

    const [iconUri, updateIconUri] = useState('')

    useEffect(()=>{
        datauri(`/Assets/keyword/${props.pngName}`).then(updateIconUri)
    }, [props.pngName])

    return span(
        {
            className: "inline-icon",
            style: {
                backgroundImage: `url(${iconUri})`
            }
        }
    )
}

export const InlineIcon = factory(InlineIconComponent)

export default factory(EffectTextComponent, cssLoaded)
