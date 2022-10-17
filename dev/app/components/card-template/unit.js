import factory, { div, img } from "/Utils/elements.js"
import { Component, createRef } from "/cdn/react"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"
import EffectText from "/Components/card-template/effect-text.js"
import loadCss from "/Utils/load-css.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import fitty from "/cdn/fitty"

loadCss("/Components/card-template/unit.css")

export class UnitRendererComponent extends Component {

    clipPathPolygon = [
        [25, 50],
        [655, 50],
        [655, 950],
        [340, 965],
        [25, 950],
    ]

    cardFrame = "/Assets/champion/frame1.png"

    clanFrame = "/Assets/champion/typing.png"

    regionPosition = "champion"

    constructor(props) {
        super(props)
        this.clanRef = createRef()
        this.costRef = createRef()
        this.powerRef = createRef()
        this.healthRef = createRef()
        this.nameRef = createRef()

        console.log(this)
      }

    getRegionFrameUrl(){
        let regionCount = this.props.faction.length
        if (regionCount > 3){
            regionCount = 3 
        }
        return `/Assets/champion/lvl1regionbox${regionCount}.png`
    }

    componentDidMount(){
        const {
            clanRef,
            costRef,
            powerRef,
            healthRef,
            nameRef,
        } = this

        this.clanFitty = fitty(clanRef.current, { multiLine: false, maxSize: 40 })
        this.costFitty = fitty(costRef.current, { multiLine: false, maxSize: 100 })
        this.powerFitty = fitty(powerRef.current, { multiLine: false, maxSize: 60 })
        this.healthRefFitty = fitty(healthRef.current, { multiLine: false, maxSize: 60 })
        this.nameFitty = fitty(nameRef.current, { multiLine: true, maxSize: 70 })
    }

    componentDidUpdate(previousProps){
        const {
            clan, 
            cost, 
            power,
            health, 
            name,
        } = this.props

        previousProps.clan !== clan && this.clanFitty.fit()
        previousProps.cost !== cost && this.costFitty.fit()
        previousProps.power !== power && this.powerFitty.fit()
        previousProps.health !== health && this.healthRefFitty.fit()
        previousProps.name !== name && this.nameFitty.fit()
    }

    render(){
        return SvgWrap(
            div(
                { className: `unit ${this.regionPosition}`, id: this.props.id },

                div(
                    { 
                        className: "art",
                        style: {
                            backgroundImage: `url(/Assets/champion/backdrop.png)`,
                            clipPath: `polygon(${
                                this.clipPathPolygon.map((coordPair)=>{
                                    return coordPair.map(coord=>coord+"px")
                                        .join(" ")
                                }).join(",")
                            })`
                        }
                    },
                ),

                div(
                    { 
                        className: "frame",
                        style: {
                            backgroundImage: `url(${this.cardFrame})`
                        }
                    },
                ),

                div(
                    { className: "cost fitty-nowrap", ref: this.costRef },
                    this.props.mana,
                ),

                this.props.faction && this.props.faction.length
                    ? div(
                        { 
                            className: "region-frame" ,
                            style: {
                                backgroundImage: `url(${this.getRegionFrameUrl()})`
                            }
                        },
                        this.props.faction.map(regionName=>div(
                            { 
                                key: regionName,
                                className: "region-icon",
                                style: {
                                    backgroundImage: `url(/Assets/region/${regionName}.png)`
                                }
                            },
                        ))
                    )
                    : undefined
                ,

                this.props.clan 
                    ? div(
                        {
                            className: "clan",
                            style: {
                                backgroundImage: `url(${this.clanFrame})`
                            }
                        },
                        div(
                            {
                                ref: this.clanRef,
                                className: "text-area fitty-nowrap"
                            },
                            this.props.clan
                        ),
                    )
                    : undefiend
                ,

                typeof this.props.power !== "undefined"
                    ? div(
                        { className: "power fitty-nowrap", ref: this.powerRef },
                        this.props.power
                    )
                    : undefined
                ,

                typeof this.props.health !== "undefined"
                    ? div(
                        { className: "health fitty-nowrap", ref: this.healthRef },
                        this.props.health
                    )
                    : undefined
                ,

                div(
                    { className: "card-text-wrapper" },
                    // stuff to do with the card content goes here

                    this.props.name
                        ? div(
                            { className: "name fitty-wrap", ref: this.nameRef },
                            this.props.name
                        )
                        : undefined
                    ,

                    this.props.keywords
                        ? div(
                            { className: "keyword-container" },
                            this.props.keywords.map(keywordName=>KeywordRenderer({
                                key: keywordName,
                                name: keywordName,
                                size: this.props.keywords.length > 1 ? "small" : "large"
                            }))
                        )
                        : undefined
                    ,

                    this.props.effect
                        ? EffectText(
                            { 
                                blueWords: this.props.blueWords,
                                orangeWords: this.props.orangeWords, 
                                className: "effect-container",
                            }, 
                            this.props.effect
                        )
                        : undefined
                    ,

                    this.props.lvup
                        ? img({
                            src: "/Assets/champion/levelupbar.png",
                            className: "level-bar"
                        })
                        : undefined
                    ,

                    this.props.lvup
                        ? EffectText(
                            { 
                                blueWords: this.props.blueWords,
                                orangeWords: this.props.orangeWords, 
                                className: "level-up-container",
                            }, 
                            this.props.lvup
                        )
                        : undefined
                    ,
                )
            ) 
        )
    }
}

export default factory(UnitRendererComponent)