import factory, { div, label, strong, input, button, fragment } from "/Utils/elements.js"
import { Globals } from "/Views/index.js"
import { useCallback, useRef, useContext, useEffect } from "/cdn/react"
import useLang from "/Utils/use-lang.js"


function EditArtComponent(props){
    const translate = useLang()

    const globalState = useContext(Globals)
    const globalsRef = useRef()
    globalsRef.current = globalState

    const uploadArt = useCallback((ev)=>{
        let file = ev.target.files[0]
        if (!file){
            return
        }

        let reader = new FileReader()

        reader.addEventListener("load", function(){
            props.updateValue(reader.result)
            globalsRef.current.patchState({moveableArt: true})
        })
        reader.readAsDataURL(file)


    }, [props.updateValue])

    const upladerInputRef = useRef()
    const clickInput = useCallback(()=>{
        upladerInputRef.current.click()
    }, [])

    useEffect(()=>{
        return ()=>{
            globalsRef.current.patchState({defaultBg: true, moveableArt: false})
        }
    }, [])

    return fragment(
        label(
            div(
                strong(translate("card_art"))
            ),
            div(
                {className: "flex hcenter gutter-trl-.5"},
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
                onChange: uploadArt
            })
        ),
        div({className: "flex gutter-trl-.5"},
            label({className: "box-6 flex vcenter"}, 
                input({
                    type: "checkbox",
                    checked: globalState.state.moveableArt,
                    className: "gutter-tbrl-.25",
                    onChange: (ev)=>{
                        if (props.value){
                            globalState.patchState({moveableArt: ev.target.checked})
                        }
                        else if (globalState.value.moveableArt){
                            globalState.patchState({moveableArt: false})
                        }
                    }
                }),
                div(
                    { className: "box-10 gutter-l-.5" }, 
                    translate("art_moveable")
                ),
            ),
            label({className: "box-6 flex vcenter"}, 
                input({
                    type: "checkbox",
                    checked: globalState.state.defaultBg,
                    className: "gutter-tbrl-.25",
                    onChange: (ev)=>{
                        globalsRef.current.patchState({defaultBg: ev.target.checked})
                    }
                }),
                div(
                    { className: "box-10 gutter-l-.5" }, 
                    translate("default_bg_show")
                ),
            ),
        )
    )
}

export default factory(EditArtComponent)