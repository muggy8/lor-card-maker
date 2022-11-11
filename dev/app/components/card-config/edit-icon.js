import factory, { div, label, strong, fragment } from "/Utils/elements.js"
import reactSelect, { components  } from '/cdn/react-select';
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useRef, useEffect } from "/cdn/react"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import EditArt from "/Components/card-config/edit-art.js"
// import useCallbackDebounce from "/Utils/use-debounce-callback.js"
import { InlineIcon } from "/Components/card-template/effect-text.js"
import svgWrap from "../card-template/svg-wrap.js";

loadCss("/Components/card-config/edit-icon.css")

const select = factory(reactSelect)
const option = factory( components.Option )
const singleValue = factory( components.SingleValue  )

const dummyIcons = [
    "negate.png",
    "nou.png",
    "october.png",
    "pierce.png",
    "quiet.png",
    "shards.png",
    "vision.png",
    "avarosa.png",
    "blaze.png",
    "block.png",
    "bolt.png",
    "boot.png",
    "candle.png",
    "crit.png",
    "defend.png",
    "duel.png",
    "eevee.png",
    "ember.png",
    "healing.png",
]

function iconEditorComponent(props){

    const translate = useLang()

    const [iconUri, updateIconUri] = useState()

    const onSelect = useCallback(option=>{
        datauri(option.icon).then(updateIconUri)
    }, [])

    return fragment(
        label(
            { className: "box edit-icon" },
            div(
                strong(
                    translate("keyword_icon"),
                ),
            ),
        ),

        div(
            { className: "box" },
            div(
                { className: "gutter-trl-.5" },
                translate("upload_icon")
            ),
            EditArt({...props})
        ),

        div(
            { className: "box edit-icon" },
            div(
                { className: "gutter-trl-.5" },
                translate("create_icon"),
                div(
                    select({
                        options: dummyIcons.map(iconName=>{
                            return {
                                value: iconName,
                                label: iconName,
                                icon: `/Assets/custom-icon/${iconName}`
                            }
                        }),
                        components: { 
                            Option: iconSelectOptionComponent, 
                            SingleValue: selectedDefaultIconComponent 
                        },
                        placeholder: translate("select_base_icon"),
                        onChange: onSelect
                    }),

                    iconUri 
                        ? div(
                            { className: "flex vhcenter gutter-t-.5" },
                            svgWrap(
                                { width: 128, height: 128 },
                                div({ 
                                    className: "custom-icon",
                                    style: {
                                        backgroundImage: iconUri ? `url(${iconUri})` : undefined
                                    },
                                })
                            )
                        ) 
                        : undefined
                    ,
                    
                )
            ),
        )
    )
}

function iconSelectOptionComponent (props){
    return option(
        {...props},
        div(
            { className: "flex vhcenter" },
            InlineIcon({ url: props.data.icon}),
        )
    )
}

function selectedDefaultIconComponent (props){
    const translate = useLang()
    
    return singleValue( 
        {...props}, 
        div(
            {className: "flex vcenter"},
            `${translate("base_icon")}: `,
            InlineIcon({ url: props.data.icon}) 
        ),
    )
}

// const iconSelectOption = factory(iconSelectOptionComponent)

export default factory(iconEditorComponent)