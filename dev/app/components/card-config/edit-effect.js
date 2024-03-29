import factory, { div, label, strong, small, fragment } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useRef, useEffect, useContext } from "/cdn/react"
import { keywords } from "/Components/card-template/keyword-renderer.js"
// import { KeywordImageCheck } from "/Components/card-config/edit-keywords.js"
import loadCss from "/Utils/load-css.js"
import datauri from "/Utils/datauri.js"
import useCallbackDebounce from "/Utils/use-debounce-callback.js"
import { Globals } from "/Views/index.js"
import {ContextMenu, ContextMenuItem, useContextMenu} from '/cdn/usecontextmenu-react'
import useAssetCache from "/Utils/use-asset-cache.js"

const cssLoaded = loadCss("/Components/card-config/edit-effect.css")
const contextMenu = factory(ContextMenu)
const contextMenuItem = factory(ContextMenuItem)

function EditEffectComponent(props){
    const translate = useLang()
	const { customKeywords } = useContext(Globals)

	const contentEditDiv = useRef()

	useEffect(()=>{
		// this task is only done once when this component loads input for the very first time

		if (!props.value ){
			return
		}

		if (contentEditDiv.current && contentEditDiv.current.innerText){
			return
		}

		contentEditDiv.current.replaceChildren(generateEditableContent(props.value, customKeywords))
	}, [!!props.value])

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
				selectedText: selectedNode instanceof Text && editingRange.focusOffset !== editingRange.anchorOffset
					? selectedNode.textContent.substring(editingRange.anchorOffset, editingRange.focusOffset)
					: undefined
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

		updateValue()
	}, [updateValue])

	const insertOrangeWord = useCallback((wordToInsert)=>{
		if (!editingSelection){
			return
		}

		wordToInsert = wordToInsert.trim()

		const alreadyInList = props.orangeWords.reduce((assumption, existingWord)=>{
			return assumption || existingWord === wordToInsert
		}, false)

		if (!alreadyInList){
			props.updateOrangeWords([...props.orangeWords, wordToInsert])
		}
	}, [editingSelection, props.orangeWords, props.updateOrangeWords])

	const insertBlueeWord = useCallback((wordToInsert)=>{
		if (!editingSelection){
			return
		}

		wordToInsert = wordToInsert.trim()

		const alreadyInList = props.blueWords.reduce((assumption, existingWord)=>{
			return assumption || existingWord === wordToInsert
		}, false)

		if (!alreadyInList){
			props.updateBlueWords([...props.blueWords, wordToInsert])
		}
	}, [editingSelection, props.blueWords, props.updateBlueWords])

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

	const insertCustomKeyword = useCallback((customKeyword)=>{
		if (!editingSelection){
			return
		}

		const editingTextNode = editingSelection.node
		const keywordLabel = customKeyword.name

		if (editingTextNode instanceof HTMLDivElement){
			editingTextNode.appendChild(createKeywordHtmlElement(customKeyword.id, customKeyword.icons))
			editingTextNode.appendChild(document.createTextNode(keywordLabel))
		}
		else if (editingTextNode instanceof Text){
			const splitOffTextNode = editingTextNode.splitText(editingSelection.offset)
			splitOffTextNode.parentNode.insertBefore(createKeywordHtmlElement(customKeyword.id, customKeyword.icons), splitOffTextNode )
			splitOffTextNode.parentNode.insertBefore(document.createTextNode(keywordLabel), splitOffTextNode )
		}
		else{
			editingTextNode.after(createKeywordHtmlElement(customKeyword.id, customKeyword.icons), document.createTextNode(keywordLabel))
		}

		const alreadyInList = props.orangeWords.reduce((assumption, existingWord)=>{
			return assumption || existingWord === keywordLabel
		}, false)

		if (!alreadyInList){
			props.updateOrangeWords([...props.orangeWords, keywordLabel])
		}

		updateValue()
	}, [props.updateValue, editingSelection, props.orangeWords, props.updateOrangeWords, updateValue])

	const {menuProps, onContextMenu, visibleOnPosition} = useContextMenu()
	const [menuOpen, updateMenuOpen] = useState(false)
	const onKeyPress = useCallback((ev)=>{
		onInput(ev)
		updateMenuOpen(false)
	}, [onInput])

	const onInputCallback = useRef()
	onInputCallback.current = onInput
	useEffect(()=>{
		function closeMenu (){
			updateMenuOpen(false)
		}

		function selectionChangeed (){
			onInputCallback.current && onInputCallback.current()
		}

		document.addEventListener('scroll', closeMenu)
		window.addEventListener('resize', closeMenu)
		document.addEventListener('click', closeMenu)
		document.addEventListener("selectionchange", selectionChangeed)

		return function(){
			document.removeEventListener('scroll', closeMenu)
			window.removeEventListener('resize', closeMenu)
			document.removeEventListener('click', closeMenu)
			document.removeEventListener("selectionchange", selectionChangeed)
		}
	}, [])

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
				div({
					ref: contentEditDiv,
					contentEditable: true,
					className: "textarea box gutter-trbl-.5",
					"data-placeholder": translate("insert_icon_instruction"),
					onInput: onKeyPress,
					onFocus: onInput,
					onBlur: onInput,
					onContextMenu: (...args)=>{
						onContextMenu(...args)
						updateMenuOpen(true)
					},
				}),
			),
        ),
		contextMenu(
			{
				...menuProps,
				visible: menuOpen,
			},
			editingSelection && editingSelection.selectedText
				? fragment(
					contextMenuItem(
						{
							onClick: ()=>insertOrangeWord(editingSelection.selectedText),
							className: "orange-text"
						},
						editingSelection.selectedText
					),
					contextMenuItem(
						{
							onClick: ()=>insertBlueeWord(editingSelection.selectedText),
							className: "blue-text"
						},
						editingSelection.selectedText
					),
				)
				: undefined
			,
			Object.keys(keywords)
				.filter((keywordName)=>{
					return keywords[keywordName].length
				})
				.sort()
				.map(keywordName=>{
					return contextMenuItem(
						{
							key: keywordName,
							onClick: ()=>insertKeyword(keywordName),
						},
						div({ className: "flex vend orange-text" }, 
							KeywordIcon({name: keywordName}),
							translate(keywordName)
						),
					)
				})
			,
			customKeywords
				.filter(customKeyword=>customKeyword.icons && customKeyword.icons.length)
				.map(customKeyword=>{
					return contextMenuItem(
						{
							key: customKeyword.id,
							onClick: ()=>insertCustomKeyword(customKeyword),
							className: "flex vend",
							preventClose: true,

						},
						KeywordIcon({icons: customKeyword.icons}),
						customKeyword.name
					)
				})
			,
		)
		,
    )
}

function createKeywordHtmlElement(keywordName, iconList){
	const icons = iconList || keywords[keywordName]
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

		datauri(
			iconList
				? iconFile
				: `/Assets/keyword/${iconFile}`
		).then(iconUri=>{
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
	const iconsUri = useAssetCache(updateIconsUri=>{
		// props.icons has priority and props.name is fallback as all icons are expected to have a name
		if (props.icons){ 
			const iconsFetch = props.icons.map(iconUrl=>datauri(iconUrl))
			Promise.all(iconsFetch).then(updateIconsUri)
		}
		else if (props.name){
			const icons = keywords[props.name]
			const iconsFetch = icons.map(iconFile=>datauri(`/Assets/keyword/${iconFile}`))
			Promise.all(iconsFetch).then(updateIconsUri)
		}
	}, [props.name, props.icons], [])

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

		if (child instanceof Image){
			if (child.nextSibling instanceof Image && child.nextSibling.dataset.keywordName === child.dataset.keywordName){
				skipThis = true
			}
			return `<${child.dataset.keywordName}/>`
		}

		if (child instanceof Text){
			return child.textContent
		}

		if (child instanceof HTMLBRElement){
			return "\n"
		}

		if (child instanceof HTMLDivElement){
			return "\n" + generateSaveableEffectText(child)
		}

		return generateSaveableEffectText(child)
	})

	return textBits.join("")
}

const keywordWithIcons = Object.keys(keywords).filter(word=>keywords[word].length)
function generateEditableContent(text, customKeywords){
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

	customKeywords.forEach(customKeyword=>{
		const wordTag = `<${customKeyword.id}/>`
		contentArray = contentArray.map(textOrElement=>{
			if (typeof textOrElement !== "string"){
				return textOrElement
			}

			let splitUpText = textOrElement.split(wordTag)

			if (splitUpText.length === 1){
				return splitUpText[0]
			}

			for(let i = splitUpText.length - 1; i; i--){
				splitUpText.splice(i, 0, createKeywordHtmlElement(customKeyword.id, customKeyword.icons))
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
