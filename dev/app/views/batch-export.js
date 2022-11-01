import factory, { div, button, strong } from "/Utils/elements.js"
import { createElement, useEffect, useState, useLayoutEffect, useCallback, useRef } from "/cdn/react" 
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
    const [savedCardsById, updateSavedCardsById] = useState({})
    useEffect(()=>{
        const collectionById = savedCards.reduce((collection, cardData)=>{
            collection[cardData.id] = cardData
            return collection
        }, {})

        updateSavedCardsById(collectionById)
    }, [savedCards])

    const [reRenderKey, updateRerenderKey] = useState(false)
    const forceRerender = useCallback(()=>{
        updateRerenderKey(!reRenderKey)
    }, [reRenderKey])

    const selectedCards = useRef(new Map)

    const selectedCardsData = []
    for(let pair of selectedCards.current.entries()){
        const [id, included] = pair
        included && selectedCardsData.push(savedCardsById[id])
    }

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

    const exportCards = ()=>{
        if (!Object.keys(selectedCardsData).length){
            return
        }

        saveSvgAsPng.svgAsPngUri(svgRef, {
            excludeUnusedCss: true,
            width: svgRef.width.baseVal.value,
            height: svgRef.height.baseVal.value,
        }).then(uri=>{
            openUri(uri)
        })
    }

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
                    selectedCardsData
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
                            cards: selectedCardsData
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
                                + (selectedCards.current.get(cardData.id) ? "" : " ghost"), 
                            key: cardData.id,
                            onClick: ()=>{

                                if (selectedCards.current.get(cardData.id)){
                                    selectedCards.current.delete(cardData.id)
                                }
                                else{
                                    selectedCards.current.set(cardData.id, true)
                                }

                                forceRerender()
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