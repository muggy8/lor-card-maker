import factory, { div, strong, button, label } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import EditText from "/Components/card-config/edit-name.js"


function EditColorTextComponent(props){

    const translate = useLang()

    return div(
        div(
            { className: "flex-m" },
            label(
                { className: "box gutter-b-.5" },
                div(
                    strong(
                        props.label
                    )
                ),
                div(
                    props.subLabel
                )
            ),
            div(
                {className: "flex gutter-rl-.5"},
                button(
                    {
                        onClick: ()=>{
                            let updatedList = [...props.value]
                            updatedList.push("")
                            props.updateValue(updatedList)
                        },
                        className: "gutter-trbl-.5 grow"
                    },
                    translate("add_mention")
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
