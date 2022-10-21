import factory, { label, div, strong } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState } from "/cdn/react"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import Keyword, { keywords } from "/Components/card-template/keyword-renderer.js"

function EditKeywordComponent(props){
    const translate = useLang()

    const toggleFaction = useCallback((keywordName)=>{
        const factionNameIndex = props.value.indexOf(keywordName)
        if (factionNameIndex > -1){
            const toggledOffState = props.value.filter(name=>name !== keywordName)
            return props.updateValue(toggledOffState)
        }
        const toggledOnState = [...props.value, keywordName]
        if (toggledOnState.length > 5){
            return props.updateValue(toggledOnState.slice(-5))
        }
        props.updateValue(toggledOnState)
    }, [props.value, props.updateValue])



    return label(
        div(
            strong(translate("keyword"))
        ),
        div(
            { className: "flex gutter-b-2" },
            Object.keys(keywords).map(keywordName=>{
                const isChecked = props.value.some(checkedValue=>{
                    return checkedValue === keywordName
                })

                return div(
					{ className: "box-3 flex vhcenter", key: keywordName },
	                KeywordImageCheck({
	                    isChecked,
	                    onClick: ()=>{
	                        toggleFaction(keywordName)
	                    },
	                    keywordName,
	                })
                )
            }),
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
                onDimension: updateDimensions
            })
        ),
    )
}

export const KeywordImageCheck = factory(KeywordImageCheckComponent)

export default factory(EditKeywordComponent);
