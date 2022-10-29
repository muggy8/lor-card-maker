import factory, { label, div, strong, img } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback } from "/cdn/react"
import { KeywordImageCheck } from "/Components/card-config/edit-keywords.js"

export const speedOptions = [
    "trap",
    "slow",
    "fast",
    "burst",
    "focus",
    "equipment",
]

function EditSpeedComponent(props){
	const translate = useLang()

	return label(
        div(
            strong(translate("speed"))
        ),
        div(
            { className: "flex gutter-b-2 gutter-t-.5" },
            speedOptions.map(speedName=>{

				const isChecked = props.value === speedName

                return div(
                    {
                        className: `box-2 clickable flex column vhcenter ${isChecked ? "" : "ghost"}`,
                        key: speedName,
                        onClick: ()=>{
                            props.updateValue(speedName)
                        }
                    },
                    //~ img({
                        //~ src: `/Assets/keyword/${speedName}.png`
                    //~ })
                    KeywordImageCheck({
						isChecked,
						keywordName: speedName,
					})
                )
            })
        )
    )

}

export default factory(EditSpeedComponent)
