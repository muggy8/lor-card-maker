async function calculateReplication(imageConfig){
    //~ const width = imageConfig.width, height = imageConfig.height

    const { image, width, height } = imageConfig

    const canvas = new OffscreenCanvas(width * 3, height * 3);
    const context = canvas.getContext("2d")


    // images needs to be replicatd into a 3 x 3 grid and is labled below
    //
    // | A | B | C |
    // | I | J | K |
    // | X | Y | Z |
    //
    // A, C, X, and Z, use the same transforms (no transform)
    // I and K use the same transforms (mirror on X axis)
    // B and Y use the same transforms (mirror on Y axis)
    // J uses a unique tranform (mirror on X and Y axis)

    context.clearRect(0,0,canvas.width,canvas.height)
    // draw image A, C, X, and Z with no transforms
    context.drawImage(
        image,
        0, 0, width, height, // location of source
        0, 0, width, height, // location to render
    )

    context.drawImage(
        image,
        0, 0, width, height, // location of source
        width * 2, 0, width, height, // location to render
    )

    context.drawImage(
        image,
        0, 0, width, height, // location of source
        0, height * 2, width, height, // location to render
    )

    context.drawImage(
        image,
        0, 0, width, height, // location of source
        width * 2, height * 2, width, height, // location to render
    )

    // draw image B and Y with X axis mirror
    context.scale(-1, 1)
    context.drawImage(
        image,
        0, 0, width, height, // location of source
        -width * 2, 0, width, height, // location to render
    )

    context.drawImage(
        image,
        0, 0, width, height, // location of source
        -width * 2, height * 2, width, height, // location to render
    )

    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix

    // draw image I and K with Y axis mirror
    context.scale(1, -1)
    context.drawImage(
        image,
        0, 0, width, height, // location of source
        0, -height * 2, width, height, // location to render
    )

    context.drawImage(
        image,
        0, 0, width, height, // location of source
        width * 2, -height * 2, width, height, // location to render
    )

    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix

    // draw image J with X and Y axis mirror
    context.scale(-1, -1)
    context.drawImage(
        image,
        0, 0, width, height, // location of source
        -width * 2, -height * 2, width, height, // location to render
    )
    context.setTransform(1, 0, 0, 1, 0, 0) // Reset current transformation matrix to the identity matrix

    return canvas.convertToBlob({
        type: "image/png",
        quality: 1,
    })
}

onmessage = (ev)=>{
    calculateReplication(ev.data)
		.then(postMessage, err=>{
			setTimeout(function(){
				throw err
			}, 250)
		})
}
