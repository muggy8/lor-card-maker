import { Globals } from "/Views/index.js"
import { useContext } from "/cdn/react"
import { markdown } from "/Utils/elements.js"

export default function useLang(){
    const globals = useContext(Globals)

    const translations = globals.translations

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
        const backupLanguageObject = translations["en_us"]
        const desiredLanguageObject = translations[globals.state.lang || "en_us"]
        let translatedText = translationString
        backupLanguageObject && Object.prototype.hasOwnProperty.call(backupLanguageObject, translationString) && (translatedText = backupLanguageObject[translationString])
        desiredLanguageObject && Object.prototype.hasOwnProperty.call(desiredLanguageObject, translationString) && (translatedText = desiredLanguageObject[translationString])

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
