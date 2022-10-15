import factory from "/Utils/element-factory.js"
import { useEffect, useCallback, useState } from "/cdn/react" 
import { div, main } from "/Utils/elements.js"

function ListView(props){
    return main(
        div({key: 1}, "test"),
        div({key: 2}, "some"),
        div({key: 3}, "stuff"),
    )
}

export default factory(ListView)