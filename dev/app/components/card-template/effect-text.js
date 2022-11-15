import factory, { div, span } from "/Utils/elements.js"
import { keywords } from "/Components/card-template/keyword-renderer.js"
import React, { useContext, useState, useEffect } from "/cdn/react"
import setImmediate from "/Utils/set-immediate-batch.js"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import useEffectDebounce from "/Utils/use-debounce-effect.js"
import { Globals } from "/Views/index.js"

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

const currentlyRunningScalingTasks = new Map()

export async function scaleFontSize(element, max = 36, min = effectTextSize){
    if (!element){
        return nextTick()
    }

    const alreadyExistingTask = currentlyRunningScalingTasks.get(element)
    if (alreadyExistingTask){
        return alreadyExistingTask
    }

    let currentFontSize = window.getComputedStyle(element).getPropertyValue('font-size')
    currentFontSize = parseFloat(currentFontSize)

    let newScalingTask

    if (currentFontSize == max && !isOverflown(element)){
        newScalingTask = nextTick()
    }
    else{
        newScalingTask = new Promise((accept)=>{
            (async ()=>{
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
                        return accept()
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
    
                accept()
            })()
        })
    }

    currentlyRunningScalingTasks.set(element, newScalingTask.then(()=>{
        currentlyRunningScalingTasks.delete(element)
    }))

    return currentlyRunningScalingTasks.get(element)
}

function reactifyEffectText(text, blueWords, orangeWords, customKeywords){
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

    customKeywords.forEach(customKeyword=>{
        const wordTag = `<${customKeyword.id}/>`
        const keywordIcons = customKeyword.icons

        contentArray = contentArray.map(textOrElement=>{
            if (typeof textOrElement !== "string"){
                return textOrElement
            }

            let splitUpText = textOrElement.split(wordTag)

            if (splitUpText.length === 1){
                return splitUpText[0]
            }

            for(let i = splitUpText.length - 1; i; i--){
                splitUpText.splice(i, 0, keywordIcons.map((url)=>InlineIcon({
                    key: (url) + "+" + i,
                    url,
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

    // next up, the icons needs to absorb it's next neighbour unless it's empty or a div, then absorb the one after that too
    for(let i = 0; i < contentArray.length; i++){
        const currentNode = contentArray[i]
        if (typeof currentNode === "string"){
            continue
        }
        if (!React.isValidElement(currentNode)){
            continue
        }

        if (!currentNode.props.pngName){
            continue
        }

        const replacementInlineIconProps = {}
        const replacementInlineIconchildren = []

        Object.keys(currentNode.props).forEach(propName=>{
            replacementInlineIconProps[propName] = currentNode.props[propName]
        })

        if (currentNode.props.children && !Array.isArray(currentNode.props.children)){
            replacementInlineIconchildren.push(currentNode.props.children)
        }

        let nextNode = contentArray[i + 1]
        while(nextNode){
            contentArray.splice(i + 1, 1)

            replacementInlineIconchildren.push(nextNode)

            if (typeof nextNode === "string" && !nextNode.trim()){
                nextNode = contentArray[i + 1] // we have to consume another sibling
            }
            else if (React.isValidElement(nextNode) && nextNode.props.pngName){
                nextNode = contentArray[i + 1] // we have to consume another sibling
            }
            else{
                nextNode = undefined // dont need to consume any more siblings
            }
        }

        contentArray.splice(i, 1, Function.apply.call(InlineIcon, factory, [replacementInlineIconProps, ...replacementInlineIconchildren]))
    }

    return contentArray
}

function EffectTextComponent(props){
    let effectText = props.effectText
    let levelText = props.levelText
    if ((effectText && typeof effectText !== "string") || (levelText && typeof levelText !== "string")){
        throw new Error("Only strings accepted")
    }

    const { customKeywords } = useContext(Globals)

    // cut up text with a 200ms debounce
    const [effectTextArray, updateEffectTextArray] = useState([])
    useEffectDebounce(()=>{
        let blueWords = props.blueWords ? [...props.blueWords] : []
        let orangeWords = props.orangeWords ? [...props.orangeWords] : []
        blueWords.sort((a, b)=>b.length - a.length)
        orangeWords.sort((a, b)=>b.length - a.length)
        
        const contentArray = reactifyEffectText(effectText, blueWords, orangeWords, customKeywords)

        updateEffectTextArray(contentArray)

    }, 200, [effectText, props.blueWords, props.orangeWords])

    const [levelTextArray, updateLevelTextArray] = useState([])
    useEffectDebounce(()=>{
        let blueWords = props.blueWords ? [...props.blueWords] : []
        let orangeWords = props.orangeWords ? [...props.orangeWords] : []
        blueWords.sort((a, b)=>b.length - a.length)
        orangeWords.sort((a, b)=>b.length - a.length)
        
        const contentArray = reactifyEffectText(levelText, blueWords, orangeWords, customKeywords)

        updateLevelTextArray(contentArray)

    }, 200, [levelText, props.blueWords, props.orangeWords])


    // get the art for the level up bar
    const [levelupBarUri, updateLevelupBarUri] = useState("")
    useEffect(()=>{
        datauri("/Assets/champion/levelupbar.png").then(updateLevelupBarUri)
    })

    // create text content elements
    const effectDiv = div.apply(factory, [{className: `effect-text ${props.className || ""}`}, ...effectTextArray])

    const levelDiv = div.apply(factory, [{className: `effect-text level-color ${props.className || ""}`}, ...levelTextArray])

    if (!effectText && !levelText){
        return null
    }

    return div(
        { className: "card-effects-wrapper" },

        effectText 
            ? effectDiv 
            : undefined,

        levelText
            ? div({
                className: "level-bar",
                style: {
                    backgroundImage: levelupBarUri 
                        ? `url(${levelupBarUri || ""})`
                        : "none"
                },
            })
            : undefined
        ,

        levelText
            ? levelDiv
            : undefined
    )
}

function InlineIconComponent(props){

    const [iconUri, updateIconUri] = useState('')

    useEffect(()=>{
        const url = props.url || `/Assets/keyword/${props.pngName}`

        datauri(url).then(updateIconUri)
    }, [props.pngName, props.url])

    return span(
        {
            className: "inline-icon",
            style: {
                "--icon-image": iconUri ? `url(${iconUri})` : "none"
            }
        },
        // div({className: "icon-renderer"}),
        props.children,
    )
}

export const InlineIcon = factory(InlineIconComponent)

export default factory(EffectTextComponent, cssLoaded)
