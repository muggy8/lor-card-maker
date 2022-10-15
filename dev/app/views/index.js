import factory from "/Utils/element-factory.js"
import { useEffect, useCallback, useState } from "/cdn/react" 
import { div, main } from "/Utils/elements.js"

function ListView(props){
    return main(
        div("test"),
        div("some"),
        div("stuff"),
    )
}

export default factory(ListView)