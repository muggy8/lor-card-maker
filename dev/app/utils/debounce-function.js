export default function(callback, duration = 200){
    const tracker = {
        asyncTask: undefined
    }

    let id = undefined
    Object.defineProperty(tracker, "timeout", {
        get: function(){
            return id
        },
        set: function(val){
            clearTimeout(id)
            id = val
        },
        enumerable: true,
        configurable: false,
    })

    return function(...args){
        if (tracker.asyncTask){
            return
        }

        tracker.timeout = setTimeout(function(){
            // timeoutTracker.timeout = undefined
            const task = Function.prototype.apply.call(callback, undefined, args)

            if (task instanceof Promise){
                tracker.asyncTask = task
                task.then(()=>{
                    tracker.asyncTask = undefined
                })
            }
        }, duration)
    }
}