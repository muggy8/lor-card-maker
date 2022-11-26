export default function concurrencyManagerFactory(){
    let runningProcesses = []
    let waiting = []

    const manager =  {
        concurrent: function(callback, ...args){
            const promise = callback(...args)
            // console.log(promise)
            if (!promise || !promise.then){
                processComplete()
                return
            }
            runningProcesses.push(promise.then(processComplete, processComplete))

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
