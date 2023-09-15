import factory, { div } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { useRef, useLayoutEffect, useState, useEffect } from "/cdn/react" 
// import setImmediate from "/Utils/set-immediate-batch.js"
import datauri from "/Utils/datauri.js"
import useAssetCache from "/Utils/use-asset-cache.js"

const cssLoaded = loadCss("/Components/card-template/keyword-renderer.css")

export const keywords = {
    "attune": [ "attune.png" ],
    "attach": [ "attach.png" ],
    "aura": [ "aura.png" ],
    "augment": [ "augment.png" ],
    "fleeting": [ "fleeting.png" ],
    "scout": [ "scout.png" ],
    "barrier": [ "barrier.png" ],
    "deep": [ "deep.png" ],
    "frostbite": [ "frostbite.png" ],
    "skill": [ "skill.png" ],
    "burst": [ "burst.png" ],
    "double attack": [ "doubleattack.png" ],
    "last breath": [ "lastbreath.png" ],
    "slow": [ "slow.png" ],
    "can't attack": [ "cantattack.png" ],
    "elusive": [ "elusive.png" ],
    "lifesteal": [ "lifesteal.png" ],
    "landmark": [ "landmark.png" ],
    "stun": [ "stun.png" ],
    "can't block": [ "cantblock.png" ],
    "ephemeral": [ "ephemeral.png" ],
    "overwhelm": [ "overwhelm.png" ],
    "tough": [ "tough.png" ],
    "capture": [ "capture.png" ],
    "fast": [ "fast.png" ],
    "quick attack": [ "quickattack.png" ],
    "vulnerable": [ "vulnerable.png" ],
    "challenger": [ "challenger.png" ],
    "fearsome": [ "fearsome.png" ],
    "regeneration": [ "regeneration.png" ],
    "spellshield": [ "spellshield.png" ],
    "fury": [ "fury.png" ],
    "focus": [ "focus.png" ],
    "formidable": [ "formidable.png" ],
    "lurk": [ "lurk.png" ],
    "impact": [ "impact.png" ],
    "fated": [ "fated.png" ],
    "evolve": [ "evolve.png" ],
    "hallowed": [ "hallowed.png" ],
    "equipment": [ "equipment.png" ],
    "immobile": [ "cantattack.png", "cantblock.png" ],
    "trap": [],
    "boon": [],
    "silence": ["silence.png"],
    "trigger": ["trigger.png"],
    // "impact": ["impactn.png"],
    "imbue": ["imbue.png"],
    "brash": ["brash.png"],
    "elementalskill": ["elementalskill.png"],
}

function KeywordRendererComponent(props){
    const { name, size } = props
    const icons = keywords[name] || []
    
    const translate = useLang()
    const wrapperRef = useRef()


    const leftBumperUri = useAssetCache(updateLeftBumperUri=>{
        datauri("/Assets/keyword/keywordleft.png").then(updateLeftBumperUri)
    }, [])
    const rightBumperUri = useAssetCache(updateRightBumperUri=>{
        datauri("/Assets/keyword/keywordright.png").then(updateRightBumperUri)
    }, [])
    const centerBumperUri = useAssetCache(centerRightBumperUri=>{
        datauri("/Assets/keyword/keywordmiddle.png").then(centerRightBumperUri)
    }, [])

    const iconsUri = useAssetCache(updateIconsUri=>{
        if (props.icons){
            updateIconsUri(props.icons)
        }
        else if (icons && icons.length){
            const iconsFetch = icons.map(iconFile=>datauri(`/Assets/keyword/${iconFile}`))
            Promise.all(iconsFetch).then(updateIconsUri)
        }
    }, [props.icons], [])

    useLayoutEffect(()=>{
        props.onDimension && props.onDimension({
            width: wrapperRef.current.clientWidth,
            height: wrapperRef.current.clientHeight,
        })
    }, [props.onDimension, iconsUri.length])

    return div(
        { className: "keyword-wrapper", ref: wrapperRef},
        div({ className: "left-bumper", style: { backgroundImage: leftBumperUri ? `url(${leftBumperUri})` : "none" } }),
        div(
            { className: `contents ${
                icons.length 
                    ? size
                    : "small"
            }`, style: { backgroundImage: centerBumperUri ? `url(${centerBumperUri})` : "none" } },
            iconsUri.map(pngUri=>div(
                { 
                    key: pngUri,
                    className: `keyword-icon ${props.icons && props.icons.length ? "custom" : ""}`,
                    style: {
                        backgroundImage: `url(${pngUri})`
                    },
                }
            )),
            size !== "small" || (!iconsUri.length && !icons.length)
                ? div(
                    { className: "keyword-text card-text-bold card-text-outline" },
                    translate(name),
                )
                : undefined
            ,
        ),
        div({ className: "right-bumper", style: { backgroundImage: rightBumperUri ? `url(${rightBumperUri})` : "none" }  }),
    )
}

export default factory(KeywordRendererComponent, cssLoaded)