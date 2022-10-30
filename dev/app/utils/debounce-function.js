export default function(callback, duration = 200){
    let timeoutId

    return function(...args){
        if (typeof timeoutId !== "undefined"){
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(function(){
            timeoutId = undefined
            Function.prototype.apply.call(callback, undefined, args)
        }, duration)
    }
}