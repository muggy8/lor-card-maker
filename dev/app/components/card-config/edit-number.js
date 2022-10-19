import factory, { div, label, strong, input } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"

function EditNumberComponent(props){
    const translate = useLang()

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
                    onChange: props.updateValue,
                    type: "number",
                }
            )
        )
    )
}

export default factory(EditNumberComponent)