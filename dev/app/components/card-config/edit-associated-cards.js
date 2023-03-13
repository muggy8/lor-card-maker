import factory, { div, label, strong, input } from "/Utils/elements.js"
import { useCallback } from "/cdn/react"
import useLang from "/Utils/use-lang.js"
import loadCss from "/Utils/load-css.js"
import useToggle from "/Utils/use-toggle.js"
import listLimit from "/Components/list-limit.js"

const cssLoaded = loadCss("/Components/card-config/edit-associated-cards.css")

function editAssociatedCardsComponent(props){

    const translate = useLang()

    const [expanded, toggleExpanded] = useToggle(false)

    return div(
        label(
            { onClick: toggleExpanded, className: "flex clickable" },
            div(
                { className: "grow" },
                strong(translate("associated_cards"))
            ),
            div({ className: `icon animated ${expanded ? "multiply" : "chevron-down"}` })
        ),
        div(
            { className: `flex gutter-b-2 accordian ${expanded ? "expanded" : ""}` },
            listLimit(
                { defaultSize: 24 },

            )
        )
    )
}

export default factory(editAssociatedCardsComponent)