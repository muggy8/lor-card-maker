export default function concurrencyManagerFactory(){
    let runningProcesses = []
    let waiting = []

    const manager =  {
        concurrent: function(callback, ...args){
            const promise = callback(...args)
            if (!promise instanceof Promise){
                processComplete()
                return
            }
            promise.then(processComplete, processComplete)
            runningProcesses.push(promise)

            function processComplete(){
                const jobIndex = runningProcesses.findIndex(running => running === promise)
                runningProcesses.splice(jobIndex, 1)

                if (runningProcesses.length === 0){
                    const todo = waiting.shift()
                    todo && manager.concurrent(todo.callback, ...todo.args)
                }
            }
        },
        sequential: function(callback, ...args){
            if (!runningProcesses.length){
                manager.concurrent(callback, ...args)
            }
            else{
                waiting.push({callback, args})
            }
        },
    }

    return manager
}
