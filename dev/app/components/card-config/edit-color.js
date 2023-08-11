import factory, { div, strong, label, button } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import { ChromePicker } from "/cdn/react-color"
import { useState, useContext, useEffect, useCallback } from "/cdn/react"
import useLang from "/Utils/use-lang.js"
import { Globals } from "/Views/index.js"
import useToggle from "/Utils/use-toggle.js"
import { FastAverageColor } from "/cdn/fast-average-color"

const chromePicker = factory(ChromePicker)

const cssLoaded = loadCss("/Components/card-config/edit-color.css")

const fac = new FastAverageColor()

function EditColorComponent(props){

    const translate = useLang()
    const globalState = useContext(Globals)
    const lowSpecsMode = globalState.state.settings.lowSpecsMode === true

    const [color, updateColor] = useState("#FFF")
    useEffect(()=>{
        props.value ? updateColor(props.value) : updateColor("#FFF")
    }, [props.value])
    const [expanded, toggleExpanded] = useToggle(false)

    const calcColorBasedOnCardArt = useCallback(()=>{
        const imageUrl = props.cardArt
        if (!imageUrl){
            return 
        }

        fac.getColorAsync(imageUrl)
            .then(color=>{
                updateColor(color.hex)
                props.updateValue(color.hex)
            })
            .catch(console.warn)
    }, [props.cardArt, props.updateValue])

    return div(
        { 
            className: "box", 
            id: "color-edit", 
            style: {
                "--selected-color": color
            },
        },
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
            { className: `gutter-rl-.5 accordian ${expanded ? "expanded" : ""}` },
            chromePicker(
                {
                    width: "100%",
                    color,
                    disableAlpha: true,
                    onChange: color=>updateColor(color.hex),
                    onChangeComplete: color=>props.updateValue && props.updateValue(color.hex),
                    className: "color-select-input"
                }
            ),
            div(
                { className: "flex no-wrap gutter-t" },
                props.value 
                    ? button(
                        { 
                            className: "grow gutter-trbl-.5", 
                            onClick: ()=>props.updateValue && props.updateValue(null),
                        },
                        translate("reset_default"),
                    )
                    : undefined,
                props.value && props.cardArt 
                    ? div(
                        { className: "gutter-rl-.5" }
                    ) 
                    : undefined,
                props.cardArt 
                    ? button(
                        { 
                            className: "grow gutter-trbl-.5",
                            onClick: calcColorBasedOnCardArt
                        },
                        translate("calculate_based_on_art")
                    )
                    : undefined
            )
        )
    )
}

export default factory(EditColorComponent, cssLoaded)