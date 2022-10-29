import factory, { div, label, strong, input } from "/Utils/elements.js"
import { useCallback } from "/cdn/react"


function EditNumberComponent(props){
    const onChange = useCallback(ev=>{
        props.updateValue(isNaN(ev.target.valueAsNumber) ? '' : ev.target.valueAsNumber )
	}, [props.updateValue])

    return label(
        { className: "box" },
        div(
            strong(
                props.label
            )
        ),
        div(
            {className: "flex gutter-trl-.5"},
            input(
                {
                    value: props.value,
                    className: "box-12 gutter-trbl-.5",
                    onChange,
                    type: "number",
                }
            )
        )
    )
}

export default factory(EditNumberComponent)
