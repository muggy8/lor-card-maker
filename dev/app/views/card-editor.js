import { div, button } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { useState, useCallback } from "/cdn/react" 


loadCss("/Views/card-editor.css")

export default function EditorViewFactory(cardRenderer, defaultCardData){
    return function EditorView(props){
        const translate = useLang()

        const [card, updateCard] = useState(defaultCardData)

        

        return div(
            { id: "card-editor", className: "flex hcenter" },
            div(
                { className: "card-preview gutter-t-4 gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3" },
                cardRenderer(card),
                div(
                    {className: "flex hcenter gutter-tb"},
                    button(
                        { className: card.id ? undefined : "hide" },
                        translate("delete_card")
                    ),
                    button(
                        translate("save_card")
                    ),
                    button(
                        translate("export")
                    ),
                )
            ),
            div(
                { className: "card-configs gutter-rl-.5 box-xs-12 box-s-8 box-m-6 box-l-4 box-xl-3" },
                div(
                    {className: "flex hcenter gutter-tb"},

                )
            ),
        )
    }
}