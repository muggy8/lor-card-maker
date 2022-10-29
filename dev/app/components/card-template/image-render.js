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

let replicationCache = {}
async function getReplicateImage(url){
    if (replicationCache[url]){
        return replicationCache[url]
    }

    const { width, height, image } = await getDimensions(url)
    const canvas = document.createElement('canvas');

    canvas.width = width * 2
    canvas.height = height * 2

    const context = canvas.getContext("2d")

    typeof context.imageSmoothingEnabled !== "undefined" && (context.imageSmoothingEnabled = false)
    typeof context.mozImageSmoothingEnabled !== "undefined" && (context.mozImageSmoothingEnabled = false)
    typeof context.oImageSmoothingEnabled !== "undefined" && (context.oImageSmoothingEnabled = false)
    typeof CanvasRenderingContext2D.webkitImageSmoothingEnabled !== "undefined" && (CanvasRenderingContext2D.webkitImageSmoothingEnabled = false)
    context.clearRect(0,0,canvas.width,canvas.height)

    // draw the initial image that's the right way around
    context.drawImage(
        image, 
        0, 0, width, height, // location of source
        0, 0, width, height, // location to render
    )

    // draw the mirrored image to the right
    context.scale(-1, 1)
    context.drawImage(
        image, 
        0, 0, width, height, // location of source
        -canvas.width, 0, width, height, // location to render
    )
    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix



    // draw the mirrored image to the bottom
    context.scale(1, -1)
    context.drawImage(
        image, 
        0, 0, width, height, // location of source
        0, -canvas.height, width, height, // location to render
    )
    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix


    // draw the mirrored image to the bottom
    context.scale(-1, -1)
    context.drawImage(
        image, 
        0, 0, width, height, // location of source
        -canvas.width, -canvas.height, width, height, // location to render
    )
    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix

    return replicationCache[url] = {
        width: canvas.width, 
        height: canvas.height,
        b64: canvas.toDataURL()
    }

    // let data = canvas.toDataURL();
    // let w = window.open('about:blank');
    // let i = new Image();
    // i.src = data;
    // setTimeout(function(){
    // w.document.write(i.outerHTML);
    // }, 0);
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
            backgroundImage: `url(${replicatedArt.b64})` || "",
        }
    })
}

export default factory(ArtComponent, cssLoaded)