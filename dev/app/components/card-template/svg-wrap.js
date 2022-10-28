import { useContext, useRef, useEffect } from "/cdn/react"
import factory, { svg, rect, foreignObject } from "/Utils/elements.js"
import { svgRefference } from "/Views/card-editor.js"
import Hammer from "/cdn/hammerjs"

function SvgWrapComponent(props){
    const svgRef = useContext(svgRefference)

    const gestureReceiver = useRef()

    const lastStoppedPosition = useRef({x: props.x || 0, y: props.y || 0, scale: props.scale || 0})

    const transformCallback = useRef()
    transformCallback.current = props.onTransform

    useEffect(()=>{
        if (!props.onTransform){
            return
        }

        const mc = new Hammer.Manager(gestureReceiver.current)

        const pinch = new Hammer.Pinch()

        const pan = new Hammer.Pan()
        pan.set({ direction: Hammer.DIRECTION_ALL })

        pan.recognizeWith(pinch);

        mc.add([pan, pinch])

        let previousEvent
        
        mc.on("pan", ev=>{
            ev.preventDefault()
            let dx = ev.deltaX
            let dy = ev.deltaY
            if (previousEvent){
                dx -= previousEvent.deltaX
                dy -= previousEvent.deltaY
            }
            previousEvent = ev
            lastStoppedPosition.current.x += (dx * (1/lastStoppedPosition.current.scale))
            lastStoppedPosition.current.y += (dy * (1/lastStoppedPosition.current.scale))
            transformCallback.current({...lastStoppedPosition.current})

            if (ev.isFinal){
                previousEvent = undefined
            }
        })
        mc.on("pinch", ev=>{
            ev.preventDefault()
            let dScale = ev.scale

            console.log(ev)

            if (previousEvent){
                dScale = dscale / previousEvent.scale
            }
            previousEvent = ev

            lastStoppedPosition.current.scale = lastStoppedPosition.current.scale * (1 + dScale)
            transformCallback.current({...lastStoppedPosition.current})

            if (ev.isFinal){
                previousEvent = undefined
            }
        })

        const element = gestureReceiver.current

        element.addEventListener("wheel", onWheel)

        transformCallback.current({...lastStoppedPosition.current})

        return function(){
            mc.remove([pan, pinch, 'pinch pan'])
            mc.destroy()
            element.removeEventListener("wheel", onWheel)
        }

        function onWheel(ev){
            ev.preventDefault()

            lastStoppedPosition.current.scale = lastStoppedPosition.current.scale * (1 + (ev.deltaY / 1000))
            transformCallback.current({...lastStoppedPosition.current})
        }
    }, [!!props.onTransform])

    return svg(
        {
            width: props.width || "680",
            height: props.height || "1024",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: `0 0 ${ props.width || "680" } ${ props.height || "1024" }`,
            ref: (current)=>{
                current && current !== svgRef.current && svgRef.setRef(current)
            },
        },
        foreignObject(
            {
                width: "680",
                height: "1024",
                style: {
                    backgroundColor: "rgba(0,0,0,0)",
                },
            },
            props.children
        ),
        rect({
            x: 0,
            y: 0,
            width: props.width || "680",
            height: props.height || "1024",
            opacity: 0,
            ref: gestureReceiver,
            style: {
                touchAction: "manipulation"
            }
        })
    )
}

export default factory(SvgWrapComponent)