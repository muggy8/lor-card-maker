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

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

let replicationCache = {}
function getReplicateImage(url){
    if (replicationCache[url]){
        return replicationCache[url]
    }

    const replicationCalculationWorker = new Worker("/Components/card-template/image-render-worker.js");

    return replicationCache[url] = getDimensions(url)
        .then((results)=>{
            return new Promise((accept, reject)=>{
                const commaIndex = url.indexOf(",")
                const b64 = url.substring(commaIndex + 1)
                const dataType = url.substring(0, commaIndex)

                replicationCalculationWorker.onmessage = ev=>{
                    replicationCalculationWorker.terminate()
                    accept({...results, blob: ev.data})
                }
        
                replicationCalculationWorker.onerror = ev=>{
                    replicationCalculationWorker.terminate()
                    reject(ev)
                }
        
                const imgBlob = b64toBlob(b64, dataType.replace("data:", "").replace(";base64", ""))
                replicationCalculationWorker.postMessage({
                    ...results,
                    image: imgBlob,
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

    return div({
        className: "processed-art",
        style: {
            "--width": replicatedArt.width || 0,
            "--height": replicatedArt.height || 0,
            backgroundImage: replicatedArt.b64 ? `url(${replicatedArt.b64})` : "",
        }
    })
}

export default factory(ArtComponent, cssLoaded)