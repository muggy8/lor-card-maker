import useAssetCache from "./use-asset-cache.js"
import React, { createElement } from "/cdn/react"

const debugRender = false

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
            let deferRenderProps = {
                component: reactComponent,
                componentProps: props,
                componentChildren: children,
                waitFor: awaitThis,
            }

            if (typeof props.key !== "undefined"){
                deferRenderProps.key = props.key
                delete props.key
            }

            return createElement(DeferRenderComponent, deferRenderProps)
        }

        if (debugRender && typeof reactComponent !== "string" ){
            console.log("Rendering", reactComponent.name)
        }
        return createElement(reactComponent, props, ...[children].flat())
    }
}

function DeferRenderComponent(props){
    const waitDone = useAssetCache(updateWaitDone=>{
        props.waitFor.then(()=>updateWaitDone(true))
    }, [], false)

    if (!waitDone){
        return null
    }

    const { component, componentProps, componentChildren } = props

    if (debugRender && typeof component !== "string" ){
        console.log("Rendering", component.name)
    }
    return createElement(component, componentProps, ...[componentChildren].flat())
}

export const DeferRender = factory(DeferRenderComponent)

export default factory