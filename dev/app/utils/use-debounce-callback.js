import { useCallback, useRef } from "/cdn/react"

export default function useCallbackDebounce(callback, duration, watched){
    const currentCallback = useRef(callback)
    currentCallback.current = callback

    const currentTimeoutId = useRef()

    const trueMethod = useCallback(function (...args){
        clearTimeout(currentTimeoutId.current)
        currentTimeoutId.current = setTimeout(function(){
            Function.prototype.apply.call(currentCallback.current, undefined, args)
        }, duration)
    }, watched)

    return trueMethod
}