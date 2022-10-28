import { useContext, useRef, useEffect } from "/cdn/react"
import factory, { svg, rect, foreignObject } from "/Utils/elements.js"
import { svgRefference } from "/Views/card-editor.js"
import Gesto from "/cdn/gesto"
// import load from "/Utils/load-js.js"

// const jsTask = load("https://unpkg.com/gesto@1.13.3/dist/gesto.min.js")

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

        const element = gestureReceiver.current

        element.addEventListener("wheel", onWheel)

        const gestureWatcher = new Gesto(element, {
            container: svgRef.current,
            // preventClickEventOnDrag: true,
            // preventClickEventOnDragStart: true,
            pinchOutside: true,
            // preventDefault: true,
        })
        .on("drag", (ev)=>{
            lastStoppedPosition.current.x += ev.deltaX * (1 / lastStoppedPosition.current.scale)
            lastStoppedPosition.current.y += ev.deltaY * (1 / lastStoppedPosition.current.scale)
            transformCallback.current({...lastStoppedPosition.current})
        })
        .on("pinch", (ev)=>{
            lastStoppedPosition.current.scale = lastStoppedPosition.current.scale * ev.scale 
            transformCallback.current({...lastStoppedPosition.current})
        })

        transformCallback.current({...lastStoppedPosition.current})

        return function(){
            element.removeEventListener("wheel", onWheel)
            gestureWatcher.unset();
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