import factory, { div } from "/Utils/elements.js"
import { useEffect, useState } from "/cdn/react"
import loadCss from "/Utils/load-css.js"

const cssLoaded = loadCss("/Components/card-template/image-render.css")

function getDimensions(url){
    return new Promise(accept=>{
        const imageLoader = new Image();

        imageLoader.addEventListener("load", ()=>{
            accept({
                width: imageLoader.width,
                height: imageLoader.height,
                image: imageLoader,
            })
        })

        imageLoader.src = url;
    })
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

let replicationCache = {}
const workerContentsPromise = fetch("/Components/card-template/image-render-worker.js").then(res=>res.text())
function getReplicateImage(url){
    if (replicationCache[url]){
        return replicationCache[url]
    }

    let replicationCalculationWorker

    return replicationCache[url] = workerContentsPromise.then(codeText=>{
			// we do this weird shit because some browsers (looking at you Safari) somehow doesn't hit the service worker when getting the code for the worker so it ends up with a 404.
			const codeB64 = `data:text/javascript;base64,${btoa(codeText)}`
			replicationCalculationWorker = new Worker(codeB64)
		})
		.then(()=>getDimensions(url))
        .then(async (results)=>{
			const assetBlob = await fetch(url).then(res=>res.blob())
			const assetBitmap = await createImageBitmap(assetBlob)
            return new Promise((accept, reject)=>{
                //~ const commaIndex = url.indexOf(",")
                //~ const b64 = url.substring(commaIndex + 1)
                //~ const dataType = url.substring(0, commaIndex)

                replicationCalculationWorker.onmessage = ev=>{
                    replicationCalculationWorker.terminate()
                    accept({...results, blob: ev.data})
                }

                replicationCalculationWorker.onerror = ev=>{
                    replicationCalculationWorker.terminate()
                    accept({...results, blob: assetBlob})
                }

                replicationCalculationWorker.postMessage({
                    ...results,
                    image: assetBitmap,
                    b64: url,
                })
            })
        })
        .then(async rawTransform=>{
            rawTransform.b64 = await blobToBase64(rawTransform.blob)
            return rawTransform
        })

}

function ArtComponent(props){
    const { url } = props

    const [replicatedArt, updateReplicatedArt] = useState({})
    useEffect(()=>{
        if (!url){
            return
        }

        getReplicateImage(url).then(updateReplicatedArt)
    }, [url])

    return div(
        {
            className: `processed-art ${url && !replicatedArt.b64 ? "loading" : "" }`,
            style: {
                "--width": replicatedArt.width || 0,
                "--height": replicatedArt.height || 0,
                backgroundImage: replicatedArt.b64 ? `url(${replicatedArt.b64})` : "",
            },
        },
        url && !replicatedArt.b64
            ? div({ className: "icon" },
                div({ className: "loading" })
            )
            : undefined
    )
}

export default factory(ArtComponent, cssLoaded)
