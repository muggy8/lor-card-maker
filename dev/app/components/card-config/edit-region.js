import factory, { label, div, strong, img } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback } from "/cdn/react" 


export const regionOptions = [
    "piltoverzaun",
    "noxus",
    "demacia",
    "freljord",
    "ionia",
    "shadowisles",
    "bilgewater",
    "targon",
    "ixtal",
    "bandlecity",
    "void",
    "shurima",
    "runeterra",
]

function EditRegionComponent(props){
    const translate = useLang()

    const toggleFaction = useCallback((factionName)=>{
        const factionNameIndex = props.value.indexOf(factionName)
        if (factionNameIndex > -1){
            const toggledOffState = props.value.filter(name=>name !== factionName)
            return props.updateValue(toggledOffState)
        }
        const toggledOnState = [...props.value, factionName]
        if (toggledOnState.length > 3){
            return props.updateValue(toggledOnState.slice(-3))
        }
        props.updateValue(toggledOnState)
    }, [props.value, props.updateValue])

    return label(
        div(
            strong(translate("faction"))
        ),
        div(
            { className: "flex gutter-b-2" },
            regionOptions.map(regionName=>{
                const isChecked = props.value.some(checkedValue=>{
                    return checkedValue === regionName
                })

                return div(
                    { 
                        className: `box-3 gutter-trbl-.25 clickable flex column vhcenter ${isChecked ? "" : "ghost"}`,
                        key: regionName,
                        onClick: ()=>{
                            toggleFaction(regionName)
                        }
                    },
                    img({
                        src: `/Assets/region/${regionName}.png`
                    })
                )
            })
        )
    )
}

export default factory(EditRegionComponent);