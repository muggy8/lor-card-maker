import { useEffect } from "/cdn/react"

export default function useEffectDebounce(callback, debounceDuration, watchers){
    useEffect(()=>{

        let timeoutId = setTimeout(()=>{
            timeoutId = undefined
            callback()
        }, debounceDuration)

        return function(){
            if (timeoutId){
                clearTimeout(timeoutId)
            }
        }
    }, watchers)
}