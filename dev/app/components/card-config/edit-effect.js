import factory, { div, label, strong, small } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useRef, useEffect } from "/cdn/react"
import { keywords } from "/Components/card-template/keyword-renderer.js"
// import { KeywordImageCheck } from "/Components/card-config/edit-keywords.js"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import contextMenu from "/Components/context-menu.js"
import useCallbackDebounce from "/Utils/use-debounce-callback.js"

const cssLoaded = loadCss("/Components/card-config/edit-effect.css")

function EditEffectComponent(props){
    const translate = useLang()

	const contentEditDiv = useRef()

	const [beginEditing, updateBeginEditing] = useState(false)
	useEffect(()=>{
		// this task is only done once when this component loads input for the very first time

		if (!props.value || beginEditing){
			return
		}

		contentEditDiv.current.replaceChildren(generateEditableContent(props.value))
	}, [!!props.value, beginEditing])

	const updateValue = useCallbackDebounce(()=>{
		const saveableEffectText = generateSaveableEffectText(contentEditDiv.current)

		props.updateValue(saveableEffectText)
	}, 600, [props.updateValue])

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

		updateBeginEditing(true)
		updateValue()
	}, [updateValue])

	const insertKeyword = useCallback((keywordName)=>{
		if (!editingSelection){
			return
		}

		const editingTextNode = editingSelection.node
		const keywordLabel = translate(keywordName)

		if (editingTextNode instanceof HTMLDivElement){
			editingTextNode.appendChild(createKeywordHtmlElement(keywordName))
			editingTextNode.appendChild(document.createTextNode(keywordLabel))
		}
		else if (editingTextNode instanceof Text){
			const splitOffTextNode = editingTextNode.splitText(editingSelection.offset)
			splitOffTextNode.parentNode.insertBefore(createKeywordHtmlElement(keywordName), splitOffTextNode )
			splitOffTextNode.parentNode.insertBefore(document.createTextNode(keywordLabel), splitOffTextNode )
		}
		else{
			editingTextNode.after(createKeywordHtmlElement(keywordName), document.createTextNode(keywordLabel))
		}

		const alreadyInList = props.orangeWords.reduce((assumption, existingWord)=>{
			return assumption || existingWord === keywordLabel
		}, false)

		if (!alreadyInList){
			props.updateOrangeWords([...props.orangeWords, keywordLabel])
		}

		updateValue()
	}, [props.updateValue, editingSelection, props.orangeWords, props.updateOrangeWords, updateValue])

	//~ const [contextId] = useState(Math.floor(Math.random()*1000000000000000).toString())

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
            div(
				{className: "gutter-trbl-.5"},
				contextMenu(
					{
						className: "react-contextmenu",
						menu: Object.keys(keywords)
							.filter((keywordName)=>{
								return keywords[keywordName].length
							})
							.sort()
							.map(keywordName=>{
								return div(
									{
										onClick: ()=>insertKeyword(keywordName),
										key: keywordName,
										className: "react-contextmenu-item",
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

					},
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
        ),
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
		img.dataset.keywordName = keywordName
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

function generateSaveableEffectText(container){
	let skipThis = false
	const textBits = Array.prototype.map.call(container.childNodes, (child)=>{
		if (skipThis){
			skipThis = false
			if (
				child instanceof Image && 
				child.nextSibling instanceof Image && 
				child.nextSibling.dataset.keywordName === child.dataset.keywordName
			){
				skipThis = true
			}

			return ""
		}

		if (child instanceof HTMLDivElement){
			return "\n" + generateSaveableEffectText(child)
		}

		if (child instanceof Text){
			return child.textContent
		}

		if (child instanceof Image){
			if (child.nextSibling instanceof Image && child.nextSibling.dataset.keywordName === child.dataset.keywordName){
				skipThis = true
			}
			return `<${child.dataset.keywordName}/>`
		}
	})

	return textBits.join("")
}

const keywordWithIcons = Object.keys(keywords).filter(word=>keywords[word].length)
function generateEditableContent(text){
	let contentArray = [text]

	keywordWithIcons.forEach(word=>{
		const wordTag = `<${word}/>`
		contentArray = contentArray.map(textOrElement=>{
			if (typeof textOrElement !== "string"){
				return textOrElement
			}

			let splitUpText = textOrElement.split(wordTag)

			if (splitUpText.length === 1){
				return splitUpText[0]
			}

			for(let i = splitUpText.length - 1; i; i--){
				splitUpText.splice(i, 0, createKeywordHtmlElement(word))
			}

			return splitUpText
		}).flat()
	})

	contentArray = contentArray.map(textOrElement=>{
		if (typeof textOrElement !== "string"){
			return textOrElement
		}

		let splitUpText = textOrElement.split(/\n+/g)

		if (splitUpText.length === 1){
			return splitUpText[0]
		}

		for(let i = splitUpText.length - 1; i; i--){
			splitUpText.splice(i, 0, document.createElement("br"))
		}

		return splitUpText
	}).flat()

	const wrapper = document.createDocumentFragment()
	contentArray = contentArray.forEach(textOrElement=>{
		if (typeof textOrElement !== "string"){
			return wrapper.appendChild(textOrElement)
		}

		wrapper.appendChild(new Text(textOrElement))
	})

	return wrapper
}

export default factory(EditEffectComponent, cssLoaded)
