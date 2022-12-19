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
        "lor_card_maker": "LoR Card Maker",
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
        "no_export_selected": "You haven't selected anything to export yet.",
        "scroll_down_for_selection": "Scroll Down to see selection.",
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
        "rarity": "Rarity",
        "mana_cost": "Mana Cost",
        "power": "Power",
        "health": "Health",
        "name": "Name",
        "artist": "Artist",
        "clan": "Sub-Type (Celestial, Dragon, etc)",
        "effect": "Effect",
        "key_symbol_effect": "Key Symobols to insert into effect text",
        "lv_up": "Level Up Condition",
        "key_symbol_lv_up": "Key Symobols to insert into level up text",
        "select_keyword": "Select Keywords",
        "frame_type": "Card Frame Type",
        "other_card_mentioned": "Other Cards Named in Effect",
        "other_card_example": "(Gem, Pack Your Bags, etc)",
        "key_text_mentioned": "Key Text Used in Effect",
        "key_text_example": "(Strike, Round Start, etc)",
        "add_mention": "+1 Mention",
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
        "silence": "Silence",
        "trigger": "Trigger",
        "imbue": "Imbue",
        "new": "New",
        "edit_shade": "Edit Card Art Shade",
        "min": "Min",
        "max": "Max",
        "fade_location": "Fade Location",
        "fade_start": "Fade Start",
        "fade_end": "Fade End",
        "shade_darkness": "Shade Darkness",
        "blur_strength": "Blur Stength",
        "region": "Region",
        "speed": "Speed",
        "unlock_art_movement": "🔒 Unlock Art Movement",
        "lock_art_movement": "🔓 Lock Art Movement",
        "default_bg_show": "Show Default Background",
        "default_bg_hide": "Hide Default Background",
        "insert_icon_instruction": "Right-Click or Long-Press to insert icons",

        "attune": "Attune",
        "attach": "Attach",
        "augment": "Augment",
        "fleeting": "Fleeting",
        "scout": "Scout",
        "barrier": "Barrier",
        "deep": "Deep",
        "frostbite": "Frostbite",
        "skill": "Skill",
        "double attack": "Double Attack",
        "last breath":"Last Breath",
        "can't attack": "Can't Attack",
        "elusive": "Elusive",
        "lifesteal": "Lifesteal",
        "stun": "Stun",
        "can't block": "Can't Block",
        "ephemeral": "Ephemeral",
        "overwhelm": "Overwhelm",
        "tough": "Tough",
        "capture": "Capture",
        "quick attack": "Quick Attack",
        "vulnerable": "Vulnerable",
        "challenger": "Challenger",
        "fearsome": "Fearsome",
        "regeneration": "Regeneration",
        "spellshield": "Spellshield",
        "fury": "Fury",
        "focus": "Focus",
        "formidable": "Formidable",
        "lurk": "Lurk",
        "impact": "Impact",
        "fated": "Fated",
        "evolve": "Evolve",
        "hallowed": "Hallowed",
        "equipment": "Equipment",
        "immobile": "Immobile",
        "trap": "Trap",
        "boon": "Boon",
        "silence": "Silence",
        "trigger": "Trigger",
        // "impact": ["impactn.png"],
        "imbue": "Imbue",

        "oled": "Black",
        "dark": "Dark",
        "light": "Light",
        "flash-bomb": "Flash Bomb",
        "theme": "Theme",
        "install_app": "Install On This Device",
        "keyword_icon": "Keyword Icon",
        "upload_icon": "Upload Icons",
        "create_icon": "Create Icon From Template",
        "base_icon": "Base Icon",
        "select_base_icon": "Select Base Icon...",
        "hue_rotation": "Hue",
        "contrast": "Contrast",
        "sepia": "Sepia",
        "brightness": "Brightness",
        "saturation": "Saturation",
        "or": "Or",
        "use_icon": "Use Icon",
        "icons": "Icons",
        "cancel": "Cancel",
        "warn_ios": "It looks like you're using an iOS device, browsing with Safari, or both. iOS and Safari are not fully supported.",
        "ok": "Ok",
        "filter": "Filter",
        "card_text": "Card Text",
        "collectible": "Collectible",
        "yes": "Yes",
        "no": "No",
        "card_type": "Card Type",
        "refresh_rito_data": "Refresh Riot Data",
        "load_rito_data": "Load Riot Data",
    }
}
