import factory, { div, label, strong, button, fragment, select as normalSelect, option as normalOption } from "/Utils/elements.js"
import reactSelect, { components  } from '/cdn/react-select';
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useEffect, useContext, createElement } from "/cdn/react"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import EditArt from "/Components/card-config/edit-art.js"
import ArtRenderer from "/Components/card-template/image-render.js"
import saveSvgAsPng from "/cdn/save-svg-as-png"
import { InlineIcon } from "/Components/card-template/effect-text.js"
import svgWrap from "../card-template/svg-wrap.js";
import { decimalLimit } from "/Components/card-config/edit-shade.js";
import { svgRefference } from "/Views/card-editor.js"
import { Globals } from "/Views/index.js"
import useAssetCache from "/Utils/use-asset-cache.js";
import InputRange from "/Components/range-input.js"
import editRarityPoc from "./edit-rarity-poc.js";

loadCss("/Components/card-config/edit-icon.css")

const customSelect = factory(reactSelect)
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
    "champ.png",
    "chat.png",
    "discovered.png",
    "dislike.png",
    "flag.png",
    "hexigon.png",
    "like.png",
    "pray.png",
    "sword.png",
]

const pocModeOptions = [
    "none",
    "power",
    "relic", 
    "item",
]

const iconPresetSettings = [
    { // challenger orange
        id: "orange",
        hue: 0,
        contrast: 2,
        saturation: 5,
        brightness: 0.52,
        sepia: 0.5,
    },
    { // life steal red
        id: "red",
        hue: 320,
        contrast: 2,
        saturation: 4.5,
        brightness: 0.47,
        sepia: 0.55,
    },
    { // barrier yellow
        id: "yellow",
        hue: 20,
        contrast: 2.5,
        saturation: 4.25,
        brightness: 0.7,
        sepia: 0.6,
    },
    { // ephemeral purple
        id: "purple",
        hue: 240,
        contrast: 2.5,
        saturation: 4,
        brightness: 0.4,
        sepia: 0.65,
    },
    { // capture blue
        id: "blue",
        hue: 137,
        contrast: 1.5,
        saturation: 5,
        brightness: 0.6,
        sepia: 0.6,
    },
    { // cant attack gray
        id: "gray",
        hue: 0,
        contrast: 2,
        saturation: 0.2,
        brightness: 0.5,
        sepia: 0.7,
    },
]

function iconEditorComponent(props){

    const translate = useLang()

    const globalState = useContext(Globals)
    const lowSpecsMode = globalState.state.settings.lowSpecsMode === true

    const [hue, updateHue] = useState(0)
    const [contrast, udpateContrast] = useState(2)
    const [saturation, updateSaturation] = useState(0.2)
    const [brightness, updateBrightness] = useState(0.5)
    const [sepia, updateSepia] = useState(0.7)

    const [selected, updateSelected] = useState(null)
    const [iconUri, updateIconUri] = useState("")
    useEffect(()=>{
        if (!selected){
            return
        }
        datauri(selected.icon).then(updateIconUri)
        updateHue(0)
        udpateContrast(2)
        updateSaturation(0.2)
        updateBrightness(0.5)
        updateSepia(0.7)
    }, [selected])

    const [teplatedSvgRef, updateTemplatedeSvgRef] = useState(null)
    const [exportingPremade, setExportingPremade] = useState(false)
    const exportIcon = useCallback(()=>{
		if (exportingPremade){
            return
        }
        setExportingPremade(true)

        requestAnimationFrame(() => {
            saveSvgAsPng.svgAsPngUri(teplatedSvgRef, {
                excludeUnusedCss: true,
                width: teplatedSvgRef.width.baseVal.value,
                height: teplatedSvgRef.height.baseVal.value,
            }).then(uri=>{
                props.updateValue([...(props.value || []), uri])
                updateSelected(null)
                updateIconUri("")
                setExportingPremade(false)
            }, ()=>setExportingPremade(false))
        })
	}, [teplatedSvgRef, exportingPremade, props.value])
    const cancelFromTemplate = useCallback(()=>{
        updateSelected(null)
        updateIconUri("")
        setExportingPremade(false)
    }, [])

    const [uploadReady, updateUploadReady] = useState(false)
    const uploadIsNowReady = useCallback(()=>updateUploadReady(true))
    const uploadIsNotReady = useCallback(()=>updateUploadReady(false))

    const [uploadedIcon, updateUploadedIcon] = useState("")
    const [uploadTransform, updateUploadTransform] = useState({
        x: 0,
        y: 0,
        scale: 1,
    })
    const [uploadedSvgRef, updateUploadedSvgRef] = useState(null)
    const [exportingUpload, setExportingUpload] = useState(false)
    useEffect(()=>{
        updateUploadTransform({
            x: 0,
            y: 0,
            scale: 1,
        })
        uploadIsNotReady()
    }, [uploadedIcon])

    const cancelUpload = useCallback(()=>{
        updateUploadedIcon("")
    }, [])

    const useUploadedIcon = useCallback(()=>{
        if (exportingUpload || !uploadReady){
            return
        }

        setExportingUpload(true)
        saveSvgAsPng.svgAsPngUri(uploadedSvgRef, {
            excludeUnusedCss: true,
            width: uploadedSvgRef.width.baseVal.value,
            height: uploadedSvgRef.height.baseVal.value,
        }).then(uri=>{
            props.updateValue([...(props.value || []), uri])
            updateUploadedIcon("")
            setExportingUpload(false)
            uploadIsNotReady()
        }, ()=>setExportingUpload(false))

    }, [uploadedSvgRef, exportingUpload, props.value, uploadReady])

    const [expandAdvanced, updateExpandAdvanced] = useState(false)
    const toggleExpandAdvanced = useCallback(()=>updateExpandAdvanced(!expandAdvanced), [expandAdvanced, updateExpandAdvanced])

    return div(
        { className: "edit-icon box" },

        label(
            strong(
                translate("keyword_icon"),
            ),
        ),

        props.value && props.value.length
            ? div(
                { className: "gutter-trl-.5" },
                div(
                    translate("icons")
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

        !selected
            ? div(
                div(
                    { className: "gutter-trl-.5" },
                    translate("upload_icon")
                ),
                EditArt({
                    value: uploadedIcon,
                    updateValue: updateUploadedIcon,
                    moveable: false,
                }),
                uploadedIcon
                    ? div(
                        div(
                            { className: "flex vhcenter gutter-tb-2" },

                            createElement(
                                svgRefference.Provider,
                                { value: { // replace teh svg ref so the stuff below dont ruin the fun for our exporter
                                    current: uploadedSvgRef,
                                    setRef: updateUploadedSvgRef,
                                } },

                                svgWrap(
                                    {
                                        width: 256,
                                        height: 256,
                                        loading: exportingUpload,
                                        onTransform: updateUploadTransform,
                                        ...uploadTransform,
                                    },
                                    div(
                                        {
                                            className: "icon-svg-content",
                                            style: {
                                                "--scale": uploadTransform.scale,
                                                "--left": uploadTransform.x,
                                                "--top": uploadTransform.y,
                                            },
                                        },
                                        div(
                                            {className: "scale-adjuster"},
                                            ArtRenderer({ url: uploadedIcon, onImageChanged:uploadIsNowReady })
                                        )
                                    ),
                                )
                            ),
                        ),

                        div(
                            { className: "flex gutter-t-.5" },
                            button(
                                { className: "box gutter-trbl-1", onClick: useUploadedIcon, ...(
                                    uploadReady
                                        ? {}
                                        : { disabled: true }
                                ) },
                                uploadReady ? translate("use_icon") : div({className: "icon loading"})
                            ),
                            div({ className: "gutter-r-.5" }),
                            button(
                                { className: "gutter-trbl-1", onClick: cancelUpload},
                                translate("cancel")
                            )
                        ),
                    )
                    : undefined
                ,
            )
            : undefined
        ,

        !uploadedIcon
            ? div(
                !selected
                    ? div({ className: "box gutter-rl-.5 gutter-t-.75" }, strong(translate("or")))
                    : undefined
                ,

                div(
                    { className: "gutter-trl-.5" },
                    translate("create_icon"),
                    div(
                        { className: "gutter-t-.5" },
                        customSelect({
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
                                label(
                                    { className: "gutter-t" },
                                    strong(
                                        translate("preview")
                                    ),
                                ),
                                div(
                                    {
                                        className: "flex vhcenter gutter-t-.5",
                                    },
                                    createElement(
                                        svgRefference.Provider,
                                        { value: { // replace teh svg ref so the stuff below dont ruin the fun for our exporter
                                            current: teplatedSvgRef,
                                            setRef: updateTemplatedeSvgRef,
                                        } },

                                        customIconPreview({
                                            iconUri,
                                            brightness,
                                            sepia,
                                            saturation,
                                            hue,
                                            contrast,
                                            loading: exportingPremade,
                                        })
                                    ),
                                ),
                                label(
                                    { className: "box gutter-t" },
                                    div(
                                        { className: "box-4 flex vcenter gutter-t" },
                                        strong(
                                            translate("presets"),
                                        )
                                    ),
                                    div(
                                        { className: "flex gutter-trbl-.5" },
                                        iconPresetSettings.map(preset=>div(
                                            { 
                                                key: preset.id, 
                                                className: "box-2 clickable",
                                                onClick: ()=>{
                                                    updateHue(preset.hue)
                                                    udpateContrast(preset.contrast)
                                                    updateSaturation(preset.saturation)
                                                    updateBrightness(preset.brightness)
                                                    updateSepia(preset.sepia)
                                                }
                                            },
                                            customIconPreview({
                                                ...preset,
                                                iconUri,
                                                loading: exportingPremade,
                                            }),
                                        ))
                                    ),
                                ),
                                div(
                                    { className: "flex clickable", onClick: toggleExpandAdvanced},
                                    div(
                                        { className: "grow flex vcenter" },
                                        label(
                                            strong(
                                                translate("advanced_color_settings")
                                            )
                                        )
                                    ),
                                    button(
                                        { className: "gutter-trbl-.5 flex vcenter" },
                                        div({ className: `icon ${lowSpecsMode ? "" : "animated"} ${expandAdvanced ? "multiply" : "chevron-down"}` })
                                    ),
                                ),
                                div(
                                    {
                                        className: `accordian gutter-b-.5 ${expandAdvanced ? "expanded" : ""}`
                                    },
                                    label(
                                        { className: "box gutter-trbl-.5 flex-s" },
                                        div(
                                            { className: "box-4 flex vcenter gutter-t" },
                                            translate("saturation"),
                                            ":",
                                        ),
                                        div(
                                            { className: "grow gutter-t" },
                                            InputRange(
                                                {
                                                    formatLabel: value => `${decimalLimit(value*100)}%`,
                                                    value: saturation,
                                                    min: 0,
                                                    max: 5,
                                                    step: 0.01,
                                                    onChange: updateSaturation,
                                                }
                                            )
                                        )
                                    ),
                                    label(
                                        { className: "box gutter-trbl-.5 flex-s" },
                                        div(
                                            { className: "box-4 flex vcenter gutter-t" },
                                            translate("hue_rotation"),
                                            ":",
                                        ),
                                        div(
                                            { className: "grow gutter-t" },
                                            InputRange(
                                                {
                                                    formatLabel: value => `${decimalLimit(value)}deg`,
                                                    value: hue,
                                                    min: 0,
                                                    max: 360,
                                                    step: 1,
                                                    onChange: updateHue,
                                                }
                                            )
                                        )
                                    ),
                                    label(
                                        { className: "box gutter-trbl-.5 flex-s" },
                                        div(
                                            { className: "box-4 flex vcenter gutter-t" },
                                            translate("brightness"),
                                            ":",
                                        ),
                                        div(
                                            { className: "grow gutter-t" },
                                            InputRange(
                                                {
                                                    formatLabel: value => `${decimalLimit(value*100)}%`,
                                                    value: brightness,
                                                    min: 0,
                                                    max: 2,
                                                    step: 0.01,
                                                    onChange: updateBrightness,
                                                }
                                            )
                                        )
                                    ),
                                    label(
                                        { className: "box gutter-trbl-.5 flex-s" },
                                        div(
                                            { className: "box-4 flex vcenter gutter-t" },
                                            translate("contrast"),
                                            ":",
                                        ),
                                        div(
                                            { className: "grow gutter-t" },
                                            InputRange(
                                                {
                                                    formatLabel: value => `${decimalLimit(value*100)}%`,
                                                    value: contrast,
                                                    min: 0,
                                                    max: 5,
                                                    step: 0.01,
                                                    onChange: udpateContrast,
                                                }
                                            )
                                        )
                                    ),
                                    label(
                                        { className: "box gutter-trbl-.5 flex-s" },
                                        div(
                                            { className: "box-4 flex vcenter gutter-t" },
                                            translate("sepia"),
                                            ":",
                                        ),
                                        div(
                                            { className: "grow gutter-t" },
                                            InputRange(
                                                {
                                                    formatLabel: value => `${decimalLimit(value*100)}%`,
                                                    value: sepia,
                                                    min: 0,
                                                    max: 1,
                                                    step: 0.01,
                                                    onChange: updateSepia,
                                                }
                                            )
                                        )
                                    ),
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
            : undefined
        ,
    )
}

export function customIconPreview(props){
    const {
        iconUri,
        brightness,
        sepia,
        saturation,
        hue,
        contrast,
        loading,
    } = props
    return svgWrap(
        { width: 128, height: 128, loading },
        div({
            className: "custom-icon",
            style: {
                backgroundImage: iconUri ? `url(${iconUri})` : undefined,
                filter: `brightness(${brightness}) sepia(${sepia}) saturate(${saturation}) hue-rotate(${hue}deg) contrast(${contrast})`,
            },
        }),
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
