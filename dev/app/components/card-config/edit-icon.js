import factory, { div, label, strong, button, InputRange, fragment, select as normalSelect, option as normalOption } from "/Utils/elements.js"
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
import useToggle from "/Utils/use-toggle.js";
import useAssetCache from "/Utils/use-asset-cache.js";
import editRarity from "./edit-rarity.js";

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

function iconEditorComponent(props){

    const translate = useLang()

    const globals = useContext(Globals)

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
        updateHue(0)
        udpateContrast(1)
        updateSaturation(0)
        updateBrightness(1)
        updateSepia(1)
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
        updatePocMode(false)
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

    // logic to do with the PoC icons 
    const [pocMode, updatePocMode] = useState(false)
    const selectPocMode = useCallback(ev=>{
        const target = ev.target
        const selectedOption = target[target.selectedIndex] 

        if (selectedOption.value === "none"){
            updatePocMode(false)
        }
        else{
            updatePocMode(selectedOption.value)
        }
    }, [])
    const [
        pocPowerFrame, pocPowerFrameCover, 
        pocPowerCommonRing, pocPowerRareRing, pocPowerEpicRing, pocPowerLegendaryRing,
        pocCommonGem, pocRareGem, pocEpicGem, pocLegendaryGem, pocSpecialGem,

        pocRelicFrame,
        pocRelicCommonRing, pocRelicRareRing, pocRelicEpicRing, pocRelicLegendaryRing, pocRelicSpecialRing,

        pocItemFrame,
        pocItemCommonRing, pocItemRareRing, pocItemEpicRing, pocItemLegendaryRing, pocItemSpecialRing,
    ] = useAssetCache(updateCache=>{
        Promise.all([
            datauri("/Assets/keyword/poc-frame-overlay.png"),
            datauri("/Assets/keyword/poc-frame-overlay-cover.png"),

            datauri("/Assets/keyword/poc-frame-overlay-common.png"),
            datauri("/Assets/keyword/poc-frame-overlay-rare.png"),
            datauri("/Assets/keyword/poc-frame-overlay-epic.png"),
            datauri("/Assets/keyword/poc-frame-overlay-legendary.png"),
            
            datauri("/Assets/keyword/poc-common.png"),
            datauri("/Assets/keyword/poc-rare.png"),
            datauri("/Assets/keyword/poc-epic.png"),
            datauri("/Assets/keyword/poc-legendary.png"),
            datauri("/Assets/keyword/poc-special.png"),

            datauri("/Assets/keyword/poc-relic-frame.png"),
            datauri("/Assets/keyword/poc-relic-frame-overlay-common.png"),
            datauri("/Assets/keyword/poc-relic-frame-overlay-rare.png"),
            datauri("/Assets/keyword/poc-relic-frame-overlay-epic.png"),
            datauri("/Assets/keyword/poc-relic-frame-overlay-legendary.png"),
            datauri("/Assets/keyword/poc-relic-frame-overlay-special.png"),

            datauri("/Assets/keyword/poc-item-frame.png"),
            datauri("/Assets/keyword/poc-item-frame-overlay-common.png"),
            datauri("/Assets/keyword/poc-item-frame-overlay-rare.png"),
            datauri("/Assets/keyword/poc-item-frame-overlay-epic.png"),
            datauri("/Assets/keyword/poc-item-frame-overlay-legendary.png"),
            datauri("/Assets/keyword/poc-item-frame-overlay-special.png"),
        ]).then(updateCache)
    }, [], [])
    const [pocRarity, updatePocRarity] = useState("")

    return div(
        { className: "edit-icon box" },

        label(
            div(
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
                                            className: `icon-svg-content ${ pocMode ? "poc-icon crop" : "" }`,
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

                                    pocMode 
                                        ? fragment(
                                            div({ 
                                                className: "poc-icon poc-frame",
                                                style: {
                                                    backgroundImage: `url(${pocPowerFrame})`
                                                }
                                            }),
                                            div({ 
                                                className: "poc-icon poc-frame",
                                                style: {
                                                    backgroundImage: `url(${pocPowerFrameCover})`
                                                }
                                            }),
                                            pocRarity 
                                                ? fragment(
                                                    div({ 
                                                        className: "poc-icon poc-frame",
                                                        style: {
                                                            backgroundImage: `url(${
                                                                (pocRarity === "common" && pocPowerCommonRing) ||
                                                                (pocRarity === "rare" && pocPowerRareRing) ||
                                                                (pocRarity === "epic" && pocPowerEpicRing) ||
                                                                (pocRarity === "champion" && pocPowerLegendaryRing) ||
                                                                ""
                                                            })`
                                                        }
                                                    }),
                                                    div({
                                                        className: "poc-icon poc-gem",
                                                        style: {
                                                            backgroundImage: `url(${
                                                                (pocRarity === "common" && pocCommonGem) ||
                                                                (pocRarity === "rare" && pocRareGem) ||
                                                                (pocRarity === "epic" && pocEpicGem) ||
                                                                (pocRarity === "champion" && pocLegendaryGem) ||
                                                                ""
                                                            })`
                                                        },
                                                    })
                                                )
                                                : undefined
                                            ,
                                        )
                                        : undefined
                                    ,
                                )
                            ),
                        ),

                        div(
                            { className: "flex gutter-t-.5" },
                            button(
                                { className: "box gutter-trbl-1", onClick: useUploadedIcon, [uploadReady ? "" : "disabled" ]: true },
                                uploadReady ? translate("use_icon") : div({className: "icon loading"})
                            ),
                            div({ className: "gutter-r-.5" }),
                            button(
                                { className: "gutter-trbl-1", onClick: cancelUpload},
                                translate("cancel")
                            )
                        ),

                        pocPowerFrame 
                            ? div(
                                { className: "flex gutter-t" },
                                normalSelect({
                                    onChange: selectPocMode,
                                    className: "grow gutter",
                                    value: pocMode ? pocMode : "none" 
                                }, pocModeOptions.map(key=>{
                                    const optionProps = {
                                        key,
                                        value:key, 
                                    }
                                    return normalOption(
                                        optionProps,
                                        translate(key)
                                    )
                                }))
                            )
                            : undefined 
                        ,

                        pocMode 
                            ? fragment(
                                editRarity({
                                    value: pocRarity,
                                    updateValue: updatePocRarity,
                                })
                            ) 
                            : undefined 
                        ,
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

                                        svgWrap(
                                            { width: 128, height: 128, loading: exportingPremade },
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
            : undefined
        ,
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
