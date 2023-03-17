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

        const batchParse = Array.prototype.map.call(ev.target.files, file=>new Promise(accept=>{
            let reader = new FileReader()
            reader.addEventListener("load", function(){
                accept(reader.result)
            })
            reader.readAsDataURL(file)
        }))
        Promise.all(batchParse).then(images=>{
            props.multiple 
                ? props.updateValue(images) 
                : props.updateValue(images[0])
            globalsRef.current.patchState({moveableArt: true})
            ev.target.value = null
        })
    }, [props.updateValue, props.multiple])

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
                onChange: uploadArt,
                ...(props.multiple ? {multiple: true} : {})
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