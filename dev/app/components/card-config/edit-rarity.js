import factory, { label, div, strong, img } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback } from "/cdn/react" 


export const rarityOptions = [
    "common",
    "rare",
    "epic",
    "champion",
]

function EditRegionComponent(props){
    const translate = useLang()

    const toggleRarity = useCallback((rarity)=>{
        if (props.value === rarity){
            props.updateValue("")
        }
        else {
           props.updateValue(rarity) 
        }
    }, [props.value, props.updateValue])

    return label(
        div(
            strong(translate("rarity"))
        ),
        div(
            { className: "flex gutter-b-2" },
            rarityOptions.map(rarityName=>{
                const isChecked = rarityName === props.value

                return div(
                    { 
                        className: `box-3 gutter-trbl-.25 clickable flex column vhcenter ${isChecked ? "" : "ghost"}`,
                        key: rarityName,
                        onClick: ()=>{
                            toggleRarity(rarityName)
                        }
                    },
                    img({
                        src: `/Assets/shared/${rarityName}.png`
                    })
                )
            })
        )
    )
}

export default factory(EditRegionComponent);