import { Globals } from "/Views/index.js"
import { useContext } from "/cdn/react"
import { markdown } from "/Utils/elements.js"

export default function useLang(){
    const globals = useContext(Globals)
    return function(translationString, replacementsOrUseMarkdownToggle = false, useMarkdown = false){
        // clean up our input variables since the second 2 variables are optional in the most destructive way.
        let replacements = {}
        if (typeof replacementsOrUseMarkdownToggle === "boolean"){
            useMarkdown = replacementsOrUseMarkdownToggle
        }
        else if (typeof replacementsOrUseMarkdownToggle === "object" && replacementsOrUseMarkdownToggle !== null){
            replacements = replacementsOrUseMarkdownToggle
        }

        // convert translation string into translated string
        const languageObject = lang[globals.state.lang || "en"]
        let translatedText = translationString
        languageObject && Object.prototype.hasOwnProperty.call(languageObject, translationString) && (translatedText = languageObject[translationString])

        translatedText = translatedText.replace(/\:([^\s]+)/gm, (matched, replacementKey)=>{
            if (Object.prototype.hasOwnProperty.call(replacements, replacementKey)){
                return replacements[replacementKey]
            }

            return matched
        })

        if (useMarkdown){
            return markdown(translatedText)
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
        "bulk_delete": "Bulk Card Delete",
        "export_save": "Export Save Data",
        "import_save": "Import Save Data",
        "report_bug": "Report Bug",
        "no_export_selected": "You haven't selected anything to export yet.",
        "scroll_down_for_selection": "Scroll Down to see selection.",
        "export_selection": "Export Selection",
        "share_selection": "Share Selection",
        "delete_selected": "Delete Selected",
        "select_exports": "Select Exports",
        "include": "Include",
        "delete_card": "Delete Card",
        "delete_deck": "Delete Deck",
        "delete_keyword": "Delete Keyword",
        "save_card": "Save Card",
        "save_deck": "Save Deck",
        "save_keyword": "Save Keyword",
        "export": "Export",
        "share": "Share",
        "card_configs": "Card Configs",
        "rarity": "Rarity",
        "mana_cost": "Mana Cost",
        "power": "Power",
        "health": "Health",
        "name": "Name",
        "artist": "Artist",
        "background_color": "Background Color",
        "text_background_color": "Text Background Color",
        "clan": "Sub-Type (Cultist, Dragon, etc)",
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
        "add_keyword": "Add Keyword",
        "hide_keyword_list": "Minimize Keyword List",
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
        "new_label": "New :cardType :betaIf",
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
        "unlock_shade_movement": "🔒 Unlock Artwork Shade Adjustments",
        "lock_shade_movement": "🔓 Lock Artwork Shade Adjustments",
        "default_bg_show": "Show Default Background",
        "default_bg_hide": "Hide Default Background",
        "insert_icon_instruction": "Right-Click or Long-Press to insert icons",
        "confirm_delete": "Are you sure youw ant to delete this card?",
        "join_discord": "Join Discord Server",
        "on": "On",
        "off": "Off",
        "low_specs_mode": "Low Specs Device Mode",

        "attune": "Attune",
        "attach": "Attach",
        "augment": "Augment",
        "brash": "Brash",
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
        "clear_filters": "Clear Filteres",
        "expantion": "Expantion",
        "official_cards": "Official Cards",
        "custom_cards": "Custom Cards",
        "currently_selected_cards": "Current Deck",
        "deck_size": "Deck Size",
        "deck": "Deck",
        "deck_name": "Deck Name",
        "about_deck_builder": "About Builder",
        "about_deck_builder_1": "## About",
        "about_deck_builder_2": "The Custom Card Deck Builder allows you to build any type of deck you want with custom cards and LoR's official cards. Many of the normal restrictions of deck building are also lifted such as region limit, deck size, no max copy of cards etc... This is to encourage non-standard deck building formats like PoC.",
        "about_deck_builder_3": "The data for official Legends of Runeterra cards comes not directly from Riot but instead from the github user [InFinity54](https://github.com/InFinity54). Without [InFinity54](https://github.com/InFinity54)'s [LoR Data Dragon repositories](https://github.com/InFinity54/LoR_DDragon), this feature would be impossible.",
        "about_deck_builder_4": "",
        "about_deck_builder_5": "",
        "search": "Search",
        "other_custom_card": "External Custom Card (or any image really)",
        "turn_poc_on": "Turn On PoC Icon Mode",
        "turn_poc_off": "Turn Off PoC Icon Mode",
        "poc_mode": "Path of Champions Mode",
        "larger_icon": "Increase Icon Size",
        "export_mode": "Share Mode",
        "export_format": "Share Format",
        "webp": "WebP",
        "png": "PNG",
        "jpeg": "Jpeg",
        "json": "JSON",
        "svg": "SVG",
        "new_tab": "New Tab",
        "download": "Download",
        "show_deck_stats": "Show Deck Stats",
        "associated_cards": "Associated Cards",
        "include_associated_cards": "Include Associated Cards In JSON Output",
        "relic": "Relic",
        "item": "Item",
        "power": "Power",
        "file_name": "File Name",
        "error": "Error",
        "error_loading_card": "Error Loading :cardName",
    }
}
