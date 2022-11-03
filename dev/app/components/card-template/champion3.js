import { UnitRendererComponent } from "/Components/card-template/unit.js"
import factory from "/Utils/elements.js"


class Champion3Component extends UnitRendererComponent {
    cardFrame = "/Assets/champion/frame3.png"

    getRegionFrameUrl(){
        let regionCount = this.props.faction.length
        if (regionCount > 3){
            regionCount = 3 
        }
        return `/Assets/champion/lvl3regionbox${regionCount}.png`
    }
}

export default factory(Champion3Component)