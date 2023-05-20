import factory, { div, label, strong } from "/Utils/elements.js"
import { useCallback } from "/cdn/react"
import useLang from "/Utils/use-lang.js"
import InputRange from "/Components/range-input.js"

function EditShadeComponent(props){
    // const onChange = useCallback(ev=>{
    //     props.updateValue(isNaN(ev.target.valueAsNumber) ? '' : ev.target.valueAsNumber )
	// }, [props.updateValue])

    const translate = useLang()

    const { blur, darkness, gradientLocation } = props.value
    const updaters = Object.keys(props.value).reduce((callbackCollector, valueToUpdate)=>{
        callbackCollector[valueToUpdate] = useCallback((newValue)=>{
            let updatedValue = { blur, darkness, gradientLocation }
            updatedValue[valueToUpdate] = newValue
            props.updateValue(updatedValue)
        }, [blur, darkness, gradientLocation, props.updateValue])

        return callbackCollector
    }, {})

    return div(
        { className: "box gutter-b-2" },
        label(
            strong(
                translate("edit_shade")
            )
        ),
        label(
            { className: "box gutter-trbl-.5 flex-s" },
            div(
                { className: "box-4" },
                translate("shade_darkness"),
                ":",
            ),
            div(
                { className: "grow gutter-tb" },
                InputRange(
                    {
                        formatLabel: value => `${decimalLimit(value * 100)}%`,
                        value: darkness,
                        min: 0,
                        max: 1,
                        step: 0.01,
                        onChange: updaters.darkness,
                    }
                )
            )
        ),
        label(
            { className: "box gutter-trbl-.5 flex-s" },
            div(
                { className: "box-4" },
                translate("blur_strength"),
                ":",
            ),
            div(
                { className: "grow gutter-tb" },
                InputRange(
                    {
                        formatLabel: value => `${decimalLimit(value)}px`,
                        value: blur,
                        min: 0,
                        max: 40,
                        step: 0.1,
                        onChange: updaters.blur,
                    }
                )
            )
        ),
        label(
            { className: "box gutter-trbl-.5 flex-s" },
            div(
                { className: "box-4" },
                translate("fade_location"),
                ":",
            ),
            div(
                { className: "grow gutter-tb" },
                InputRange(
                    {
                        formatLabel: value => `${decimalLimit(value)}%`,
                        value: gradientLocation,
                        min: 0,
                        max: 100,
                        step: 0.1,
                        onChange: updaters.gradientLocation,
                    }
                )
            )
        ),
    )
}

export function decimalLimit(number, limit = 3){
    const limitScale = Math.pow(10, limit)

    return Math.round(number * limitScale) / limitScale
}

export default factory(EditShadeComponent)
