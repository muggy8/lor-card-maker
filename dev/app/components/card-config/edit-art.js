import factory, { div, label, strong, input, button } from "/Utils/elements.js"
import { useCallback, useRef } from "/cdn/react"
import useLang from "/Utils/use-lang.js"


function EditArtComponent(props){
    const translate = useLang()

    const onChange = useCallback((ev)=>{
        let file = ev.target.files[0]
        let reader = new FileReader()

        reader.addEventListener("load", function(){
            props.updateValue(reader.result)
        })

        if (file){
            console.log(file)
            reader.readAsDataURL(file)
        }

    }, [props.updateValue])

    const upladerInputRef = useRef()
    const clickInput = useCallback(()=>{
        upladerInputRef.current.click()
    }, [])

    return label(
        { className: "box" },
        div(
            strong(translate("card_art"))
        ),
        div(
            {className: "flex hcenter"},
            button(
                { className: "gutter-trbl grow", onClick: clickInput },
                translate("upload_image")
            ),
        ),
        input({
            ref: upladerInputRef,
            className: "hide",
            type: "file",
            accept: "image/*",
            onChange
        })
    )
}

export default factory(EditArtComponent)