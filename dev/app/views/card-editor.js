import { div } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { useState } from "/cdn/react" 


loadCss("/Views/card-editor.css")

export default function EditorViewFactory(cardRenderer, defaultCardData){
    return function EditorView(props){
        const translate = useLang()

        const [card, updateCard] = useState(defaultCardData)

        return "placeholder"
    }
}