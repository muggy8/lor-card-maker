import{UnitRendererComponent}from"/Components/card-template/unit.js";import factory from"/Utils/elements.js";class Champion3Component extends UnitRendererComponent{cardFrame="/Assets/champion/frame3.png";getRegionFrameUrl(){let e=this.props.faction.length;return e>3&&(e=3),`/Assets/champion/lvl3regionbox${e}.png`}}export default factory(Champion3Component);