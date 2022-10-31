import factory, { div } from "/Utils/elements.js"
import { useContext, useEffect, useState } from "/cdn/react" 
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { getCardList } from "/Utils/service.js"

import Spell from "/Components/card-template/spell.js"
import Champion1 from "/Components/card-template/champion1.js"
import Champion2 from "/Components/card-template/champion2.js"
import Champion3 from "/Components/card-template/champion3.js"
import Follower from "/Components/card-template/follower.js"
import Landmark from "/Components/card-template/landmark.js"
import Keyword from "/Components/card-template/keyword.js"

const cssLoaded = loadCss("/Views/batch-export.css")

function BatchExportComponent(){

    return div("placeholder")
}

export default factory(BatchExportComponent, cssLoaded)