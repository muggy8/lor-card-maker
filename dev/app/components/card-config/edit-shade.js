import factory, { div, label, strong, input } from "/Utils/elements.js"
import { useCallback } from "/cdn/react"
import useLang from "/Utils/use-lang.js"

function EditNumberComponent(props){
    const onChange = useCallback(ev=>{
        props.updateValue(isNaN(ev.target.valueAsNumber) ? '' : ev.target.valueAsNumber )
	}, [props.updateValue])

    const translate = useLang()

    return label(
        { className: "box" },
        div(
            strong(
                translate("edit_shade")
            )
        ),
        div(
            {className: "flex gutter-b-2"},
            input(
                {
                    value: props.value,
                    className: "box-12",
                    onChange,
                    type: "number",
                }
            )
        )
    )
}

export default factory(EditNumberComponent)
