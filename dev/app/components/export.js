import saveSvgAsPng from "/cdn/save-svg-as-png"
import { openUri } from "/Views/card-editor.js"

export default async function(card, svgRef, globalState){
    const width = svgRef.width.baseVal.value,
        height= svgRef.height.baseVal.value
    if (globalState.state.settings.exportFormat === "json"){
        // just dump out the value
        const json = JSON.stringify(card, null, "\t")
        const jsonBlob = stringToBlob(json)
        const b64 = await new Promise(accept=>{
            var reader = new FileReader();
            reader.readAsDataURL(jsonBlob); 
            reader.onloadend = function() {
                accept(reader.result);       
            }
        })        
        return openUri(b64, `${(card.fileName || card.name || "export").toUpperCase()}.json`)
    }
    else if (globalState.state.settings.exportFormat === "svg") {
        const uri = await saveSvgAsPng.svgAsDataUri(svgRef, {
            excludeUnusedCss: true,
            width,
            height,
        })
        return openUri(uri, `${(card.fileName || card.name || "export").toUpperCase()}.svg`)
    }
    else {
        // convert the value to the right format
        const uri = await saveSvgAsPng.svgAsPngUri(svgRef, {
            excludeUnusedCss: true,
            width,
            height,
            encoderType: `image/${globalState.state.settings.exportFormat}`,
            excludeUnusedCss: true,
        })

        console.log("uri created")
        
        return openUri(uri, `${(card.fileName || card.name || "export").toUpperCase()}.${globalState.state.settings.exportFormat}`)
    }
}

export function stringToBlob(str){
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
        type: "application/json;charset=utf-8"
    });

    return blob
}