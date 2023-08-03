import factory, { div, label, strong, input } from "/Utils/elements.js"
import { useCallback } from "/cdn/react"

function EditColorComponent(props){
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
            "placeholder"
        )
    )
}

export default factory(EditColorComponent)