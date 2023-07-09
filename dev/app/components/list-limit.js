import factory, { fragment } from "/Utils/elements.js"
import { useState, useEffect, useRef } from "/cdn/react" 
import debounceFunction from "/Utils/debounce-function.js"
import useAssetCache from "/Utils/use-asset-cache.js"

function ListLimitComponent(props){
    const [limit, updateLimit] = useState(props.defaultSize || 12)
    useEffect(()=>{
        if (props.defaultSize && props.defaultSize > limit){
            updateLimit(props.defaultSize)
        }
    }, [props.defaultSize, limit])

    const children = useAssetCache(updateCache=>{
        updateCache(props.children.flat())
        props.autoResetLimit && updateLimit(props.defaultSize || 12)
    }, [props.children, props.autoResetLimit], [])

    const loadMoreWhenCloserThanThisToTheBottomOfPage = useRef()
    loadMoreWhenCloserThanThisToTheBottomOfPage.current = props.bottomOffset || 200
    
    const currentLimit = useRef()
    currentLimit.current = limit

    const currentListLength = useRef()
    currentListLength.current = children.length

    useEffect(()=>{
        const onScroll = debounceFunction(()=>{
            const body = document.body,
                html = document.documentElement

            const heightOfPage = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight )

            const bottomOfWindow = window.innerHeight + window.scrollY

            if ((loadMoreWhenCloserThanThisToTheBottomOfPage.current + bottomOfWindow) >= heightOfPage){
                console.log({currentLimit, currentListLength})
                if (currentLimit.current < currentListLength.current){
                    const newLimit = Math.min(currentLimit.current + (props.defaultSize || 8), currentListLength.current)
                    updateLimit(newLimit)
                    // since we have updated the limit we should fire the event again just to make sure that we don't need to extend it again.
                    setTimeout(onScroll, 200)
                }
            }
        }, 100)

        onScroll()

        window.addEventListener("scroll", onScroll)

        return ()=>window.removeEventListener("scroll", onScroll)
    }, [])

    return fragment(children.slice(0, limit))
}

export default factory(ListLimitComponent)