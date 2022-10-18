import { UnitRendererComponent } from "/Components/card-template/unit.js"
import factory from "/Utils/elements.js"


class Champion2Component extends UnitRendererComponent {
    
    cardFrame = "/Assets/follower/frame.png"

    clanFrame = "/Assets/follower/typing.png"

    regionPosition = "follower"

    getRegionFrameUrl(){
        let regionCount = this.props.faction.length
        if (regionCount > 3){
            regionCount = 3 
        }
        return `/Assets/follower/regionbox${regionCount}.png`
    }
}

export default factory(Champion2Component)