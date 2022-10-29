import { useState, useCallback, useEffect, useRef, createContext, createElement } from "/cdn/react" 
import factory, { main } from "/Utils/elements.js"
import List from "/Views/list.js"
import {BannerBar, SideBar} from "/Components/index.js"

export const Globals = createContext({
    lang: "en",
    card: null,
})

export let navigationHistory = []

function App () {

    const [globalState, updateGlobalState] = useState({
        lang: "en",
        view: List,
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

    const statePatcherRef = useRef()

    useEffect(()=>{
        statePatcherRef.current = patchGlboalState
    }, [patchGlboalState])

    useEffect(()=>{
        navigationHistory.push(globalState.view)
        const popStateListener = function(){
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
        statePatcherRef.current({
            view: newView,
        })
        history.pushState({},  "")
        navigationHistory.push(newView)
    }, [])

    return main(
        {style: {
            paddingTop: globalState.bannerHeight || 0
        }},
        createElement(
            Globals.Provider,
            {
                value: {
                    state: globalState,
                    setState: updateGlobalState,
                    patchState: patchGlboalState,
                    setView
                }
            },
            globalState.view(),
            BannerBar(),
            SideBar(),
        )
    )
}

export default factory(App)