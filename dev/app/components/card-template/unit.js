import factory, { div, img } from "/Utils/elements.js"
import { Component, createRef } from "/cdn/react"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"
import ArtRenderer from "/Components/card-template/image-render.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import loadCss from "/Utils/load-css.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import fitty from "/cdn/fitty"
import datauri from "/Utils/datauri.js"


const cssLoaded = loadCss("/Components/card-template/unit.css")

export class UnitRendererComponent extends Component {

    clipPathPolygon = [
        [25, 50],
        [655, 50],
        [655, 950],
        [340, 965],
        [25, 950],
    ]

    state = {}

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

        clanRef.current && scaleFontSize(clanRef.current, 40, 16)
        costRef.current && (this.costFitty = fitty(costRef.current, { multiLine: false, maxSize: 90 }))
        powerRef.current && (this.powerFitty = fitty(powerRef.current, { multiLine: false, maxSize: 70 }))
        healthRef.current && (this.healthRefFitty = fitty(healthRef.current, { multiLine: false, maxSize: 70 }))
        nameRef.current && scaleFontSize(nameRef.current, 70, 16)

        this.fetchUrlAsUriAndStoreInState("/Assets/champion/backdrop.png", "backdropUri")
        this.fetchUrlAsUriAndStoreInState(this.cardFrame, "frameUri")
        this.fetchUrlAsUriAndStoreInState(this.clanFrame, "clanFrameUri")
        this.fetchUrlAsUriAndStoreInState("/Assets/champion/levelupbar.png", "levelupBarUri")

        if (this.props.rarity){
            this.props.rarity !== "gemless" && this.fetchUrlAsUriAndStoreInState(`/Assets/shared/gem${this.props.rarity}.png`, "rarityUri")
        }
        if (this.props.faction && this.props.faction.length){
            const fetchTask = this.props.faction.map(regionName=>datauri(`/Assets/region/${regionName}.png`))
            Promise.all(fetchTask).then(uriArray=>{
                this.setState((state)=>({
                    ...state,
                    factionUri: uriArray,
                }))
            })

            this.fetchUrlAsUriAndStoreInState(this.getRegionFrameUrl(), "regionFrameUri")
        }
    }

    fetchUrlAsUriAndStoreInState(url, stateName){
        datauri(url).then(uri=>{
            this.setState((state)=>({
                ...state,
                [stateName]: uri
            }))
        })
    }

    componentDidUpdate(previousProps){
        const {
            clan, 
            cost, 
            power,
            health, 
            name,
        } = this.props

        previousProps.clan !== clan && scaleFontSize(this.clanRef.current, 40, 16)
        previousProps.cost !== cost && this.costFitty.fit()
        previousProps.power !== power && this.powerFitty.fit()
        previousProps.health !== health && this.healthRefFitty.fit()
        previousProps.name !== name && scaleFontSize(this.nameRef.current, 70, 16)

        if (previousProps.rarity !== this.props.rarity &&  this.props.rarity !== "gemless"){
            this.fetchUrlAsUriAndStoreInState(`/Assets/shared/gem${this.props.rarity}.png`, "rarityUri")
        }
        if (this.props.faction && this.props.faction.length && previousProps.faction !== this.props.faction){
            const fetchTask = this.props.faction.map(regionName=>datauri(`/Assets/region/${regionName}.png`))
            Promise.all(fetchTask).then(uriArray=>{
                this.setState((state)=>({
                    ...state,
                    factionUri: uriArray,
                }))
            })

            this.fetchUrlAsUriAndStoreInState(this.getRegionFrameUrl(), "regionFrameUri")
        }
    }

    render(){
        return SvgWrap(
            div(
                { className: `unit ${this.regionPosition}`, id: this.props.id },

                div(
                    { 
                        className: "art",
                        style: {
                            backgroundImage: `url(${this.state.backdropUri || ""})`,
                            clipPath: `polygon(${
                                this.clipPathPolygon.map((coordPair)=>{
                                    return coordPair.map(coord=>coord+"px")
                                        .join(" ")
                                }).join(",")
                            })`
                        }
                    },
                    div(
                        {className: "scale-adjuster"},
                        ArtRenderer({
                            url: this.props.art
                        })
                    )
                ),

                div(
                    { 
                        className: "frame",
                        style: {
                            backgroundImage: `url(${this.state.frameUri || ""})`
                        }
                    },
                ),

                div(
                    { className: "cost fitty-nowrap card-text-bold", ref: this.costRef },
                    this.props.mana,
                ),

                this.props.faction && this.props.faction.length
                    ? div(
                        { 
                            className: "region-frame" ,
                            style: {
                                backgroundImage: `url(${this.state.regionFrameUri || ""})`
                            }
                        },
                        this.state.factionUri 
                            ? this.state.factionUri.map(uri=>div(
                                { 
                                    key: uri,
                                    className: "region-icon",
                                    style: {
                                        backgroundImage: `url(${uri})`
                                    }
                                },
                            ))
                            : null
                        ,
                    )
                    : undefined
                ,

                this.props.clan 
                    ? div(
                        {
                            className: "clan",
                            style: {
                                backgroundImage: `url(${this.state.clanFrameUri || ""})`
                            }
                        },
                        div(
                            {
                                ref: this.clanRef,
                                className: "card-text-universe-condensed text-area fitty-nowrap"
                            },
                            this.props.clan
                        ),
                    )
                    : undefined
                ,

                typeof this.props.power !== "undefined"
                    ? div(
                        { className: "power fitty-nowrap card-text-bold", ref: this.powerRef },
                        this.props.power
                    )
                    : undefined
                ,

                typeof this.props.health !== "undefined"
                    ? div(
                        { className: "health fitty-nowrap card-text-bold", ref: this.healthRef },
                        this.props.health
                    )
                    : undefined
                ,

                div(
                    { className: "card-text-wrapper" },
                    // stuff to do with the card content goes here

                    this.props.name
                        ? div(
                            { className: "name fitty-wrap card-text-bold", ref: this.nameRef },
                            this.props.name
                        )
                        : undefined
                    ,

                    this.props.keywords && this.props.keywords.length
                        ? div(
                            { className: "keyword-container card-text-bold" },
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
                                className: "effect-container card-text-universe",
                            }, 
                            this.props.effect
                        )
                        : undefined
                    ,

                    this.props.lvup
                        ? div({
                            className: "level-bar",
                            style: {
                                backgroundImage: `url(${this.state.levelupBarUri || ""})`
                            },
                        })
                        : undefined
                    ,

                    this.props.lvup
                        ? EffectText(
                            { 
                                blueWords: this.props.blueWords,
                                orangeWords: this.props.orangeWords, 
                                className: "level-up-container card-text-universe",
                            }, 
                            this.props.lvup
                        )
                        : undefined
                    ,
                ),

                this.props.rarity && this.props.rarity !== "gemless"
                    ? div(
                        {
                            className: "rarity " + this.props.rarity,
                            style: {
                                backgroundImage: `url(${this.state.rarityUri || ""})`
                            }
                        },
                        
                    )
                    : undefined
                ,
            ) 
        )
    }
}

export default factory(UnitRendererComponent, cssLoaded)