import factory, { div, label, strong, small } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState, useRef } from "/cdn/react"
import { keywords } from "/Components/card-template/keyword-renderer.js"
import { KeywordImageCheck } from "/Components/card-config/edit-keywords.js"
import loadCss from "/Utils/load-css.js"

const cssLoaded = loadCss("/Components/card-config/edit-effect.css")

function EditEffectComponent(props){
    const translate = useLang()

    const [cursorPos, updateCursorPos] = useState({})

    const saveCursorPos = useCallback(ev=>{
		let cursorPos = getCursorPos(ev.target)
		cursorPos !== -1 && updateCursorPos(cursorPos)
	}, [])

	const onInput = useCallback((ev)=>{
		ev.target.parentNode.dataset.replicatedValue = ev.target.value
		saveCursorPos(ev)
		props.updateValue(ev.target.value)
	}, [props.updateValue])

	const insertKeyword = useCallback((keywordName)=>{
		if (cursorPos.start === cursorPos.end){
			const newEffect = stringSplice(props.value, cursorPos.start, 0, `<${keywordName}/>`)
			props.updateValue(newEffect)
		}
	}, [props.updateValue, cursorPos])

	const contentEditDiv = useRef()

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
				div({
					ref: contentEditDiv,
					contentEditable: true,
					className: "textarea box gutter-trbl-.5",
					"data-placeholder": translate("insert_icon_instruction")
				})
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
        )
    )
}

export function getCursorPos(input) {
	// function source: https://stackoverflow.com/questions/7745867/how-do-you-get-the-cursor-position-in-a-textarea
	if ("selectionStart" in input && document.activeElement == input) {
		return {
			start: input.selectionStart,
			end: input.selectionEnd
		};
	}
	else if (input.createTextRange) {
		var sel = document.selection.createRange();
		if (sel.parentElement() === input) {
			var rng = input.createTextRange();
			rng.moveToBookmark(sel.getBookmark());
			for (var len = 0;
					 rng.compareEndPoints("EndToStart", rng) > 0;
					 rng.moveEnd("character", -1)) {
				len++;
			}
			rng.setEndPoint("StartToStart", input.createTextRange());
			for (var pos = { start: 0, end: len };
					 rng.compareEndPoints("EndToStart", rng) > 0;
					 rng.moveEnd("character", -1)) {
				pos.start++;
				pos.end++;
			}
			return pos;
		}
	}
	return -1;
}

export function getContentEditablePos(editableDiv){
	// code from https://stackoverflow.com/questions/3972014/get-contenteditable-caret-position
	var caretPos = 0,
    sel, range;
	if (window.getSelection) {
		sel = window.getSelection();
		if (sel.rangeCount) {
		range = sel.getRangeAt(0);
		if (range.commonAncestorContainer.parentNode == editableDiv) {
			caretPos = range.endOffset;
		}
		}
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		if (range.parentElement() == editableDiv) {
		var tempEl = document.createElement("span");
		editableDiv.insertBefore(tempEl, editableDiv.firstChild);
		var tempRange = range.duplicate();
		tempRange.moveToElementText(tempEl);
		tempRange.setEndPoint("EndToEnd", range);
		caretPos = tempRange.text.length;
		}
	}
	return caretPos;
}

export function stringSplice(string, start, delCount, newSubStr) {
	return string.slice(0, start) + newSubStr + string.slice(start + Math.abs(delCount));
};

export default factory(EditEffectComponent, cssLoaded)
