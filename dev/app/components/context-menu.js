import contextMenuBaseComponent from "/cdn/react-jsx-context-menu"
import factory, { div } from "/Utils/elements.js"


class ContextMenuComponent extends contextMenuBaseComponent {
	constructor(props){
		super(props)

		this.onRightClick = (x, y)=>{

			const rect = this.relWrapRef.getBoundingClientRect()
			const rectX = rect.x + window.scrollX
			const rectY = rect.y + window.scrollY

			const relX = x - rectX
			const relY = y - rectY

			this.setState(()=>{
				return {
					open: true,
					location: {
						x: relX,
						y: relY,
					}
				}
			})
		}
	}

	render(){
		return div(
			{
				style: {position: "relative",},
				ref: ele=>{
					ele && (this.relWrapRef = ele)
				},
				onClick: ()=>{
					this.setState(()=>({
						open: false,
					}))
				}
			},
			super.render()
		)
	}
}

export default factory (ContextMenuComponent)
