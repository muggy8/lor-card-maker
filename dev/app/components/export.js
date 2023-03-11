import saveSvgAsPng from "/cdn/save-svg-as-png"
import { openUri } from "/Views/card-editor.js"

export default async function(card, svgRef, globalState){
    const width = svgRef.width.baseVal.value,
        height= svgRef.height.baseVal.value
    if (globalState.state.settings.exportFormat === "json"){
        // just dump out the value
        return openUri(`data:application/json;base64,${btoa(JSON.stringify(card, null, "\t"))}`, `${(card.name || "export").toUpperCase()}.json`)
    }
    else if (globalState.state.settings.exportFormat === "svg") {
        const uri = await saveSvgAsPng.svgAsDataUri(svgRef, {
            excludeUnusedCss: true,
            width,
            height,
        })
        openUri(uri, `${(card.name || "export").toUpperCase()}.svg}`)
    }
    else {
        // convert the value to the right format
        const uri = await saveSvgAsPng.svgAsPngUri(svgRef, {
            excludeUnusedCss: true,
            width,
            height,
        })

        if (globalState.state.settings.exportFormat === "png"){
            return  openUri(uri, `${(card.name || "export").toUpperCase()}.png}`)
        }

        const offscreen = new OffscreenCanvas(width, height);
        const context = offscreen.getContext("2d")
        const bitmap = await new Promise(accept=>{
            const img = new Image(width, height)
            img.onload = ()=>accept(img)
            img.src = uri
        })

        context.drawImage(bitmap, 0, 0)
        const imgBlob = await offscreen.convertToBlob({
            type: `image/${globalState.state.settings.exportFormat}`,
            quality: 0.8,
        })

        var reader = new FileReader();
        reader.readAsDataURL(imgBlob); 
        reader.onloadend = function() {
            var base64data = reader.result;                
            openUri(base64data, `${(card.name || "export").toUpperCase()}.${globalState.state.settings.exportFormat}}`)
        }
    }
}