import factory, { div, button, range } from "/Utils/elements.js";
import { useState, useEffect, useMemo } from "/cdn/react"
import rangeInput from "/Components/range-input.js"

function rangeSliderComponent(props){

    const [min, updateMin] = useState(0)
    const [max, updateMax] = useState(1)

    useEffect(()=>{
        const rangeClone = [...props.range]
        rangeClone.sort((a,b)=>a-b)
        updateMin(rangeClone[0])
        updateMax(rangeClone[rangeClone.length - 1])
    }, [props.range])

    return div({ className: "slider-option gutter-b-1" }, 
        div({ className: "gutter-b-.5" }, props.label),
        div({ className: "flex gutter-rl-.5" },
            div({ className: "grow gutter-tr-1 flex gutter-l-.5" }, 
                rangeInput({
                    min, max, onChange: props.onChange, value: props.value, step: 1,
                })
            ),
            button({ className: "gutter-trbl-.5", onClick: ()=>props.onChange([min, max]) }, 
                div({ className: "icon multiply" })
            )
        ),
    )
}

export default factory(rangeSliderComponent)