const cache = {}

export default async function datauri(url){
    if (cache[url]){
        return cache[url]
    }

    return fetch(url)
        .then(res=>res.blob())
        .then(blob=>{
            const reader = new FileReader()
            return new Promise(accept=>{
                reader.addEventListener("load", () => {
                    cache[url] = reader.result
                    accept(reader.result)
                }, false)
                reader.readAsDataURL(blob)
            })
        })
}