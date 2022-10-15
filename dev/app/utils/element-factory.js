import React from "/cdn/react"

function factory(reactComponent){
    return function(l){
        let params = arguments 
        let propsOrChildren = params[0]
        let props = null
        let children = Array.prototype.slice.call(params, 1)

        if (React.isValidElement(propsOrChildren) || typeof propsOrChildren !== "object"){
            children =  Array.prototype.slice.call(params, 0)
        }
        else if (Array.isArray(propsOrChildren)){
            if (params.length === 1){
                children = propsOrChildren 
            }
            else{
                children = [...propsOrChildren, ...children]
            }
        }
        else{
            props = propsOrChildren
        }

        if (children.length === 1){
            children = children[0]
        }
        else if (children.length === 0){
            children = null
        }
        return React.createElement(reactComponent, props, children)
    }
}

export default factory