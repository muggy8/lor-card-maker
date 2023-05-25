import { UnitRendererComponent } from "/Components/card-template/unit.js"
import factory from "/Utils/elements.js"


class LandmarkComponent extends UnitRendererComponent {

    cardFrame = "/Assets/landmark/frame.png"
    
    clanFrame = "/Assets/landmark/typing-2.png"

    regionPosition = "landmark"

    clipPathPolygon = [
        [50, 60],
        [630, 60],
        [630, 890],
        [340, 955],
        [50, 890],
    ]

    getRegionFrameUrl(){
        let regionCount = this.props.faction.length
        if (regionCount > 3){
            regionCount = 3 
        }
        return `/Assets/landmark/regionbox${regionCount}.png`
    }
}

export default factory(LandmarkComponent)