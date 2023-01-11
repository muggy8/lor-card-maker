import factory, { div } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import setImmediateBatch from "/Utils/set-immediate-batch.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import { useEffect } from "/cdn/react"

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

function asyncWait (ms = 0){
    if (!ms){
        return new Promise(accept=>{
            setImmediateBatch(accept)
        })
    }

    return new Promise(accept=>{
        setTimeout(accept, ms)
    })
}
async function replicateArtFallback({ image, width, height }){
    const canvas = document.createElement('canvas');

    canvas.width = width * 2
    canvas.height = height * 2

    const context = canvas.getContext("2d")

    typeof context.mozImageSmoothingEnabled !== "undefined" && (context.mozImageSmoothingEnabled = false)
    typeof context.oImageSmoothingEnabled !== "undefined" && (context.oImageSmoothingEnabled = false)
    typeof CanvasRenderingContext2D.webkitImageSmoothingEnabled !== "undefined" && (CanvasRenderingContext2D.webkitImageSmoothingEnabled = false)
    typeof context.imageSmoothingEnabled !== "undefined" && (context.imageSmoothingEnabled = false)
    context.clearRect(0,0,canvas.width,canvas.height)

    // Since this function will be running on the main thread, it would be best to avoid blocking the main thread for too long. hence, we stop the execution of this function every now and then so the main thread can go handle other things.

    // draw the initial image that's the right way around
    await asyncWait()
    context.drawImage(
        image,
        0, 0, width, height, // location of source
        0, 0, width, height, // location to render
    )

    // draw the mirrored image to the right
    await asyncWait(50)
    context.scale(-1, 1)
    await asyncWait()
    context.drawImage(
        image,
        0, 0, width, height, // location of source
        -canvas.width, 0, width, height, // location to render
    )
    await asyncWait()
    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix

    // draw the mirrored image to the bottom
    await asyncWait(50)
    context.scale(1, -1)
    await asyncWait()
    context.drawImage(
        image,
        0, 0, width, height, // location of source
        0, -canvas.height, width, height, // location to render
    )
    await asyncWait()
    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix

    // draw the mirrored image to the bottom
    await asyncWait(50)
    context.scale(-1, -1)
    await asyncWait()
    context.drawImage(
        image,
        0, 0, width, height, // location of source
        -canvas.width, -canvas.height, width, height, // location to render
    )
    await asyncWait()
    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix

    await asyncWait()

    return new Promise(accept=>{
        canvas.toBlob(accept)
    })

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
        .then(async results=>{
			const assetBlob = await fetch(url).then(res=>res.blob())
			const assetBitmap = await createImageBitmap(assetBlob)
            const blob = await new Promise((accept, reject)=>{
                replicationCalculationWorker.onmessage = ev=>{
                    replicationCalculationWorker.terminate()
                    accept(ev.data)
                }

                replicationCalculationWorker.onerror = ev=>{
                    replicationCalculationWorker.terminate()
                    console.warn(ev)
                    replicateArtFallback({
                        width: results.width,
                        height: results.height,
                        image: assetBitmap
                    })
                        .then(accept, reject)
                }

                replicationCalculationWorker.postMessage({
                    width: results.width,
                    height: results.height,
                    image: assetBitmap,
                })
            })
            const b64 = await blobToBase64(blob)

            return {
                width: results.width,
                height: results.height,
                b64,
            }
        })

}

function ArtComponent(props){
    const { url } = props

    const replicatedArt = useAssetCache(updateReplicatedArt=>{
        url && getReplicateImage(url).then(updateReplicatedArt)
    }, [url], {})

    useEffect(()=>{
		replicatedArt.b64 && props.onImageChanged && props.onImageChanged()
	}, [props.onImageChanged, replicatedArt])

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
            ? div({ className: "icon loading" })
            : undefined
    )
}

export default factory(ArtComponent, cssLoaded)
