/**
 * 
 * @param {HTMLImageElement|SVGElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap|OffscreenCanvas|VideoFrame} image - anything that can be rendered in an OffscreenCanvas. The image to be trimmed.
 * 
 * @returns {OffscreenCanvas} A canvas that can contains the trimmed image.
 */
export default function trimTransparent(image){
    let canvas = new OffscreenCanvas(image.width, image.height),
        context = canvas.getContext("2d")
    
    context.drawImage(image, 0, 0, image.width, image.height)

    let pixels = context.getImageData(0, 0, canvas.width, canvas.height),
        dataLength = pixels.data.length,
        bound = {
            top: null,
            left: null,
            right: null,
            bottom: null
        }

    for (
        let i = 0, x = undefined, y = undefined; 
        i < dataLength; 
        i += 4
    ) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % canvas.width;
            y = ~~((i / 4) / canvas.width);

            if (bound.top === null) {
                bound.top = y;
            }

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }

    let trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = context.getImageData(bound.left, bound.top, trimWidth, trimHeight);

    canvas.width = trimWidth;
    canvas.height = trimHeight;
    context.clearRect(0, 0, trimWidth, trimHeight)
    context.putImageData(trimmed, 0, 0)

    return canvas
}