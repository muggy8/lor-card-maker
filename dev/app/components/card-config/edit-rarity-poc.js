import factory, { label, div, strong, img } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback } from "/cdn/react" 

export const rarityOptions = [
    "common",
    "rare",
    "epic",
    "legendary",
    "special",
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
            { className: "flex hcenter gutter-b-2 gutter-t-.5" },
            rarityOptions.map(rarityName=>{
                const isChecked = rarityName === props.value

                return div(
                    { 
                        className: `clickable flex box-2 column vhcenter ${isChecked ? "" : "ghost"}`,
                        key: rarityName,
                        onClick: ()=>{
                            toggleRarity(rarityName)
                        }
                    },
                    img({
                        src: `/Assets/keyword/poc-${rarityName}.png`
                    })
                )
            })
        )
    )
}

export default factory(EditRegionComponent);