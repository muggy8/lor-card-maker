import factory, { div } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"

loadCss("/Components/card-template/keyword-renderer.css")

export const keywords = {
    "attune": [ "attune.png" ],
    "attach": [ "attach.png" ],
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
    "impact": ["impactn.png"],
    "imbue": ["imbue.png"],
}

function KeywordRendererComponent(props){
    const { name, size } = props
    const icons = keywords[name] || []
    
    const translate = useLang()

    return div(
        { className: "keyword-wrapper" },
        div({ className: "left-bumper" }),
        div(
            { className: `contents ${size}` },
            icons.map(pngName=>div(
                { 
                    key: pngName,
                    className: "keyword-icon",
                    style: {
                        backgroundImage: `url(/Assets/keyword/${pngName})`
                    },
                }
            )),
            size !== "small" || !icons.length
                ? div(
                    { className: "keyword-text" },
                    translate(name),
                )
                : undefined
            ,
        ),
        div({ className: "right-bumper" }),
    )
}

export default factory(KeywordRendererComponent)