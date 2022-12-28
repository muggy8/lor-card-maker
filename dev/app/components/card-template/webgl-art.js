import { Application, Assets, Sprite } from '/cdn/pixi.js';
import { useRef, useEffect } from '/cdn/react';
import factory, { div } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import setImmediateBatch from "/Utils/set-immediate-batch.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import { getReplicateImage } from './image-render.js';

export function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function webglArtComponent (props){

    const replicatedArt = useAssetCache(updateCache=>{
        props.art && getReplicateImage(props.art).then(updateCache)
    }, [props.art])

    const wrapperRef = useRef()
    const [stage, artSprite] = useAssetCache(udpateCache=>{
        if (!replicatedArt){
            return
        }

        let pixiApp = stage 
        if (!pixiApp){
            pixiApp = new Application({ 
                width: wrapperRef.current.clientWidth,
                height: wrapperRef.current.clientWidth,
            })

            wrapperRef.current.appendChild(pixiApp.view)
        }

        const sprite = Sprite.from(replicatedArt.b64)
        pixiApp.stage.addChild(sprite)

        udpateCache([pixiApp, sprite])

        console.log(sprite, pixiApp)

        return ()=>{
            pixiApp.stage.removeChild(sprite)
        }

    }, [replicatedArt], [])

    useEffect(()=>{
        if (!artSprite || !props.transform){
            return
        }

        // image has already been replicated so we dont need to double it here
        const trueWidth = artSprite.width
        const trueHeight = artSprite.height
        const viewwidth = stage.stage.width
        const viewHeight = stage.stage.height
        const scale = props.transform.scale

        const maxHeightScale = viewHeight/trueHeight
        const maxWidthScale = viewwidth/trueWidth
        const maxScale = Math.max(maxHeightScale, maxWidthScale)

        const reneredScale = Math.max(scale, maxScale)
        console.log({
            reneredScale,
            trueWidth,
            trueHeight,
            viewwidth,
            viewHeight,
            scale,
            maxHeightScale,
            maxWidthScale,
            maxScale
        })
        
        // const [
        //     topLeftX, topLeftY,
        //     topRightX, topRightY,
        //     bottomRightX, bottomRightY,
        //     bottomLeftX, bottomLeftY,
        // ] = artSprite.calculateVertices() 

    }, [artSprite, (props.transform || {}).x, (props.transform || {}).y, (props.transform || {}).scale])

    return div({
        className: props.className + " art-wrapper",
        ref: wrapperRef,
    })
}

export default factory(webglArtComponent)