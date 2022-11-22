import factory from "/Utils/elements.js"
import { ContextMenuTrigger, ContextMenu, MenuItem } from '/cdn/react-contextmenu';
export const contextMenuTrigger = factory(ContextMenuTrigger)
export const contextMenu = factory(ContextMenu)
export const contextMenuItem = factory(MenuItem)

export function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
