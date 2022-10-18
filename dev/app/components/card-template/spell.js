import factory, { div, img } from "/Utils/elements.js"
import loadCss from "/Utils/load-css.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"

loadCss("/Components/card-template/spell.css")

function SpellComponent(props){

    return SvgWrap(
        div(
            { className: `${props.speed} spell`, id: props.id },
            img(
                { 
                    className: "text-background",
                    src: "/Assets/spell/background.png",
                },
            ),
            div(
                { 
                    className: "art",
                    style: {
                        backgroundImage: `url(/Assets/spell/backdrop.png)`,
                    }
                },
            ),
            div(
                { 
                    className: "frame",
                    style: {
                        backgroundImage: `url(/Assets/spell/frame${props.speed || "trap"}.png)`
                    }
                },
            ),
            div(
                { className: "cost fitty-nowrap", },
                props.mana,
            ),
            props.faction && props.faction.length
                ? div(
                    { 
                        className: "region-frame" ,
                        style: {
                            backgroundImage: `url(/Assets/spell/regionbox${props.faction.length > 3 ? 3 : props.faction.length}.png)`
                        }
                    },
                    props.faction.map((regionName, index)=>div(
                        { 
                            key: regionName,
                            className: "region-icon region-icon-" + index,
                            style: {
                                backgroundImage: `url(/Assets/region/${regionName}.png)`
                            }
                        },
                    ))
                )
                : undefined
            ,
            props.clan 
                ? div(
                    {
                        className: "clan",
                        style: {
                            backgroundImage: `url(/Assets/landmark/typing.png)`
                        }
                    },
                    div(
                        {
                            className: "text-area fitty-nowrap"
                        },
                        props.clan
                    ),
                )
                : undefined
            ,
            props.rarity 
                ? img(
                    { 
                        className: `rarity ${props.clan ? "with-clan" : ""}`,
                        src: `/Assets/shared/gem${props.rarity}.png`,
                    },
                )
                : undefined
            ,
            typeof props.power !== "undefined"
                ? div(
                    { className: "power fitty-nowrap" },
                    props.power
                )
                : undefined
            ,
            typeof props.health !== "undefined"
                ? div(
                    { className: "health fitty-nowrap" },
                    props.health
                )
                : undefined
            ,
            div(
                { className: "card-text-wrapper" },
                // stuff to do with the card content goes here

                props.name
                    ? div(
                        { className: "name fitty-wrap" },
                        props.name
                    )
                    : undefined
                ,

                props.keywords
                    ? div(
                        { className: "keyword-container" },
                        props.keywords.map(keywordName=>KeywordRenderer({
                            key: keywordName,
                            name: keywordName,
                            size: props.keywords.length > 1 ? "small" : "large"
                        }))
                    )
                    : undefined
                ,

                props.effect
                    ? EffectText(
                        { 
                            blueWords: props.blueWords,
                            orangeWords: props.orangeWords, 
                            className: "effect-container",
                        }, 
                        props.effect
                    )
                    : undefined
                ,
            )
        )
    )
}

export default factory(SpellComponent)