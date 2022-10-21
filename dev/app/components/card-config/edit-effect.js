import factory, { div, label, strong, textarea } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useState } from "/cdn/react"

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
				{ className: "grow-wrap box-12" },
				textarea({
					value: props.value,
					onInput,
					onClick: saveCursorPos
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



export default factory(EditEffectComponent)
