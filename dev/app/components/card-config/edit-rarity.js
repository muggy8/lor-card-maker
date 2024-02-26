import factory, { label, div, strong, img } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useEffect } from "/cdn/react" 


export const rarityOptions = [
    "common",
    "rare",
    "epic",
    "champion",
]

function EditRegionComponent(props){
    const translate = useLang()

    // if a PoC item is imported and the rarity is special or legendary, we gotta fix that shit.
    useEffect(()=>{
        if (props.value === "legendary"){
            props.updateValue("champion")
        }
        else if (props.value === "special"){
            props.updateValue("")
        }
    }, [props.value])

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
            { className: "flex gutter-b-2 gutter-t-.5" },
            rarityOptions.map(rarityName=>{
                const isChecked = rarityName === props.value

                return div(
                    { 
                        className: `box-3 clickable flex column vhcenter ${isChecked ? "" : "ghost"}`,
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