import factory, { div, label, strong, input } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"

function EditNameComponent(props){
    const translate = useLang()

    return label(
        { className: "box" },
        div(
            strong(
                translate('name')
            )
        ),
        div(
            {className: "flex gutter-b-2"},
            input(
                {
                    value: props.name,
                    className: "box-12",
                    onChange: props.updateName,
                    type: "text",
                }
            )
        )
    )
}

export default factory(EditNameComponent)