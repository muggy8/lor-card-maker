import factory, { div, strong, label, button } from "/Utils/elements.js"
import { ChromePicker } from "/cdn/react-color"
import { useState, useContext, useEffect } from "/cdn/react"
import useLang from "/Utils/use-lang.js"
import { Globals } from "/Views/index.js"
import useToggle from "/Utils/use-toggle.js"

const chromePicker = factory(ChromePicker)

function EditColorComponent(props){

    const translate = useLang()
    const globalState = useContext(Globals)
    const lowSpecsMode = globalState.state.settings.lowSpecsMode === true

    const [color, updateColor] = useState("#FFF")
    useEffect(()=>{
        props.value && updateColor(props.value)
    }, [props.value])
    const [expanded, toggleExpanded] = useToggle(false)


    return div(
        { className: "box" },
        label(
            { className: "gutter-b flex clickable", onClick: toggleExpanded },
            div(
                { className: "grow flex vcenter" },
                props.label 
                    ? strong(props.label)
                    : strong(translate("color"))
                ,
            ),
            button(
                { className: "gutter-trbl-.5 flex vcenter" },
                div({ className: `icon ${lowSpecsMode ? "" : "animated"} ${expanded ? "multiply" : "chevron-down"}` })
            ),
        ),
        div(
            {className: `flex gutter-rl-.5 accordian ${expanded ? "expanded" : ""}`},
            chromePicker(
                {
                    width: "100%",
                    color,
                    disableAlpha: true,
                    onChange: updateColor,
                    onChangeComplete: color=>console.log(color) + (props.updateValue && props.updateValue(color.hex))
                }
            )
        )
    )
}

export default factory(EditColorComponent)