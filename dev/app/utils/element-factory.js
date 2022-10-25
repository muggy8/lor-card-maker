import React, {useEffect, useState} from "/cdn/react"

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
            return DeferRender({
                component: reactComponent,
                componentProps: props,
                componentChildren: children,
                waitFor: awaitThis,
            })
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
    return React.createElement.apply(React, [component, componentProps, ...componentChildren])
}

export const DeferRender = factory(DeferRenderComponent)

export default factory