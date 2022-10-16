import factory, { div } from "/Utils/elements.js"
import { Component } from "/cdn/react"
import loadCss from "/Utils/load-css.js"

loadCss("/Components/card-template/unit.css")

export class UnitRendererComponent extends Component {

    render(){
        return div(
            { className: "unit", id: this.props.id },
            div(
                { className: "art",},
            ),
            div(
                { className: "frame" },
            ),
        ) 
    }
}

export default factory(UnitRendererComponent)