import { useState, useCallback, createContext } from "/cdn/react" 
import factory, { main } from "/Utils/elements.js"
import List from "/Views/list.js"
import {BannerBar, SideBar} from "/Components/index.js"

export const Globals = createContext({
    lang: "en",
    card: null,
})

const GlobalsContext = factory(Globals.Provider)

function App () {

    const [globalState, updateGlobalState] = useState({
        lang: "en",
        card: null,
        view: List,
    })

    const patchGlboalState = useCallback((newState)=>{
        let mergedState = {
            ...globalState,
            ...newState,
        }

        Object.keys(mergedState).forEach(key=>{
            if (typeof mergedState[key] === "undefined"){
                delete mergedState[key]
            }
        })

        updateGlobalState(mergedState)
    }, [globalState, updateGlobalState])

    const setView = useCallback((newView)=>{
        patchGlboalState({
            view: newView,
        })
    }, [patchGlboalState])

    return main(
        GlobalsContext(
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