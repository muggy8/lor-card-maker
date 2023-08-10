import factory, { div, strong, button, label } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import EditText from "/Components/card-config/edit-name.js"


function EditColorTextComponent(props){

    const translate = useLang()

    return div(
        div(
            { className: "flex-m no-wrap" },
            label(
                { className: "box flex vcenter" },
                div(
                    strong(
                        props.label
                    )
                ),
                div(
                    props.subLabel
                )
            ),
            div({ className: "gutter-b-.5" }), // this is needed to not take up horizontal space but provide padding and spacing in mobile vertical stack mode
            div(
                {className: "flex gutter-l-.5"},
                button(
                    {
                        onClick: ()=>{
                            let updatedList = [...props.value]
                            updatedList.push("")
                            props.updateValue(updatedList)
                        },
                        className: "gutter-trbl-.5 grow"
                    },
                    "+1"
                )
            )
        ),
        div(
            {className: "gutter-b-2"},
            props.value.map((currentText, index)=>{
                return div(
                    { className: "flex gutter-t gutter-r-.5", key: index },
                    div(
                        { className: "gutter-r-.5 box" },
                        EditText({
                            value: currentText,
                            updateValue: (newText)=>{
                                let updatedList = [...props.value]
                                updatedList[index] = newText
                                props.updateValue(updatedList)
                            }
                        }),
                    ),
                    button(
                        {
                            onClick: ()=>{
                                let updatedList = [...props.value]
                                updatedList.splice(index, 1)
                                props.updateValue(updatedList)
                            },
                            className: "gutter-rl"
                        },
                        "X"
                    )
                )
            }),
        )
    )
}

export default factory(EditColorTextComponent)
