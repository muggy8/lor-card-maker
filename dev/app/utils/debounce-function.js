export default function(callback, duration = 200){
    let timeoutId = undefined

    return function(...args){
        clearTimeout(timeoutId)
        timeoutId = setTimeout(function(){
            Function.prototype.apply.call(callback, undefined, args)
        }, duration)
    }
}