import "/cdn/setimmediate"

const queuesByType = []
function getUqueByType (type){
    return queuesByType.find((queue)=>{
        return queue.type === type
    })
}

function resolveQueue(queueToResolve){
    const queueToRun = queueToResolve.callbackQueue
    queueToResolve.callbackQueue = []
    queueToResolve.set = false

    queueToRun.forEach(({callback, args}) => {
        Function.prototype.apply.call(callback, window, args)
    });
}

export default function (callback, method=setImmediate){
    let methodQueue = getUqueByType(method) 
    
    if (!methodQueue){
        methodQueue = {
            type: method,
            set: false,
            callbackQueue: [],
        }
        queuesByType.push(methodQueue)
    }

    const {callbackQueue} = methodQueue

    if (!methodQueue.set){
        methodQueue.set = true
        method(()=>{
            resolveQueue(methodQueue)
        })
    }     

    const args = Array.prototype.slice.call(arguments, 1)
    callbackQueue.push({
        callback, 
        args,
    })
}