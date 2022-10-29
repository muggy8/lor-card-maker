import factory, { div, label, strong, input } from "/Utils/elements.js"
import { useCallback } from "/cdn/react"

function EditNameComponent(props){
    const onChange = useCallback((ev)=>{
        props.updateValue && props.updateValue(ev.target.value)
    }, [props.updateValue])

    return label(
        { className: "box" },
        props.label 
            ? div(
                { className: "gutter-b-.5" },
                strong(props.label)
            )
            : undefined
        ,
        div(
            {className: "flex gutter-rl-.5"},
            input(
                {
                    value: props.value,
                    className: "box-12 gutter-trbl-.5",
                    onChange: onChange,
                    type: "text",
                }
            )
        )
    )
}

export default factory(EditNameComponent)