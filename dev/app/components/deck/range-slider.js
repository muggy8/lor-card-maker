import factory, { div, InputRange, button } from "/Utils/elements.js";
import { useState, useEffect, useCallback } from "/cdn/react"

function rangeSliderComponent(props){

    const [min, updateMin] = useState(undefined)
    const [max, updateMax] = useState(undefined)

    useEffect(()=>{
        const rangeClone = [...props.range]
        rangeClone.sort((a,b)=>a-b)
        updateMin(rangeClone[0])
        updateMax(rangeClone[rangeClone.length - 1])
    }, [props.range])

    const onChange = useCallback((value)=>{
        props.onChange([
            value.min,
            value.max,
        ])
    }, [props.onChange])

    return div({ className: "slider-option gutter-b-.5" }, 
        div({ className: "gutter-b-.5" }, props.label),
        div({ className: "flex gutter-rl-.5" },
            div({ className: "grow gutter-trb-1 flex gutter-l-.5" }, 
                InputRange({ 
                    value: props.value 
                        ? { min: props.value[0], max:props.value[1] } 
                        : { min, max }
                    , 
                    minValue: min,
                    maxValue: max,
                    onChange
                })
            ),
            button({ className: "gutter-trbl-.5", onClick: ()=>props.onChange([min, max]) }, 
                div({ className: "icon" },
                    div({ className: "delete" }),
                )
            )
        ),
    )
}

export default factory(rangeSliderComponent)