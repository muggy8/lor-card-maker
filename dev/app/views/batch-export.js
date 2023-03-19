import factory, { div, button, strong, section } from "/Utils/elements.js"
import { createElement, useEffect, useState, useLayoutEffect, useCallback, useRef, useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { getCardList } from "/Utils/service.js"
import { typeToComponent } from "/Views/list.js"
import { svgRefference } from "/Views/card-editor.js"
import BatchRenderer from "/Components/batch-renderer.js"
import saveSvgAsPng from "/cdn/save-svg-as-png"
import useToggle from "/Utils/use-toggle.js"
import debounceFunction from "/Utils/debounce-function.js"
import listLimit from "/Components/list-limit.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import { isMobile } from '/cdn/react-device-detect'
import exportFromApp from "/Components/export.js"

const cssLoaded = loadCss("/Views/batch-export.css")

function BatchExportComponent(){

    const translate = useLang()

    const globalState = useContext(Globals)
    const globalStateRef = useRef()
    globalStateRef.current = globalState

    useEffect(()=>{
        const storedCallback = globalState.getAllowBack()

        globalStateRef.current.setAllowBack(()=>{
            if (document.documentElement.scrollTop > 100){
                setImmediate(()=>window.scroll({
                    top: -document.documentElement.scrollTop,
                    left: 0,
                    behavior: "smooth",
                }))
                return false
            }
            else{
                return storedCallback()
            }
        })

        return function(){
            globalStateRef.current.setAllowBack(storedCallback)
        }
    }, [])

    const savedCards = useAssetCache(updateSavedCards=>{
        getCardList().then(updateSavedCards)
    }, [], [])

    const savedCardsById = useAssetCache(updateSavedCardsById=>{
        const collectionById = savedCards.reduce((collection, cardData)=>{
            collection[cardData.id] = cardData
            return collection
        }, {})

        updateSavedCardsById(collectionById)
    }, [savedCards], {})

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

    const fixedDisplayRef = useRef()
    const [useableWidth, updateUseableWidth] = useState(0)
    const [previewHeight, updatePreviewHeight] = useState(0)
    useLayoutEffect(()=>{        
        const setFixedDisplayDimentions = debounceFunction(function(){
            let useableWidth = fixedDisplayRef.current.parentNode.clientWidth
            const computedStyle = getComputedStyle(fixedDisplayRef.current.parentNode)

            useableWidth = useableWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)

            updateUseableWidth(useableWidth)
            updatePreviewHeight(fixedDisplayRef.current.offsetHeight)
        }, 250)
        requestAnimationFrame(setFixedDisplayDimentions)

        const observer = new MutationObserver(setFixedDisplayDimentions)

        window.addEventListener("resize", setFixedDisplayDimentions)
        observer.observe(fixedDisplayRef.current, {
            childList: true,
            subtree: true,
            attributes: ["style"]
        })

        return function(){
            window.removeEventListener("resize", setFixedDisplayDimentions)
            observer.disconnect()
        }
    }, [])

    const [svgRef, updateSvgRef] = useState(null)

    const [exproting, _toggleExporting, setExporting] = useToggle(false)

    const exportCards = ()=>{
        if (exproting || !Object.keys(selectedCardsData).length){
            return
        }
        setExporting(true)
        requestAnimationFrame(() => {
            exportFromApp(selectedCardsData, svgRef, globalState).then(()=>setExporting(false), (err)=>console.warn(err) + setExporting(false))
        })        
    }

    const mbInstruction = useRef()
    const [opacity, updateOpacity] = useState(0)
    useEffect(()=>{
        const onScale = debounceFunction(()=>{
            const currentDisplay = window.getComputedStyle(mbInstruction.current).display
            if (typeof currentDisplay === "string" && currentDisplay.includes("flex")){
                updateOpacity(0)
            }
            else{
                updateOpacity(1)
            }
        }, 350)
        onScale()

        window.addEventListener("resize", onScale)

        return ()=>{
            window.removeEventListener("resize", onScale)
        }
    }, [])

    return section(
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
                                className: "export-button gutter-tb-.5 gutter-rl-2", 
                                onClick: exportCards,
                                [(!Object.keys(selectedCardsData).length || exproting ? "disabled" : "data-foo")]: true
                            },
                            strong(translate("share_selection"))
                        )
                        : undefined 
                    ,
                ),
                div(
                    { className: "gutter-rl-2" },
                    
                    Object.keys(selectedCardsData).length 
                        ? undefined
                        : div(
                            { className: "no-export-selected" },
                            div(
                                { className: "flex vhcenter" },
                                translate("no_export_selected")
                            ),
                            div(
                                { className: "flex-m", style: {opacity}, ref: mbInstruction}, 
                                translate("scroll_down_for_selection"),
                            )
                        )
                    , 

                    createElement(
                        svgRefference.Provider,
                        { value: {
                            current: svgRef,
                            setRef: updateSvgRef,
                        } },
                        BatchRenderer({
                            cards: selectedCardsData,
                            loading: exproting,
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
                listLimit(
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
                    })
                ),
            ),

        )
    )
}

export default factory(BatchExportComponent, cssLoaded)