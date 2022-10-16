import factory, { div, span, br } from "/Utils/elements.js"
import { keywords } from "/Components/card-template/keyword-renderer.js"
import loadCss from "/Utils/load-css.js"

loadCss("/Components/card-template/effect-text.css")

const keywordWithIcons = Object.keys(keywords).filter(word=>keywords[word].length)
// const keywordTags = keywordWithIcons.map(word=>`<${word}/>`)

function EffectTextComponent(props){
    let text = props.children
    if (text && typeof text !== "string"){
        throw new Error("Only strings accepted")
    }

    let { blueWords, orangeWords } = props
    blueWords.sort((a, b)=>b.length - a.length)
    orangeWords.sort((a, b)=>b.length - a.length)

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
                splitUpText.splice(i, 0, keywordIcons.map(pngName=>span(
                    {
                        key: pngName,
                        className: "inline-icon",
                        style: {
                            backgroundImage: `url(/Assets/keyword/${pngName})`
                        }
                    }
                )))
            }

            return splitUpText
        }).flat()
    })

    blueWords.forEach(word=>{
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

    contentArray = contentArray.map(textOrElement=>{
        if (typeof textOrElement !== "string"){
            return textOrElement
        }

        let splitUpText = textOrElement.split(/\n+/g)

        if (splitUpText.length === 1){
            return splitUpText[0]
        }

        for(let i = splitUpText.length - 1; i; i--){
            splitUpText.splice(i, 0, br())
        }

        return splitUpText
    }).flat()

    return div.apply(factory, [{className: `effect-text ${props.className || ""}`}, ...contentArray])
}

export default factory(EffectTextComponent)