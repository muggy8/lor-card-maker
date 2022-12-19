import factory, { div } from "/Utils/elements.js";

function checkboxComponent(props){

    function toggle(value){
        if (Array.isArray(props.value) || Object.hasOwnProperty.call(props.value || {}, "length") ){
            if (Array.prototype.includes.call(props.value || [], value)){
                props.onChange(
                    Array.prototype.filter.call(
                        props.value, 
                        option=>option !== value
                    )
                )
            }
            else {
                props.onChange([
                    ...(props.value || []),
                    value,
                ])
            }
        }
        else {
            if (props.value === value){
                props.onChange( null )
            }
            else {
                props.onChange( value )
            }
        }
    }
    
    return div({ className: "filter-checkbox gutter-b-.5" }, 
        div({ className: "gutter-b-.5" }, props.label),
        div({ className: "flex gutter-rl-.5" },
            Array.prototype.map.call(props.options || [], option=>{
                const value = props.optionValue 
                    ? props.optionValue(option) 
                    : option
                let checked = false
                if (props.value && (Array.isArray(props.value) || Object.hasOwnProperty.call(props.value, "length"))){
                    checked = Array.prototype.includes.call(props.value, value)
                }
                else{
                    checked = props.value === value
                }

                const renderedOption = props.renderOption(option, checked)

                if (!renderedOption){
                    return undefined
                }

                return div(
                    { 
                        className: `grow ${checked ? "checked" : "ghost" }`, 
                        onClick: ()=>toggle(value), 
                        key: value,
                    },
                    renderedOption
                )
            })
        ),
    )
}

export default factory(checkboxComponent)