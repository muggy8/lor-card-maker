import factory, { label, div, strong, button } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useContext, useEffect } from "/cdn/react"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import Keyword, { keywords } from "/Components/card-template/keyword-renderer.js"
import { Globals } from "/Views/index.js"
import useToggle from "/Utils/use-toggle.js"

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

    const [expanded, toggleExpanded, setExpanded] = useToggle(false)

    return div(
        div(
            { onClick: toggleExpanded, className: "flex clickable" },
            div(
                { className: "grow" },
                label(
                    strong(translate("keyword"))
                )
            ),
        ),

        div(
            { className: "gutter-b-2" },
            (props.value || []).map(keyword=>{
                if (typeof keyword === "string"){
                    const keywordName = keyword
                    return div(
                        { className: "flex no-wrap gutter-t-.5", key: keywordName },
                        div(
                            { className: "grow flex start" },
                            KeywordImageCheck({
                                keywordName,
                                isChecked: true,
                                size: "large",
                            }),
                        ),
                        button(
                            {
                                className: "gutter-trbl-.5",
                                onClick: ()=>toggleKeyword(keywordName)
                            },
                            div({ className: "icon multiply" })
                        )
                    )
                }
                else if (typeof keyword === "object"){
                    const customKeyword = keyword

                    return div(
                        { className: "flex no-wrap gutter-t-.5", key: customKeyword.id },
                        div(
                            { className: "grow flex start" },
                            KeywordImageCheck({
                                keywordName: customKeyword.name,
                                icons: customKeyword.icons,
                                isChecked: true,
                                size: "large",
                            }),
                        ),
                        button(
                            {
                                className: "gutter-trbl-.5",
                                onClick: ()=>toggleCustomKeyword(customKeyword)
                            },
                            div({ className: "icon multiply" })
                        )
                    )
                }
            })
        ),

        div(
            { className: "flex" },
            button(
                { 
                    className: "grow gutter-trbl-.5", 
                    onClick: toggleExpanded
                },
                expanded ? translate("hide_keyword_list") : translate("add_keyword")
            )
        ),

        div(
            { className: `flex gutter-b-2 accordian ${expanded ? "expanded" : ""}` },
            Object.keys(keywords).map(keywordName=>{
                const isChecked = props.value.some(checkedValue=>{
                    return checkedValue === keywordName
                })

                return div(
					{ className: "box-xs-3 box-l-2 flex vhcenter", key: keywordName },
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
					{ className: "box-xs-3 box-l-2 flex vhcenter", key: customKeyword.id },
	                KeywordImageCheck({
	                    keywordName: customKeyword.name,
                        icons: customKeyword.icons,
                        isChecked,
                        onClick: ()=>toggleCustomKeyword(customKeyword)
	                })
                )
            }),
            div(
                { className: "flex box-12" },
                button(
                    { 
                        className: "grow gutter-trbl-.5", 
                        onClick: ()=>setExpanded(false)
                    },
                    translate("hide_keyword_list")
                )
            ),
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
                size: props.size || "small",
                icons: props.icons,
                onDimension: updateDimensions
            })
        ),
    )
}

export const KeywordImageCheck = factory(KeywordImageCheckComponent)

export default factory(EditKeywordComponent);
