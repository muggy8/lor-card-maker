import factory, { div, label, strong, textarea } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState } from "/cdn/react"
import { keywords } from "/Components/card-template/keyword-renderer.js"
import { KeywordImageCheck } from "/Components/card-config/edit-keywords.js"

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

    return label(
        { className: "box" },
        div(
			strong(
				props.label
			)
        ),
        div(
            {className: "flex gutter-b-2"},
            div(
				{ className: "grow-wrap box-12 gutter-trl-.5" },
				textarea({
					value: props.value,
					onInput,
					onClick: saveCursorPos,
					className: "gutter-trbl-.5"
				})
            ),
            div(
				{ className: "box-12 flex" },
				Object.keys(keywords)
					.filter((keywordName)=>{
						return keywords[keywordName].length
					})
					.map(keywordName=>{
						return div(
							{ className: "box-2 flex vhcenter", key: keywordName },
							KeywordImageCheck({
								isChecked: true,
								onClick: ()=>insertKeyword(keywordName),
								keywordName,
							})
						)
					})
            )
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

export function stringSplice(string, start, delCount, newSubStr) {
	return string.slice(0, start) + newSubStr + string.slice(start + Math.abs(delCount));
};

export default factory(EditEffectComponent)
