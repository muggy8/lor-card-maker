import factory, { label, div, strong } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useRef, useContext } from "/cdn/react"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import Keyword, { keywords } from "/Components/card-template/keyword-renderer.js"
import { Globals } from "/Views/index.js"
import useToggle from "/Utils/use-toggle.js"
import useAssetCache, { useAssetCacheDebounced } from "/Utils/use-asset-cache.js"

function EditKeywordComponent(props){
    const translate = useLang()
    const { customKeywords } = useContext(Globals)

    const toggleKeyword = useCallback((keywordName)=>{
        const keywordIndex = props.value.indexOf(keywordName)
        if (keywordIndex > -1){
            const toggledOffState = props.value.filter(name=>name !== keywordName)
            return props.updateValue(toggledOffState)
        }
        const toggledOnState = [...props.value, keywordName]
        props.updateValue(toggledOnState)
    }, [props.value, props.updateValue])

    const toggleCustomKeyword = useCallback((customKeyword)=>{
        const keywordIndex = props.value.findIndex(savedKeyword=>{
            return savedKeyword.id === customKeyword.id
        })

        if (keywordIndex > -1){
            const toggledOffState = props.value.filter(savedKeyword=>savedKeyword.id !== customKeyword.id)
            return props.updateValue(toggledOffState)
        }
        const toggledOnState = [...props.value, customKeyword]
        props.updateValue(toggledOnState)
    }, [props.value, props.updateValue])

    const [expanded, toggleExpanded] = useToggle(false)

    return label(
        div(
            { onClick: toggleExpanded, className: "flex" },
            div(
                { className: "grow" },
                strong(translate("keyword"))
            ),
            div({ className: `icon animated ${expanded ? "multiply" : "chevron-down"}` })
        ),
        div(
            { className: `flex gutter-b-2 accordian ${expanded ? "expanded" : ""}` },
            Object.keys(keywords).map(keywordName=>{
                const isChecked = props.value.some(checkedValue=>{
                    return checkedValue === keywordName
                })

                return div(
					{ className: "box-3 flex vhcenter", key: keywordName },
	                KeywordImageCheck({
	                    isChecked,
	                    onClick: ()=>{
	                        toggleKeyword(keywordName)
	                    },
	                    keywordName,
	                })
                )
            }),
            customKeywords.map(customKeyword=>{
                const isChecked = props.value.some(checkedValue=>{
                    return checkedValue.id === customKeyword.id
                })

                return div(
					{ className: "box-3 flex vhcenter", key: customKeyword.id },
	                KeywordImageCheck({
	                    keywordName: customKeyword.name,
                        icons: customKeyword.icons,
                        isChecked,
                        onClick: ()=>{
                            toggleCustomKeyword(customKeyword)
                        }
	                })
                )
            })
        )
    )
}

function KeywordImageCheckComponent(props){
    const isChecked = props.isChecked

    const [dimensions, updateDimensions] = useState({
        width: 120,
        height: 104,
    })

    return div(
        {
            className: `gutter-trbl-.25 clickable flex column vhcenter ${isChecked ? "" : "ghost"}`,
            onClick: props.onClick
        },
        SvgWrap(
            dimensions,
            Keyword({
                name: props.keywordName,
                size: "small",
                icons: props.icons,
                onDimension: updateDimensions
            })
        ),
    )
}

export const KeywordImageCheck = factory(KeywordImageCheckComponent)

export default factory(EditKeywordComponent);
