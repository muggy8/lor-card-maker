import factory, { fragment } from "/Utils/elements.js"
import React, { useContext, useState, useEffect } from "/cdn/react"
import { ContextMenuTrigger, ContextMenu, ContextMenuItem } from '/cdn/rctx-contextmenu';
export const contextMenuTrigger = factory(ContextMenuTrigger)
export const contextMenu = factory(ContextMenu)
export const contextMenuItem = factory(ContextMenuItem)

export function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function ContextMenuComponent(props){
	const [triggerId, updateTriggerId] = useState()
	useEffect(()=>{
		updateTriggerId(makeid(10))
	}, [])

	if (!triggerId){
		return null
	}

	return fragment(
		contextMenuTrigger(
			{
				id: triggerId,
				disabled: props.disabled,
			},
			props.children
		),
		
		contextMenu(
			{
				id: triggerId,
				appendTo: "body",
				className: props.className,
				animation: "pop",
			},
			props.menu
		)
	)
}
export default factory (ContextMenuComponent)
