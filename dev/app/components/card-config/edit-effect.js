import factory, { div, label, strong, small } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useRef, useEffect } from "/cdn/react"
import { keywords } from "/Components/card-template/keyword-renderer.js"
// import { KeywordImageCheck } from "/Components/card-config/edit-keywords.js"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import { 
	ContextMenu as ContextMenuComponent, 
	MenuItem as MenuItemComponent, 
	ContextMenuTrigger as ContextMenuTriggerComponent 
} from "/cdn/react-contextmenu";

const ContextMenu = factory(ContextMenuComponent)
const MenuItem = factory(MenuItemComponent)
const ContextMenuTrigger = factory(ContextMenuTriggerComponent)

const cssLoaded = loadCss("/Components/card-config/edit-effect.css")

function EditEffectComponent(props){
    const translate = useLang()

	const [editingSelection, updateEditingSelection] = useState()
	const onInput = useCallback(()=>{
		const editingRange = window.getSelection()
		const selectedNode = editingRange.focusNode
		
		if (editingRange && (selectedNode === contentEditDiv.current || contentEditDiv.current.contains(selectedNode))){
			updateEditingSelection({
				node: selectedNode,
				offset: editingRange.focusOffset,
			})
		}

		const inTextIcons = contentEditDiv.current.querySelectorAll(".keyword-icon-wrapper")

		if (inTextIcons.length){
			Array.prototype.forEach.call(inTextIcons, (iconElement)=>{
				if (!(iconElement.nextSibling instanceof Text)){
					if (iconElement.nextSibling){
						iconElement.parentNode.insertBefore(document.createTextNode(" ") , iconElement.nextSibling)
					}
					else{
						iconElement.parentNode.appendChild(document.createTextNode(" "))
					}
				}
			})
		}
	}, [])

	const contentEditDiv = useRef()
	const insertKeyword = useCallback((keywordName)=>{
		if (!editingSelection){
			return
		}

		const editingTextNode = editingSelection.node

		if (editingTextNode === contentEditDiv.current){
			editingTextNode.appendChild(createKeywordHtmlElement(keywordName))
			editingTextNode.appendChild(document.createTextNode(translate(keywordName)))
		}
		else{
			const splitOffTextNode = editingTextNode.splitText(editingSelection.offset)
			splitOffTextNode.parentNode.insertBefore(createKeywordHtmlElement(keywordName), splitOffTextNode )
			splitOffTextNode.parentNode.insertBefore(document.createTextNode(" " + translate(keywordName)), splitOffTextNode )
		}
	}, [props.updateValue, editingSelection])

	const [contextId] = useState(Math.floor(Math.random()*1000000000000000).toString())

    return label(
        { className: "box edit-effect" },
        div(
			strong(
				props.label
			),
			" ",
			small(
				translate("insert_icon_instruction")
			)
        ),
        div(
            {className: "flex column gutter-b-2"},
            // div(
			// 	{ className: "grow-wrap box-12 gutter-trl-.5" },
			// 	textarea({
			// 		value: props.value,
			// 		onInput,
			// 		onClick: saveCursorPos,
			// 		className: "gutter-trbl-.5"
			// 	})
            // ),
			div(
				{className: "gutter-trbl-.5"},
				ContextMenuTrigger(
					{id: contextId},
					div({
						ref: contentEditDiv,
						contentEditable: true,
						className: "textarea box gutter-trbl-.5",
						"data-placeholder": translate("insert_icon_instruction"),
						onInput: onInput,
						onFocus: onInput,
						onBlur: onInput,
					}),
				),
			),
            // div(
			// 	{ className: "box-12 flex" },
			// 	Object.keys(keywords)
			// 		.filter((keywordName)=>{
			// 			return keywords[keywordName].length
			// 		})
			// 		.map(keywordName=>{
			// 			return div(
			// 				{ className: "box-2 flex vhcenter", key: keywordName },
			// 				KeywordImageCheck({
			// 					isChecked: true,
			// 					onClick: ()=>insertKeyword(keywordName),
			// 					keywordName,
			// 				})
			// 			)
			// 		})
            // )
        ),
		ContextMenu(
			{id: contextId},
			Object.keys(keywords)
				.filter((keywordName)=>{
					return keywords[keywordName].length
				})
				.sort()
				.map(keywordName=>{
					return MenuItem(
						{ 
							onClick: ()=>insertKeyword(keywordName),
							key: keywordName
						},
						div(
							{
								className: "flex vend"
							},
							KeywordIcon({name: keywordName}),
							translate(keywordName)
						)
					)
				})
		)
    )
}

function createKeywordHtmlElement(keywordName){
	const icons = keywords[keywordName]
	const wrapper = document.createDocumentFragment()
	// wrapper.classList.add("keyword-icon-wrapper")
	// wrapper.dataset.keywordName = keywordName
	// wrapper.style.width = "1em"
	// wrapper.style.height = (icons.length || 1) + "em"

	icons.forEach(iconFile=>{
		const img = document.createElement("img");
		img.classList.add("keyword-img")
		wrapper.appendChild(img)

		datauri(`/Assets/keyword/${iconFile}`).then(iconUri=>{
			img.src = iconUri
		})
	})

	// const iconsFetch = icons.map(iconFile=>datauri(`/Assets/keyword/${iconFile}`))
	// Promise.all(iconsFetch).then((iconUris)=>{
	// 	iconUris.forEach(iconUri=>{
	// 		const iconImage = document.createElement("div")
	// 		iconImage.classList.add("keyword-icon")
	// 		iconImage.style.backgroundImage = `url(${iconUri})`

	// 		wrapper.appendChild(iconImage)
	// 	})
	// })

	return wrapper
}

function KeywordIconComponent(props){
    const [iconsUri, updateIconsUri] = useState([])
	useEffect(()=>{
		const icons = keywords[props.name]
		const iconsFetch = icons.map(iconFile=>datauri(`/Assets/keyword/${iconFile}`))
        Promise.all(iconsFetch).then(updateIconsUri)
	}, [props.name])

	return div(
		{
			contentEditable: false,
			className: "keyword-icon-wrapper",
			"data-keyword-name": props.name,
			style: {
				height: "1em",
				width: iconsUri.length + "em",
			}
		}, 
		iconsUri.map((uri, index)=>div({
			key: index,
			className: "keyword-icon",
			style: {
				backgroundImage: `url(${uri})`
			}
		}))
	)
}
const KeywordIcon = factory(KeywordIconComponent)

export function stringSplice(string, start, delCount, newSubStr) {
	return string.slice(0, start) + newSubStr + string.slice(start + Math.abs(delCount));
};

export default factory(EditEffectComponent, cssLoaded)
