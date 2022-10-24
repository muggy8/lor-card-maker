import factory, { div, label, strong, input } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback } from "/cdn/react"


function EditNumberComponent(props){
    const translate = useLang()
    const onChange = useCallback(ev=>{
		props.updateValue(ev.target.valueAsNumber)
	}, [props.updateValue])

    return label(
        { className: "box" },
        div(
            strong(
                props.label
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
