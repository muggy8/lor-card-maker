import React from "/cdn/react"

function factory(reactComponent, name){
    if (name){
        Object.defineProperty(reactComponent, "name", {
            value: name,
            enumerable: true,
        })
    }
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

        // console.log([reactComponent, props, ...children])

        return React.createElement.apply(React, [reactComponent, props, ...children])
    }
}

export default factory