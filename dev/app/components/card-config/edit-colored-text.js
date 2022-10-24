import factory, { div, strong, button } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import EditText from "/Components/card-config/edit-name.js"


function EditColorTextComponent(props){

    const translate = useLang()

    return div(
        div(
            { className: "flex" },
            div(
                { className: "box" },
                div(
                    strong(
                        props.label
                    )
                ),
                div(
                    props.subLabel
                )
            ),
            button(
                {
                    onClick: ()=>{
                        let updatedList = [...props.value]
                        updatedList.push("")
                        props.updateValue(updatedList)
                    }
                },
                translate("add_mention")
            )
        ),
        div(
            {className: "gutter-b-2"},
            props.value.map((currentText, index)=>{
                return div(
                    { className: "flex gutter-t", key: index },
                    div(
                        { className: "gutter-r box" },
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
                            }
                        },
                        "X"
                    )
                )
            }),
        )
    )
}

export default factory(EditColorTextComponent)
