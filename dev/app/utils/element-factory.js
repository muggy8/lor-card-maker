import React from "/cdn/react"

function factory(reactComponent){
    return function(l){
        let params = arguments 
        let propsOrChildren = params[0]
        let props = null
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

        return React.createElement.apply(React, [reactComponent, props, ...children])
    }
}

export default factory