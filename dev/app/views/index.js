import { useState, useCallback, useEffect, useRef, createContext, createElement } from "/cdn/react" 
import factory from "/Utils/elements.js"
import List from "/Views/list.js"
import {BannerBar, SideBar} from "/Components/index.js"
import { getSettings, saveSettings, getCardList } from "/Utils/service.js"
import { scaleFontSize } from "/Components/card-template/effect-text.js"

export const Globals = createContext({
    lang: "en_us",
    card: null,
    translations: {},
})

export let navigationHistory = []

function App (props) {

    const [translations, setTranslations] = useState({})

    const [globalState, updateGlobalState] = useState({
        lang: "en_us",
        view: List,
        defaultBg: true,
        settings: {}
    })

    useEffect(()=>{
        scaleFontSize.lowSpecsMode = !!globalState.settings.lowSpecsMode
    }, [globalState.settings.lowSpecsMode])

    let accumulatedUpdateState = {...globalState}
    const patchGlboalState = useCallback((newState)=>{
        let mergedState = {
            ...accumulatedUpdateState,
            ...newState,
        }

        Object.keys(mergedState).forEach(key=>{
            if (typeof mergedState[key] === "undefined"){
                delete mergedState[key]
            }
        })

        accumulatedUpdateState = mergedState

        const hasAnythingChanged = Object.keys(mergedState)
            .map(key=>mergedState[key] !== globalState[key])
            .reduce((sum, hasChanged)=>sum || hasChanged, false)
        
        if (!hasAnythingChanged){
            return
        }

        updateGlobalState(mergedState)
    }, [globalState, updateGlobalState])

    useEffect(()=>{
        let translationCollection = {};
        const updateTranslations = (languageKey, translations) => {
            translationCollection = {
                ...translationCollection, 
                [languageKey]: translations
            }

            setTranslations(translationCollection)
        }
        fetch("/Assets/lang/en_us.json").then(res=>res.json()).then(updateTranslations.bind(null, "en_us"))
        fetch("/Assets/lang/de_de.json").then(res=>res.json()).then(updateTranslations.bind(null, "de_de"))
        fetch("/Assets/lang/es_es.json").then(res=>res.json()).then(updateTranslations.bind(null, "es_es"))
        fetch("/Assets/lang/es_mx.json").then(res=>res.json()).then(updateTranslations.bind(null, "es_mx"))
        fetch("/Assets/lang/fr_fr.json").then(res=>res.json()).then(updateTranslations.bind(null, "fr_fr"))
        fetch("/Assets/lang/it_it.json").then(res=>res.json()).then(updateTranslations.bind(null, "it_it"))
        fetch("/Assets/lang/ja_jp.json").then(res=>res.json()).then(updateTranslations.bind(null, "ja_jp"))
        fetch("/Assets/lang/ko_kr.json").then(res=>res.json()).then(updateTranslations.bind(null, "ko_kr"))
        fetch("/Assets/lang/pl_pl.json").then(res=>res.json()).then(updateTranslations.bind(null, "pl_pl"))
        fetch("/Assets/lang/pt_br.json").then(res=>res.json()).then(updateTranslations.bind(null, "pt_br"))
        fetch("/Assets/lang/ru_ru.json").then(res=>res.json()).then(updateTranslations.bind(null, "ru_ru"))
        fetch("/Assets/lang/th_th.json").then(res=>res.json()).then(updateTranslations.bind(null, "th_th"))
        fetch("/Assets/lang/tr_tr.json").then(res=>res.json()).then(updateTranslations.bind(null, "tr_tr"))
        fetch("/Assets/lang/zh_tw.json").then(res=>res.json()).then(updateTranslations.bind(null, "zh_tw"))
    }, [setTranslations])

    useEffect(()=>{
        getSettings().then(settings=>patchGlboalState({settings}))
    }, [])

    const [customKeywords, updateCustomKeywords] = useState([])
    const refreshCustomKeywords = useCallback(()=>{
        return getCardList({only: "keyword"}).then(updateCustomKeywords)
    }, [])
    useEffect(()=>{
        refreshCustomKeywords()
    }, [])

    const patchSettings = useCallback((patchUpdate)=>{
        const newSettingsState = {...globalState.settings, ...patchUpdate}
        patchGlboalState({settings: newSettingsState})
        
        saveSettings(newSettingsState)
    }, [globalState.settings, patchGlboalState])

    const statePatcherRef = useRef()

    useEffect(()=>{
        statePatcherRef.current = patchGlboalState
    }, [patchGlboalState])

    const allowBack = useRef(()=>true)
    useEffect(()=>{
        navigationHistory.push(globalState.view)
        const popStateListener = function(ev){
            const allowedToContinue = allowBack.current()

            if (allowedToContinue === false){
                ev.preventDefault()
                ev.stopPropagation()
                history.pushState({},  "")
                return 
            }

            navigationHistory.splice(-1, 1)
            const restoredView = navigationHistory[navigationHistory.length -1]

            if (!restoredView){
                navigationHistory.push(globalState.view)
                return statePatcherRef.current({view: List})
            }
            refreshCustomKeywords()
            statePatcherRef.current({view: restoredView})
        }
        window.addEventListener("popstate", popStateListener)

        return function(){
            window.removeEventListener("popstate", popStateListener)
        }
    }, [])

    const setView = useCallback((newView)=>{
        window.scrollTo(0, 0)

        requestAnimationFrame(()=>{
            statePatcherRef.current({
                view: newView,
            })
            history.pushState({},  "")
            navigationHistory.push(newView)
        })
    }, [])

    useEffect(()=>{
        if (!props.root){
            return
        }

        const bannerHeightWithUnits = (globalState.bannerHeight || 0) + "px"
        props.root.style.setProperty("padding-top", bannerHeightWithUnits)
        props.root.style.setProperty("--banner-height", bannerHeightWithUnits)

        if (globalState.settings.lowSpecsMode === true && !document.documentElement.classList.contains("low-spec-mode")){
            document.documentElement.classList.add("low-spec-mode")
        }
        else if (globalState.settings.lowSpecsMode !== true && document.documentElement.classList.contains("low-spec-mode")){
            document.documentElement.classList.remove("low-spec-mode")
        }

    }, [globalState.bannerHeight, props.root, globalState.settings.lowSpecsMode])

    return createElement(
        Globals.Provider,
        {
            value: {
                state: globalState,
                setState: updateGlobalState,
                patchState: patchGlboalState,
                translations,
                setView, 
                patchSettings,
                getAllowBack: ()=>allowBack.current,
                customKeywords,
                setAllowBack: (callback)=>{
                    allowBack.current = callback
                }
            }
        },
        BannerBar(),
        SideBar(),
        globalState.view(),
    )
}

export default factory(App)