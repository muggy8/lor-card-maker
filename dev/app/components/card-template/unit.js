import factory, { div } from "/Utils/elements.js"
import { Component, createRef, useRef } from "/cdn/react"
import { Globals } from "/Views/index.js"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"
import ArtRenderer from "/Components/card-template/image-render.js"
import EffectText, { scaleFontSize } from "/Components/card-template/effect-text.js"
import loadCss from "/Utils/load-css.js"
import SvgWrap from "/Components/card-template/svg-wrap.js"
import fitty from "/cdn/fitty"
import datauri from "/Utils/datauri.js"
import { defaultShade } from "/Views/list.js"
import debounce from "/Utils/debounce-function.js"
import concurrencyManagerFactory from "/Utils/concurrency-manager.js"
import useEffectDebounce from "/Utils/use-debounce-effect.js"

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

    static get contextType(){
        return Globals
    }

    constructor(props) {
        super(props)
        this.clanRef = createRef()
        this.costRef = createRef()
        this.powerRef = createRef()
        this.healthRef = createRef()
        this.nameRef = createRef()
        this.cardTextWrapperRef = createRef()
        const concurrencyManager = concurrencyManagerFactory()

        this.fitClan = debounce(()=>this.clanRef.current && scaleFontSize(this.clanRef.current, 40, 16))
        this.fitName = debounce(()=>{
            this.nameRef.current && concurrencyManager.concurrent(()=>scaleFontSize(this.nameRef.current, 70, 16))
        })
        this.fitCost = debounce(()=>{
            if (!this.costRef.current){
                return
            }

            if (!this.costFitty){
                this.costFitty = fitty(this.costRef.current, { multiLine: false, maxSize: 90 })
                return
            }

            this.costFitty.fit()
        })
        this.fitPower = debounce(()=>{
            if (!this.powerRef.current){
                return
            }

            if (!this.powerFitty){
                this.powerFitty = fitty(this.powerRef.current, { multiLine: false, maxSize: 70 })
                return
            }
            
            this.powerFitty.fit()
        })
        this.fitHealth = debounce(()=>{
            if (!this.healthRef.current){
                return
            }

            if (!this.healthFitty){
                this.healthFitty = fitty(this.healthRef.current, { multiLine: false, maxSize: 70 })
                return
            }
            
            this.healthFitty.fit()
        })

        this.scaleText = debounce(()=>{
            this.cardTextWrapperRef.current && concurrencyManager.sequential(()=>scaleFontSize(this.cardTextWrapperRef.current))
        }, 300)
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
            fitClan,
            fitCost,
            fitPower,
            fitHealth,
            fitName,
        } = this

        fitClan()
        fitCost()
        fitPower()
        fitHealth()
        fitName()

        this.fetchUrlAsUriAndStoreInState("/Assets/champion/backdrop.png", "backdropUri")
        this.fetchUrlAsUriAndStoreInState(this.cardFrame, "frameUri")
        this.fetchUrlAsUriAndStoreInState(this.clanFrame, "clanFrameUri")

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

    componentDidUpdate(previousProps, previousState){
        const {
            clan,
            cost,
            power,
            health,
            name,
            effectText,
            lvup,
            keywords
        } = this.props

        const {
            fitClan,
            fitCost,
            fitPower,
            fitHealth,
            fitName,
            scaleText,
        } = this

        const frameLoaded = !!this.state.frameUri !== !!previousState.frameUri
        const shouldScaleEffect = (
            !!previousProps.name !== name ||
            !!(previousProps.keywords && previousProps.keywords.length) !== !!(keywords && keywords.length) ||
            previousProps.effectText !== effectText ||
            previousProps.lvup !== lvup 
        )
        
        ;((previousProps.clan !== clan) || frameLoaded) && fitClan()
        ;((previousProps.cost !== cost) || frameLoaded) && fitCost()
        ;((previousProps.power !== power) || frameLoaded) && fitPower()
        ;((previousProps.health !== health) || frameLoaded) && fitHealth()
        ;((previousProps.name !== name) || frameLoaded) && fitName()
        ;(shouldScaleEffect || frameLoaded) && scaleText()

        if (previousProps.rarity !== this.props.rarity && this.props.rarity !== "gemless" && this.props.rarity !== "none"){
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
        const shade = this.props.shade || defaultShade
        const [trasnparentPercent, solidPercent] = shade.gradientLocation
        return SvgWrap(
            { 
                loading: !this.state.frameUri || this.props.loading,
                onTransform: this.props.updateTransform, 
                ...(this.props.transform || {x: 0, y: 0, scale: 1}),
            },
            this.state.frameUri 
                ? div(
                    {
                        style: {
                            "--background-image": !this.props.art && this.state.backdropUri && this.context.state.defaultBg
                                ? `url(${this.state.backdropUri || ""})`
                                : `none`
                            ,
                            "--scale": this.props.transform ? this.props.transform.scale : 1,
                            "--left": this.props.transform ? this.props.transform.x : 0,
                            "--top": this.props.transform ? this.props.transform.y : 0,
                            "--blur": `${shade.blur}px`,
                            "--darkness": shade.darkness,
                            "--transparent-percent": trasnparentPercent + "%",
                            "--solid-percent": solidPercent + "%",  
                        },
                        className: `unit ${this.regionPosition}`,
                        id: this.props.id
                    },

                    div(
                        {
                            className: "art",
                            style: {
                                clipPath: `polygon(${
                                    this.clipPathPolygon.map((coordPair)=>{
                                        return coordPair.map(coord=>coord+"px")
                                            .join(" ")
                                    }).join(",")
                                })`,
                            }
                        },
                        div(
                            {className: "scale-adjuster"},
                            ArtRenderer({
                                url: this.props.art
                            })
                        ),
                    ),

                    div(
                        {
                            className: "art blur",
                            style: {
                                clipPath: `polygon(${
                                    this.clipPathPolygon.map((coordPair)=>{
                                        return coordPair.map(coord=>coord+"px")
                                            .join(" ")
                                    }).join(",")
                                })`,
                            }
                        },
                        div(
                            {className: "scale-adjuster"},
                            ArtRenderer({
                                url: this.props.art
                            })
                        ),
                    ),

                    div(
                        {
                            className: "frame",
                            style: {
                                backgroundImage: this.state.frameUri 
                                    ? `url(${this.state.frameUri || ""})` 
                                    : "none"
                            }
                        },
                    ),

                    div(
                        { className: "card-text-wrapper", ref: this.cardTextWrapperRef },
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
                                this.props.keywords.map(keyword=>{
                                    if (typeof keyword === "string"){
                                        return KeywordRenderer({
                                            key: keyword,
                                            name: keyword,
                                            size: this.props.keywords.length > 1 ? "small" : "large"
                                        })
                                    }
    
                                    return KeywordRenderer({
                                        name: keyword.name,
                                        icons: keyword.icons,
                                        key: keyword.id,
                                        size: this.props.keywords.length > 1 ? "small" : "large"
                                    })
                                })
                            )
                            : undefined
                        ,

                        EffectText(
                            {
                                blueWords: this.props.blueWords,
                                orangeWords: this.props.orangeWords,
                                className: "effect-container card-text-universe",
                                effectText: this.props.effect,
                                levelText: this.props.lvup,
                            },
                        ),
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
                                    backgroundImage: this.state.regionFrameUri
                                        ? `url(${this.state.regionFrameUri || ""})`
                                        : "none"
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

                    this.props.clan && this.props.clan.length
                        ? div(
                            {
                                className: "clan",
                                style: {
                                    backgroundImage: this.state.clanFrameUri 
                                        ? `url(${this.state.clanFrameUri || ""})`
                                        : "none"
                                }
                            },
                            this.props.clan.map(clanText=>AutoFitClanText({key: clanText}, clanText)),
                            // div(
                            //     {
                            //         ref: this.clanRef,
                            //         className: "card-text-universe-condensed text-area fitty-nowrap"
                            //     },
                            //     this.props.clan
                            // ),
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

                    this.props.rarity && this.props.rarity !== "gemless" && this.props.rarity !== "none"
                        ? div(
                            {
                                className: "rarity " + this.props.rarity,
                                style: {
                                    backgroundImage: this.state.rarityUri 
                                        ? `url(${this.state.rarityUri || ""})` 
                                        : "none"
                                }
                            },

                        )
                        : undefined
                    ,
                )
                : undefined
            ,
        )
    }
}

export function AutoFitClanTextComponent(props){

    const autoFitRef = useRef()

    useEffectDebounce(()=>{
        scaleFontSize(autoFitRef.current, 40, 16)
    }, 200, [props.children])

    return div(
        { className: "card-text-universe-condensed text-area fitty-nowrap", ref: autoFitRef },
        props.children
    )
}

export const AutoFitClanText = factory(AutoFitClanTextComponent)

export default factory(UnitRendererComponent, cssLoaded)
