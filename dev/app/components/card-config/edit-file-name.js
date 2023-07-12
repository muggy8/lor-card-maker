import factory, { div, label, strong, input } from "/Utils/elements.js"
import { Globals } from "/Views/index.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useContext } from "/cdn/react"

function EditNameComponent(props){
    const globals = useContext(Globals)

    const onChange = useCallback((ev)=>{
        props.updateValue && props.updateValue(ev.target.value)
    }, [props.updateValue])

    const translate = useLang()

    const fileExt = globals.state.settings.exportFormat || "png"

    return label(
        { className: "box" },
        props.label 
            ? div(
                { className: "gutter-b-.5" },
                strong(props.label)
            )
            : translate("file_name")
        ,
        div(
            {className: "flex gutter-rl-.5"},
            input(
                {
                    placeholder: props.placeholder,
                    value: props.value,
                    className: "grow gutter-trbl-.5",
                    onChange: onChange,
                    type: "text",
                }
            ),
            div({ className: "flex vcenter" }, "." + fileExt)
        )
    )
}

export default factory(EditNameComponent)