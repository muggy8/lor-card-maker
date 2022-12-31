import { Application, Assets, Sprite } from '/cdn/pixi.js';
import { useRef, useEffect } from '/cdn/react';
import factory, { div } from "/Utils/elements.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import { getReplicateImage } from './image-render.js';

export function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function webglArtComponent (props){

    const replicatedArt = useAssetCache(updateCache=>{
        props.art
            ? getReplicateImage(props.art).then(updateCache)
            : updateCache(undefined)
    }, [props.art])

    const pixiApp = useAssetCache(udpateCache=>{
        if (pixiApp){
            return
        }
        const app = new Application({
            width: wrapperRef.current.clientWidth,
            height: wrapperRef.current.clientHeight,
            forceCanvas: true,
        })

        wrapperRef.current.appendChild(app.view)

        udpateCache(app)

        return ()=>{
            app.destroy(true, true)
        }
    }, [])

    const wrapperRef = useRef()
    const artSprite = useAssetCache(udpateCache=>{
        if (!pixiApp || !replicatedArt || !replicatedArt.b64){
            return
        }
        const sprite = Sprite.from(replicatedArt.b64)
        pixiApp.stage.addChild(sprite)
        udpateCache(sprite)

        return ()=>{
            pixiApp.stage && pixiApp.stage.removeChild(sprite)
        }
    }, [pixiApp, replicatedArt && replicatedArt.b64])

    // update the sprite to our desired location
    useEffect(()=>{
        const artTransform = props.transform || {
            x: 0,
            y: 0,
            scale: 1,
        }
        if (!artSprite){
            return
        }

        // image has already been replicated so we dont need to double it here
        const spriteWidth = replicatedArt.width
        const spriteHeight = replicatedArt.height
        const viewWidth = wrapperRef.current.clientWidth
        const viewHeight = wrapperRef.current.clientHeight
        const tranformScale = artTransform.scale

        const minHeightScale = viewHeight/spriteHeight
        const minWidthScale = viewWidth/spriteWidth
        const minScale = Math.max(minHeightScale, minWidthScale)

        const renderingScale = Math.max(tranformScale, minScale)

        let needToUpdateTransforms = renderingScale !== tranformScale

        // positions are set up with their origin at the top left corner I think
        let newPositionX = ( (artTransform.x * 2) * renderingScale )
        if (newPositionX > 0){
            newPositionX = 0
            needToUpdateTransforms = true
        }
		let newPositionY = ( (artTransform.y * 2) * renderingScale )
        if (newPositionY > 0){
            newPositionY = 0
            needToUpdateTransforms = true
        }

        const newWidth = spriteWidth * renderingScale
        const newHeight = spriteHeight * renderingScale
        const newRightBoundry = newWidth + newPositionX
        if (newRightBoundry < viewWidth){ // if the right edge of the art wont cover the art area, then move the art over to cover the right edge
            newPositionX += (viewWidth - newRightBoundry)
            needToUpdateTransforms = true
        }
		const newBottomBoundry = newHeight + newPositionY
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

        // console.log({
        //     minHeightScale,
        //     viewHeight,
        //     spriteHeight,

        //     minWidthScale,
        //     viewWidth,
        //     spriteWidth,

        //     minScale,
        //     renderingScale,
        //     artSprite,

		// 	newWidth,
		// 	newHeight,
        //     newPositionX,
        //     newPositionY,
        //     artTransform,
        // })
    }, [artSprite, (props.transform || {}).x, (props.transform || {}).y, (props.transform || {}).scale])

    return div({
        className: props.className + " art-wrapper",
        style: props.style,
        ref: wrapperRef,
    })
}

export default factory(webglArtComponent)
