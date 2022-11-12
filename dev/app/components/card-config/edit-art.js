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
                strong(props.label)
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
        
        props.moveable !== false 
        ? div(
            {className: "flex gutter-t-.5"},
            div({className: "flex gutter-l-.5 gutter-r-.25 box-6"},
                button(
                    {
                        className: "box gutter-trbl-.5",
                        onClick: ()=>{
                            if (props.value){
                                globalState.patchState({moveableArt: !globalState.state.moveableArt})
                            }
                            else if (globalState.value.moveableArt){
                                globalState.patchState({moveableArt: false})
                            }
                        },
                        disabled: !props.value
                    }, 
                    translate(
                        globalState.state.moveableArt ? "lock_art_movement" : "unlock_art_movement"
                    )
                ),
            ),
            div({className: "flex gutter-r-.5 gutter-l-.25 box-6"},
                button(
                    {
                        className: "box gutter-trbl-.5",
                        onClick: ()=>{
                            globalState.patchState({defaultBg: !globalState.state.defaultBg})
                        }
                    }, 
                    translate(globalState.state.defaultBg ? "default_bg_hide" : "default_bg_show")
                ),
            )
        )
        : undefined
        ,
    )
}

export default factory(EditArtComponent)