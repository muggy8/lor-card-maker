import factory, { div, button, range } from "/Utils/elements.js";
import { useState, useEffect, useMemo } from "/cdn/react"
import { getTrackBackground } from "/cdn/react-range"

function rangeSliderComponent(props){

    const [min, updateMin] = useState(0)
    const [max, updateMax] = useState(1)

    useEffect(()=>{
        const rangeClone = [...props.range]
        rangeClone.sort((a,b)=>a-b)
        updateMin(rangeClone[0])
        updateMax(rangeClone[rangeClone.length - 1])
    }, [props.range])

    const currentValue = useMemo(()=>props.value 
        ? props.value 
        : [min, max]
    , [props.value, min, max])

    return div({ className: "slider-option gutter-b-1" }, 
        div({ className: "gutter-b-.5" }, props.label),
        div({ className: "flex gutter-rl-.5" },
            div({ className: "grow gutter-tr-1 flex gutter-l-.5" }, 
                range({
                    values: currentValue,
                    min,
                    max,
                    step: 1,
                    onChange: props.onChange,
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
                                    colors: [ "var(--color-light)", "var(--color-primary)", "var(--color-light)"],
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
                                // padding: '0.25em',
                                // borderRadius: '0.25em',
                            }
                        }, currentValue[index])
                    )
                })
            ),
            button({ className: "gutter-trbl-.5", onClick: ()=>props.onChange([min, max]) }, 
                div({ className: "icon multiply" })
            )
        ),
    )
}

export default factory(rangeSliderComponent)