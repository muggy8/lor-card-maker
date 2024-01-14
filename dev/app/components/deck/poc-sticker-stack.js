import factory, { div } from "/Utils/elements.js";
import { useEffect, useState, useCallback, createElement} from "/cdn/react"
import { svgRefference } from "/Views/card-editor.js"
import svgWrap from "/Components/card-template/svg-wrap.js";
import { RelicItemRitoIcon } from "/Components/deck/poc-relic-item-selection-modal-icon.js"


function pocStickerStack(props){
    
    const doNothing = useCallback(()=>{}, [])

    return createElement(
        svgRefference.Provider,
        { value: {
            current: null,
            setRef: doNothing,
        } },
        svgWrap(
            {
                width: 256,
                height: props.stickers.length * 256,
            },
            props.stickers.map(sticker=>RelicItemRitoIcon({
                ...sticker,
                key: sticker.itemCode || sticker.relicCode,
            }))
        )
    )
}

export default factory(pocStickerStack)