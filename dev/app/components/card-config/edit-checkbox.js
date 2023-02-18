import factory, { div, label, strong, input } from "/Utils/elements.js"
import { useCallback } from "/cdn/react"

function EditCheckboxComponent(props){
    const toggleCheckbox = useCallback((ev)=>{
        props.updateValue && props.updateValue(!props.value)
    }, [props.updateValue, props.value])

    return label(
        { className: "flex box", onClick: toggleCheckbox },
        div(
            {className: `animated icon checkbox ${props.value ? "checked" : "" }`},
        ),
        props.label 
            ? div(
                { className: "gutter-b-.5 gutter-l grow" },
                strong(props.label)
            )
            : undefined
        ,
    )
}

export default factory(EditCheckboxComponent)