import factory, { svg, foreignObject } from "/Utils/elements.js"

function SvgWrapComponent(props){
    return svg(
        {
            width: props.width || "680",
            height: props.height || "1024",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: `0 0 ${ props.width || "680" } ${ props.height || "1024" }`,
        },
        foreignObject(
            {
                width: "680",
                height: "1024",
                style: {
                    backgroundColor: "rgba(0,0,0,0)",
                },
            },
            props.children
        )
    )
}

export default factory(SvgWrapComponent)