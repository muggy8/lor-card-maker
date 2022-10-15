import { Globals } from "/Views/index.js"
import { useContext } from "/cdn/react" 


export default function useLang(){
    const globals = useContext(Globals)
    return function(translationString){
        const languageObject = lang[globals.state.lang || "en"]
        if (!languageObject){
            return translationString
        }
        const translatedText = languageObject[translationString]
        if (!translatedText){
            return translationString
        }
        return translatedText
    }
}

const lang = {
    "en": {
        "lor_card_maker": "LoR Card Maker App",
        "i_want_to_make": "I want to create a...",
        "champ1": "Champion Lv 1",
        "champ2": "Champion Lv 2",
        "champ3": "Champion Lv 3",
        "landmark": "Landmark",
        "spell": "Spell",
        "follower": "Follower",
        "keyword": "Keyword",
        "beta": "(Beta)",
        "i_want_to_edit": "I want to edit...",
        "edit": "Edit",
        "batch_export": "Batch Card Export",
        "batch_delete": "Batch Card Delete",
        "export_save": "Export Save Data",
        "import_save": "Import Save Data",
        "report_bug": "Report Bug",
        "no_export_selected": "You haven't selected anything to export yet...",
        "export_selection": "Export Selection",
        "delete_selected": "Delete Selected",
        "select_exports": "Select Exports",
        "include": "Include",
        "delete_card": "Delete Card",
        "delete_keyword": "Delete Keyword",
        "save_card": "Save Card",
        "save_keyword": "Save Keyword",
        "export": "Export",
        "card_configs": "Card Configs",
        "faction": "Faction",
        "rarity": "Rarity",
        "mana_cost": "Mana Cost",
        "power": "Power",
        "health": "Health",
        "name": "Name",
        "artist": "Artist",
        "clan": "Clan (Celestial, Dragon, etc)",
        "effect": "Effect",
        "key_symbol_effect": "Key Symobols to insert into effect text",
        "lv_up": "Level Up Condition",
        "key_symbol_lv_up": "Key Symobols to insert into level up text",
        "select_keyword": "Select Keywords",
        "frame_type": "Card Frame Type",
        "other_card_mentioned": "Other Cards Mentioned in Effect",
        "other_card_example": "(Gem, Pack Your Bags, etc)",
        "key_text_mentioned": "Key Text mentioned in Effect",
        "key_text_example": "(Strike, Round Start, etc)",
        "add_mention": "Add Mention",
        "card_art": "Card Art",
        "upload_image": "Upload Image",
        "or_enter_image_url": "or enter image URL",
        "image_url": "image URL",
        "gem": "Gem",
        "gemless": "Gemless",
        "common": "Common",
        "rare": "Rare",
        "epic": "Epic",
        "none": "None",
        "slow": "Slow",
        "fast": "Fast",
        "burst": "Burst",
        "focus": "Focus",
        "equipment": "Equipment",
    }
}