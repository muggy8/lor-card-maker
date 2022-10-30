import React, {useEffect, useState} from "/cdn/react"

const debugRender = true

function factory(reactComponent, awaitThis){
    return function(){
        let params = arguments 
        let propsOrChildren = params[0]
        let props = {}
        let children = Array.prototype.slice.call(params, 1)

        if (
            React.isValidElement(propsOrChildren) || 
            typeof propsOrChildren !== "object" || 
            Array.isArray(propsOrChildren)
        ){
            children = Array.prototype.slice.call(params, 0)
        }
        else{
            props = propsOrChildren
        }
        if (awaitThis){
            return React.createElement(DeferRenderComponent, {
                component: reactComponent,
                componentProps: props,
                componentChildren: children,
                waitFor: awaitThis,
            })
        }

        if (debugRender && typeof reactComponent !== "string" ){
            console.log("Rendering", reactComponent.name)
        }
        return React.createElement.apply(React, [reactComponent, props, ...children])
    }
}

function DeferRenderComponent(props){
    const [waitDone, updateWaitDone] = useState(false)
    useEffect(()=>{
        props.waitFor.then(()=>updateWaitDone(true))
    }, [])

    if (!waitDone){
        return null
    }

    const { component, componentProps, componentChildren } = props

    if (debugRender && typeof component !== "string" ){
        console.log("Rendering", component.name)
    }
    return React.createElement.apply(React, [component, componentProps, ...componentChildren])
}

export const DeferRender = factory(DeferRenderComponent)

export default factory