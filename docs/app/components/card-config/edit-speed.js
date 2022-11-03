import factory,{label,div,strong,img}from"/Utils/elements.js";import useLang from"/Utils/use-lang.js";import{KeywordImageCheck}from"/Components/card-config/edit-keywords.js";export const speedOptions=["trap","boon","slow","fast","burst","focus","equipment","skill"];function EditSpeedComponent(e){const t=useLang();return label(div(strong(t("speed"))),div({className:"flex gutter-b-2 gutter-t-.5"},speedOptions.map(t=>{const o=e.value===t;return div({className:"box-3 clickable flex column vhcenter "+(o?"":"ghost"),key:t,onClick:()=>{o?e.updateValue(void 0):e.updateValue(t)}},KeywordImageCheck({isChecked:o,keywordName:t}))})))}export default factory(EditSpeedComponent);