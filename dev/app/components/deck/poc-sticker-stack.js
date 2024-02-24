import factory, { div } from "/Utils/elements.js";
import { useCallback } from "/cdn/react"
import svgWrap from "/Components/card-template/svg-wrap.js";
import { RelicItemRitoIcon } from "/Components/deck/poc-relic-item-selection-modal-icon.js"


function pocStickerStack(props){
    
    const doNothing = useCallback(()=>{}, [])

    return svgWrap(
        {
            width: 256,
            height: props.stickers.length * 256,
            isInclusion: true,
        },
        props.stickers.map(sticker=>RelicItemRitoIcon({
            ...sticker,
            key: sticker.itemCode || sticker.relicCode,
        }))
    )
}

export default factory(pocStickerStack)