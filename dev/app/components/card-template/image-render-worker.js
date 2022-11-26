

async function calculateReplication(imageConfig){
    //{ width, height, image }
    const width = imageConfig.width, height = imageConfig.height
    const image = await createImageBitmap(imageConfig.image)

    const canvas = new OffscreenCanvas(width * 2, height * 2);
    const context = canvas.getContext("2d")

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

    return canvas.convertToBlob({
        type: "image/png",
        quality: 1,
    })
}

onmessage = (ev)=>{
    calculateReplication(ev.data).then(postMessage)
}