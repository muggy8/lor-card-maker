import factory, { div, label, input, button } from "/Utils/elements.js";
import { useEffect, useCallback } from "/cdn/react";

function searchTextComponent(props){
    const onChange = useCallback(ev=>{
        props.onChange(ev.target.value)
    }, [props.onChange])
    
    return label({ className: "filter-option gutter-b-.5" }, 
        div({ className: "gutter-b-.5" }, props.label),
        div({ className: "flex gutter-rl-.5" },
            input({ className: "grow gutter-trbl-.5", type: "search", value: props.value || "", onChange }),
            div({ className: "gutter-r-.5" }),
            button({ className: "grow gutter-trbl-.5", onClick: ()=>props.onChange(undefined) }, 
                div({ className: "icon" },
                    div({ className: "delete" }),
                )
            )
        ),
    )
}

export default factory(searchTextComponent)