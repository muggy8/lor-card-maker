import{UnitRendererComponent}from"/Components/card-template/unit.js";import factory from"/Utils/elements.js";class Champion2Component extends UnitRendererComponent{cardFrame="/Assets/champion/frame2.png";getRegionFrameUrl(){let e=this.props.faction.length;return e>3&&(e=3),`/Assets/champion/lvl2regionbox${e}.png`}}export default factory(Champion2Component);