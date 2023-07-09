import factory, { div, label, strong, input } from "/Utils/elements.js"
import { useCallback, useContext } from "/cdn/react"
import { Globals } from "/Views/index.js"

function EditCheckboxComponent(props){
    const globalState = useContext(Globals)
    const lowSpecsMode = globalState.state.settings.lowSpecsMode === true

    const toggleCheckbox = useCallback((ev)=>{
        props.updateValue && props.updateValue(!props.value)
    }, [props.updateValue, props.value])

    return label(
        { className: "flex box clickable no-wrap", onClick: toggleCheckbox },
        div(
            {className: `icon ${ lowSpecsMode ? "" : "animated"} checkbox ${ props.value ? "checked" : "" }`},
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