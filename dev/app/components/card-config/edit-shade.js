import factory, { div, label, strong, input } from "/Utils/elements.js"
import { useCallback } from "/cdn/react"
import useLang from "/Utils/use-lang.js"
import InputRangeComponent from '/cdn/react-input-range';
import loadCss from "/Utils/load-css.js"

const cssLoaded = Promise.all([
    loadCss("/cdn/react-input-range/lib/css/index.css"),
    loadCss("/Components/card-config/edit-shade.css")
])

const InputRange = factory(InputRangeComponent)

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

    const updateGradientLocation = useCallback(({max, min})=>{
        updaters.gradientLocation([min, max])
    }, [updaters.gradientLocation])

    const [min, max] = gradientLocation

    return div(
        { className: "box gutter-b-2" },
        label(
            strong(
                translate("edit_shade")
            )
        ),
        label(
            { className: "box gutter-tb gutter-rl-.5 flex" },
            div(
                { className: "box-4" },
                translate("shade_darkness"),
                ":",
            ),
            div(
                { className: "grow" },
                InputRange(
                    {
                        formatLabel: value => `${decimalLimit(value * 100)}%`,
                        value: darkness,
                        minValue: 0,
                        maxValue: 1,
                        step: 0.01,
                        onChange: updaters.darkness,
                    }
                )
            )
        ),
        label(
            { className: "box gutter-tb gutter-rl-.5 flex" },
            div(
                { className: "box-4" },
                translate("blur_strength"),
                ":",
            ),
            div(
                { className: "grow" },
                InputRange(
                    {
                        formatLabel: value => `${decimalLimit(value)}px`,
                        value: blur,
                        minValue: 0,
                        maxValue: 40,
                        step: 0.1,
                        onChange: updaters.blur,
                    }
                )
            )
        ),
        label(
            { className: "box gutter-tb gutter-rl-.5 flex" },
            div(
                { className: "box-4" },
                translate("fade_location"),
                ":",
            ),
            div(
                { className: "grow" },
                InputRange(
                    {
                        formatLabel: value => `${decimalLimit(value)}%`,
                        value: {min, max},
                        minValue: 0,
                        maxValue: 100,
                        step: 0.1,
                        onChange: updateGradientLocation,
                    }
                )
            )
        ),
    )
}

function decimalLimit(number, limit = 3){
    const limitScale = Math.pow(10, limit)

    return Math.round(number * limitScale) / limitScale
}

export default factory(EditShadeComponent, cssLoaded)
