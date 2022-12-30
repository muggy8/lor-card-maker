import setImmediateBatch from "./set-immediate-batch.js"
import { Component } from "/cdn/react" 

function performPatch(unpatchedStates){
    this.setState(unpatchedStates)
}

export default class UtilityComponent extends Component{

    createEffect(callback, getDiffers = ()=>{}){
        const context = this
        let watchers
        let unloadCallback
        if (typeof callback !== "function"){
            throw new Error("callback not provided")
        }

        effect.unload = ()=>{}

        return function effect(...args){
            if (!watchers){
                watchers = getDiffers()
                unloadCallback = callback.apply(context, args)
            }
            else{
                const newWatchers = getDiffers()
                const watcherIsArray = Array.isArray(newWatchers)
                if (newWatchers && !watcherIsArray){
                    throw new Error("Watchers must be an array or undefined")
                }

                if (Array.isArray(newWatchers) && newWatchers.reduce((isCurrentlyAllSame, currentEle, index)=>{
                    return isCurrentlyAllSame && currentEle === watchers[index]
                }, true)){
                    return
                }
                
                unloadCallback && unloadCallback()
                watchers = newWatchers
                unloadCallback = callback.apply(context, args)
            }

            effect.unload = unloadCallback || effect.unload
        }
    }

    _unpatchedStates = {}
    _timmerSet = false
    patchState(newState){
        const context = this
        let mergedState = this._unpatchedStates = {
            ...this._unpatchedStates,
            newState
        }

        Object.keys(mergedState).forEach(key=>{
            if (typeof mergedState[key] === "undefined"){
                delete mergedState[key]
            }
        })

        if (this._timmerSet){
            return
        }
        this._timmerSet = true
        setImmediateBatch(()=>{
            context._timmerSet = false
            performPatch.call(context, context._unpatchedStates)
            context._unpatchedStates = {}
        })
    }
}