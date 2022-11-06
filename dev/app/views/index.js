import { useState, useCallback, useEffect, useRef, createContext, createElement } from "/cdn/react" 
import factory from "/Utils/elements.js"
import List from "/Views/list.js"
import {BannerBar, SideBar} from "/Components/index.js"
import { getSettings, saveSettings } from "/Utils/service.js"
import setImmediate from "/Utils/set-immediate-batch.js"

export const Globals = createContext({
    lang: "en",
    card: null,
})

export let navigationHistory = []

function App (props) {

    const [globalState, updateGlobalState] = useState({
        lang: "en",
        view: List,
        defaultBg: true,
        settings: {}
    })

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
        getSettings().then(settings=>patchGlboalState({settings}))
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
    }, [globalState.bannerHeight, props.root])

    return createElement(
        Globals.Provider,
        {
            value: {
                state: globalState,
                setState: updateGlobalState,
                patchState: patchGlboalState,
                setView, 
                patchSettings,
                allowBack: allowBack.current,
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