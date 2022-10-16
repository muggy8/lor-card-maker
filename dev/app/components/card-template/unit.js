import factory, { div } from "/Utils/elements.js"
import { Component } from "/cdn/react"
import KeywordRenderer from "/Components/card-template/keyword-renderer.js"
import loadCss from "/Utils/load-css.js"

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

    getRegionFrameUrl(){
        let regionCount = this.props.faction.length
        if (regionCount > 3){
            regionCount = 3 
        }
        return `/Assets/champion/lvl1regionbox${regionCount}.png`
    }

    render(){
        return div(
            { className: "unit", id: this.props.id },

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
                { className: "cost" },
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
                            className: "text-area"
                        },
                        this.props.clan
                    ),
                )
                : undefiend
            ,

            typeof this.props.power !== "undefined"
                ? div(
                    { className: "power" },
                    this.props.power
                )
                : undefined
            ,

            typeof this.props.health !== "undefined"
                ? div(
                    { className: "health" },
                    this.props.health
                )
                : undefined
            ,

            div(
                { className: "card-text-wrapper" },
                // stuff to do with the card content goes here

                this.props.name
                    ? div(
                        { className: "name" },
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
            )
        ) 
    }
}

export default factory(UnitRendererComponent)