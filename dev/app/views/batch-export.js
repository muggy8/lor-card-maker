import factory, { div, button, strong } from "/Utils/elements.js"
import { createElement, useEffect, useState, useLayoutEffect, useRef, useCallback } from "/cdn/react" 
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { getCardList } from "/Utils/service.js"
import { typeToComponent } from "/Views/list.js"
import { svgRefference, openUri } from "/Views/card-editor.js"
import BatchRenderer from "/Components/batch-renderer.js"
import saveSvgAsPng from "/cdn/save-svg-as-png"

const cssLoaded = loadCss("/Views/batch-export.css")

function BatchExportComponent(){

    const translate = useLang()

    const [savedCards, updateSavedCards] = useState([])

    const [selectedCards, updateSelectedCards] = useState({})

    useEffect(()=>{
        getCardList().then(updateSavedCards)
    }, [])

    const fixedDisplayRef = useRef()
    const [useableWidth, updateUseableWidth] = useState(0)
    const [previewHeight, updatePreviewHeight] = useState(0)
    useLayoutEffect(()=>{
        window.scroll(0,0)
        
        function setFixedDisplayDimentions(){
            let useableWidth = fixedDisplayRef.current.parentNode.clientWidth
            const computedStyle = getComputedStyle(fixedDisplayRef.current.parentNode)

            useableWidth = useableWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)

            updateUseableWidth(useableWidth)
            updatePreviewHeight(fixedDisplayRef.current.offsetHeight)
        }
        requestAnimationFrame(setFixedDisplayDimentions)

        const observer = new MutationObserver(setFixedDisplayDimentions)

        window.addEventListener("resize", setFixedDisplayDimentions)
        observer.observe(fixedDisplayRef.current, {
            attributes: true
        })

        return function(){
            window.removeEventListener("resize", setFixedDisplayDimentions)
            observer.disconnect()
        }
    }, [])

    const [svgRef, updateSvgRef] = useState(null)

    const exportCards = useCallback(()=>{
        if (!Object.keys(selectedCards).length){
            return
        }

        saveSvgAsPng.svgAsPngUri(svgRef, {
            excludeUnusedCss: true,
            width: svgRef.width.baseVal.value,
            height: svgRef.height.baseVal.value,
        }).then(uri=>{
            openUri(uri)
        })
    }, [svgRef, selectedCards])

    return div(
        {
            id: "batch-exporter",
            className: "gutter-t-2 flex hcenter",
        },

        div(
            { 
                className: "export-preview gutter-t-2 box-xs-12 box-s-8 box-m-6 box-l-5 box-xl-4", 
                style: { paddingBottom: previewHeight + "px"}
            },
            div(
                {className: "preview-content", ref: fixedDisplayRef, style: {
                    width: useableWidth + "px"
                }},
                div(
                    { className: "gutter-rl-.5 gutter-b flex hcenter" },
                    Object.keys(selectedCards).length 
                        ? button(
                            { 
                                className: "gutter-trbl-.5", 
                                onClick: exportCards,
                            },
                            strong(translate("export_selection"))
                        )
                        : undefined 
                    ,
                ),
                div(
                    { className: "gutter-rl-2" },
                    createElement(
                        svgRefference.Provider,
                        { value: {
                            current: svgRef,
                            setRef: updateSvgRef,
                        } },
                        BatchRenderer({
                            cards: savedCards.filter(cardData=>selectedCards[cardData.id])
                        })
                    ),
                ),
            )
        ),
        div(
            { className: "export-selection gutter-tb-4 gutter-rl box-xs-12 box-s-8 box-m-6 box-l-5 box-xl-4" },
            div(
                { className: "flex hcenter" },
                strong( translate("select_exports") )
            ),
            div(
                { className: "gutter-trbl-.5 flex",},

                savedCards.map((cardData)=>{
                    const renderingComponent = typeToComponent(cardData.type)
                    if (!renderingComponent){
                        return div({key: cardData.id})
                    }
                    return div(
                        { 
                            className: "clickable gutter-trbl-.5 box-xs-6 box-s-4 flex column vhcenter"
                                + (selectedCards[cardData.id] ? "" : " ghost"), 
                            key: cardData.id,
                            onClick: ()=>{
                                const newSelection = { ...selectedCards }

                                if (newSelection[cardData.id]){
                                    delete newSelection[cardData.id]
                                }
                                else{
                                    newSelection[cardData.id] = true
                                }

                                updateSelectedCards(newSelection)
                            }
                        },
                        renderingComponent(cardData)
                    )
                }),
            ),

        )
    )
}

export default factory(BatchExportComponent, cssLoaded)