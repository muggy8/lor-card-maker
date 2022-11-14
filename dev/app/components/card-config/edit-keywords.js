import factory, { label, div, strong } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useEffect } from "/cdn/react"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import Keyword, { keywords } from "/Components/card-template/keyword-renderer.js"
import { getCardList } from "/Utils/service.js"

function EditKeywordComponent(props){
    const translate = useLang()

    const toggleKeyword = useCallback((keywordName)=>{
        const keywordIndex = props.value.indexOf(keywordName)
        if (keywordIndex > -1){
            const toggledOffState = props.value.filter(name=>name !== keywordName)
            return props.updateValue(toggledOffState)
        }
        const toggledOnState = [...props.value, keywordName]
        props.updateValue(toggledOnState)
    }, [props.value, props.updateValue])

    const [savedKeyword, updateSavedKeyword] = useState([])
    useEffect(()=>{
        getCardList().then(list=>list.filter(card=>card.type === "keyword")).then(updateSavedKeyword)
    }, [])

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
	                        toggleKeyword(keywordName)
	                    },
	                    keywordName,
	                })
                )
            }),
            savedKeyword.map(savedKeyword=>{
                return div(
					{ className: "box-3 flex vhcenter", key: savedKeyword.id },
	                KeywordImageCheck({
	                    keywordName: savedKeyword.name,
                        icons: savedKeyword.icons
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
