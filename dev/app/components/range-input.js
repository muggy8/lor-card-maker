import factory, { div, range } from "/Utils/elements.js";
import { getTrackBackground } from "/cdn/react-range"
import { useMemo, useCallback } from "/cdn/react"

function getColorSplit(currentValue){
    if (currentValue.length === 1) {
        return [ "var(--color-primary)", "var(--color-light)"]
    }    
    
    const colorSplit = ["var(--color-light)"]
    for(let i = 0; i < currentValue.length - 1; i++){
        colorSplit.push("var(--color-primary)")
    }
    colorSplit.push("var(--color-light)")

    return colorSplit
}

function RangeInputComponent(props){

    const { value, min, max, step, onChange, formatLabel } = props

    const currentValue = useMemo(()=>{
        if (Array.isArray(value)) {
            return value
        }

        if (typeof value === "number"){
            return [value]
        }

        return [min, max]
    }, [value, min, max])

    const valueChanged = useCallback((newValue)=>{
        if (newValue.length != 1) {
            onChange(newValue)
        }
        else{
            onChange(newValue[0])
        }
    }, [onChange])
    
    return range({
        values: currentValue,
        min,
        max,
        step: step || 1,
        onChange: valueChanged,
        renderTrack: ({ props, children })=>div(
            {
                onMouseDown: props.onMouseDown,
                onTouchStart: props.onTouchStart,
                style: {
                    ...props.style,
                    height: "2em",
                    display: "flex",
                    width: "100%",
                }
            },
            div({
                ref: props.ref,
                style: {
                    height: "0.5em",
                    width: "100%",
                    borderRadius: "0.25em",
                    background: getTrackBackground({
                        min, max,
                        colors: getColorSplit(currentValue),
                        values: currentValue
                    }),
                    alignSelf: "center"
                }
            }, children)
        ),
        renderThumb: ({index, props, isDragged})=>div(
            {
                ...props,
                style: {
                    ...props.style,
                    height: "1em",
                    width: "1em",
                    borderRadius: "0.25em",
                    backgroundColor: "var(--color-white)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 2px 6px var(--color-dark)"
                }
            },
            div({
                style: {
                    height: "0.5em",
                    width: "0.2em",
                    backgroundColor: isDragged ? "var(--color-primary)" : "var(--color-dark)"
                }
            }),
            div({
                style: {
                    position: 'absolute',
                    top: '-1.5em',
                    color: 'var(--color-text)',
                    fontWeight: 'bold',
                    fontSize: '0.75em',
                }
            }, formatLabel ? formatLabel(currentValue[index]) : currentValue[index])
        )
    })
}

export default factory(RangeInputComponent)