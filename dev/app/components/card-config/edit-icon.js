import factory, { div, label, strong, button, InputRange } from "/Utils/elements.js"
import reactSelect, { components  } from '/cdn/react-select';
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useEffect, createElement } from "/cdn/react"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import EditArt from "/Components/card-config/edit-art.js"
import saveSvgAsPng from "/cdn/save-svg-as-png"
import { InlineIcon } from "/Components/card-template/effect-text.js"
import svgWrap from "../card-template/svg-wrap.js";
import { decimalLimit } from "/Components/card-config/edit-shade.js";
import { svgRefference } from "/Views/card-editor.js"
loadCss("/Components/card-config/edit-icon.css")

const select = factory(reactSelect)
const option = factory( components.Option )
const singleValue = factory( components.SingleValue )
const placeholder = factory( components.Placeholder )

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

    const [hue, updateHue] = useState(0)
    const [contrast, udpateContrast] = useState(1)
    const [saturation, updateSaturation] = useState(0)
    const [brightness, updateBrightness] = useState(1)
    const [sepia, updateSepia] = useState(1)

    const [selected, updateSelected] = useState(null)
    const [iconUri, updateIconUri] = useState("")
    useEffect(()=>{
        if (!selected){
            return
        }
        datauri(selected.icon).then(updateIconUri)
    }, [selected])

    const [svgRef, updateSvgRef] = useState(null)
    const [exporting, setExporting] = useState(false)
    const exportIcon = useCallback(()=>{
		if (exporting){
            return
        }
        setExporting(true)

        requestAnimationFrame(() => {
            saveSvgAsPng.svgAsPngUri(svgRef, {
                excludeUnusedCss: true,
                width: svgRef.width.baseVal.value,
                height: svgRef.height.baseVal.value,
            }).then(uri=>{
                props.updateValue([...props.value || [], uri])
                updateSelected(null)
                updateIconUri("")
                setExporting(false)
            }, ()=>setExporting(false))
        })
	}, [svgRef, exporting, props.value])
    const cancelFromTemplate = useCallback(()=>{
        updateSelected(null)
        updateIconUri("")
        setExporting(false)
    }, [])


    const [uploadedIcon, updateUploadedIcon] = useState("")
    
    return div(
        { className: "edit-icon box" },

        label(
            div(
                translate("keyword_icon"),
            ),
        ),

        props.value && props.value.length
            ? div(
                { className: "gutter-rl-.5" },
                div(
                    strong(translate("icons"))
                ),

                props.value.map((uri, index)=>{
                    return div(
                        { 
                            className: "flex gutter-b-.5",
                            key: uri,
                        },
                        div(
                            { className: "box gutter-trbl-.5 existing-icon-bg" },
                            div({ 
                                className: "existing-icon-preview",
                                style: {
                                    backgroundImage: `url(${uri})`
                                }
                            }),
                        ),

                        button(
                            { 
                                className: "gutter-trbl-1",
                                onClick: ()=>{
                                    const newValueSet = [...props.value]
                                    newValueSet.splice(index, 1)
                                    props.updateValue(newValueSet)
                                }
                            },
                            "X"
                        )
                    )
                })
            )
            : undefined
        ,

        div(
            div(
                { className: "gutter-trl-.5" },
                translate("upload_icon")
            ),
            EditArt({
                value: uploadedIcon, 
                updateValue: updateUploadedIcon,
                moveable: false,
            })
        ),

        div(
            div({ className: "box gutter-rl-.5 gutter-t-.75" }, strong(translate("or"))),

            div(
                { className: "gutter-trl-.5" },
                translate("create_icon"),
                div(
                    { className: "gutter-t-.5" },
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
                            SingleValue: selectedDefaultIconComponent,
                            Placeholder: placeholderOverrideComponent,
                        },
                        placeholder: translate("select_base_icon"),
                        onChange: updateSelected,
                        value: selected
                    }),

                    iconUri
                        ? div(
                            div(
                                {
                                    className: "flex vhcenter gutter-t-.5",
                                },
                                createElement(
									svgRefference.Provider,
									{ value: { // replace teh svg ref so the stuff below dont ruin the fun for our exporter
										current: svgRef,
										setRef: updateSvgRef,
									} },

									svgWrap(
										{ width: 128, height: 128, loading: exporting },
										div({
											className: "custom-icon",
											style: {
												backgroundImage: iconUri ? `url(${iconUri})` : undefined,
												filter: `brightness(${brightness}) sepia(${sepia}) saturate(${saturation}) hue-rotate(${hue}deg) contrast(${contrast})`,
											},
										}),
									)
								),
                            ),
                            label(
                                { className: "box gutter-trbl-.5 flex-s" },
                                div(
                                    { className: "box-4" },
                                    translate("saturation"),
                                    ":",
                                ),
                                div(
                                    { className: "grow gutter-tb" },
                                    InputRange(
                                        {
                                            formatLabel: value => `${decimalLimit(value*100)}%`,
                                            value: saturation,
                                            minValue: 0,
                                            maxValue: 5,
                                            step: 0.01,
                                            onChange: updateSaturation,
                                        }
                                    )
                                )
                            ),
                            label(
                                { className: "box gutter-trbl-.5 flex-s" },
                                div(
                                    { className: "box-4" },
                                    translate("hue_rotation"),
                                    ":",
                                ),
                                div(
                                    { className: "grow gutter-tb" },
                                    InputRange(
                                        {
                                            formatLabel: value => `${decimalLimit(value)}deg`,
                                            value: hue,
                                            minValue: 0,
                                            maxValue: 360,
                                            step: 1,
                                            onChange: updateHue,
                                        }
                                    )
                                )
                            ),
                            label(
                                { className: "box gutter-trbl-.5 flex-s" },
                                div(
                                    { className: "box-4" },
                                    translate("brightness"),
                                    ":",
                                ),
                                div(
                                    { className: "grow gutter-tb" },
                                    InputRange(
                                        {
                                            formatLabel: value => `${decimalLimit(value*100)}%`,
                                            value: brightness,
                                            minValue: 0,
                                            maxValue: 2,
                                            step: 0.01,
                                            onChange: updateBrightness,
                                        }
                                    )
                                )
                            ),
                            label(
                                { className: "box gutter-trbl-.5 flex-s" },
                                div(
                                    { className: "box-4" },
                                    translate("contrast"),
                                    ":",
                                ),
                                div(
                                    { className: "grow gutter-tb" },
                                    InputRange(
                                        {
                                            formatLabel: value => `${decimalLimit(value*100)}%`,
                                            value: contrast,
                                            minValue: 0,
                                            maxValue: 5,
                                            step: 0.01,
                                            onChange: udpateContrast,
                                        }
                                    )
                                )
                            ),
                            label(
                                { className: "box gutter-trbl-.5 flex-s" },
                                div(
                                    { className: "box-4" },
                                    translate("sepia"),
                                    ":",
                                ),
                                div(
                                    { className: "grow gutter-tb" },
                                    InputRange(
                                        {
                                            formatLabel: value => `${decimalLimit(value*100)}%`,
                                            value: sepia,
                                            minValue: 0,
                                            maxValue: 1,
                                            step: 0.01,
                                            onChange: updateSepia,
                                        }
                                    )
                                )
                            ),
                            div(
								{ className: "flex gutter-t-.5" },
								button(
									{ className: "box gutter-trbl-1", onClick: exportIcon },
									translate("use_icon")
								),
                                div({ className: "gutter-r-.5" }),
                                button(
                                    { className: "gutter-trbl-1", onClick: cancelFromTemplate},
                                    translate("cancel")
                                )
                            ),

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
            {className: "flex vhcenter gutter-tb-.5"},
            `${translate("base_icon")}: `,
            InlineIcon({ url: props.data.icon})
        ),
    )
}

function placeholderOverrideComponent(props){
    return placeholder(
        props,
        div(
            { className: "flex vhcenter gutter-tb-1", style: { color: "var(--color-black)" } },
            props.children
        )
    )
}

// const iconSelectOption = factory(iconSelectOptionComponent)

export default factory(iconEditorComponent)
