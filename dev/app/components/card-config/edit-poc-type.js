import pocIcon from "/Components/card-template/poc-icon.js"
import factory, { label, div, strong, img } from "/Utils/elements.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import useLang from "/Utils/use-lang.js"
import datauri from "/Utils/datauri.js"

export const pocTypeOptions = [
    "power",
    "item",
    "relic",
]

function EditPoCTypeComponent(props){
    const translate = useLang()

    const coloredBackground = useAssetCache(updateColoredBackground=>{
        datauri("/Assets/champion/backdrop.png").then(updateColoredBackground)
    })
    
    return label(
        div(
            strong(translate("type"))
        ),
        div(
            { className: "flex hcenter gutter-b-2 gutter-t-.5" },
            pocTypeOptions.map(pocType=>{
                const isChecked = pocType === props.value

                return div(
                    { 
                        className: `clickable box-4 text-center ${isChecked ? "" : "ghost"}`,
                        key: pocType,
                        onClick: ()=>{
                            props.updateValue(pocType)
                        }
                    },
                    pocIcon({
                        className: "poc-option",
                        pocType,
                        art: isChecked
                            ? coloredBackground
                            : undefined
                        ,
                    }),
                    translate(pocType),
                )
            })
        )
    )
}

export default factory(EditPoCTypeComponent)