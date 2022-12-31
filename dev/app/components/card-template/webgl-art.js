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
        const spriteWidth = artSprite.width
        const spriteHeight = artSprite.height
        const viewWidth = wrapperRef.current.clientWidth
        const viewHeight = wrapperRef.current.clientHeight
        const tranformScale = props.transform.scale

        const minHeightScale = viewHeight/spriteHeight
        const minWidthScale = viewWidth/spriteWidth
        const minScale = Math.max(minHeightScale, minWidthScale)

        const renderingScale = Math.max(tranformScale, minScale)

        let needToUpdateTransforms = renderingScale !== tranformScale
        
        // positions are set up with their origin at the top left corner I think
        let newPositionX = (props.transform.x * 2) * renderingScale
        let newPositionY = (props.transform.y * 2) * renderingScale
        if (newPositionX > 0){
            newPositionX = 0
            needToUpdateTransforms = true
        }
        if (newPositionY > 0){
            newPositionY = 0
            needToUpdateTransforms = true
        }

        const newWidth = spriteWidth * renderingScale
        const newHeight = spriteHeight * renderingScale
        let newRightBoundry = newWidth + newPositionX
        let newBottomBoundry = newHeight + newPositionY
        if (newRightBoundry < viewWidth){ // if the right edge of the art wont cover the art area, then move the art over to cover the right edge
            newPositionX += (viewWidth - newRightBoundry)
            needToUpdateTransforms = true
        }
        if (newBottomBoundry < viewHeight){ // if the bottom edge of the art wont cover the art area, then move the art over to cover the bottom edge
            newPositionY += (viewHeight - newBottomBoundry)
            needToUpdateTransforms = true
        }
        
        artSprite.x = newPositionX
        artSprite.y = newPositionY
        artSprite.scale.x = artSprite.scale.y = renderingScale

        if (needToUpdateTransforms){
            props.updateTransform && props.updateTransform({
                scale: renderingScale,
                x: (newPositionX / renderingScale) / 2,
                y: (newPositionY / renderingScale) / 2,
            })
        }

    }, [artSprite, (props.transform || {}).x, (props.transform || {}).y, (props.transform || {}).scale])

    return div({
        className: props.className + " art-wrapper",
        ref: wrapperRef,
    })
}

export default factory(webglArtComponent)