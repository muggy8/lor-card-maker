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
                strong(props.label)
            )
            : undefined
        ,
        div(
            {className: "flex"},
            input(
                {
                    value: props.value,
                    className: "box-12",
                    onChange: onChange,
                    type: "text",
                }
            )
        )
    )
}

export default factory(EditNameComponent)