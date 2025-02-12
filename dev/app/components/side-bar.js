import factory, { div, span, label, a, input, nav, select, option, fragment } from "/Utils/elements.js"
import { useCallback, useState, useRef, useContext, useEffect } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"
import useLang, { SUPPORTED_LANGUAGES } from "/Utils/use-lang.js"
import { getBackup, saveCard } from "/Utils/service.js"
import BatchExport from "/Views/batch-export.js"
import useToggle from "/Utils/use-toggle.js"
import { jsonToBlob } from "/Components/export.js"
import BatchDelete from "/Views/batch-delete.js"


const cssLoaded = loadCss("/Components/side-bar.css")

const themeClassNames = [
    "oled", "dark", "light", "flash-bomb"
]

const exportFormat = [
    "png",
    "webp",
    "jpeg",
    "json",
    "svg",
]

function SidebarComponent(){
    const translate = useLang()

    const globalState = useContext(Globals)
    const lowSpecsMode = globalState.state.settings.lowSpecsMode === true

    useEffect(()=>{
        document.body.classList.remove(...document.body.classList)
        document.body.classList.add(globalState.state.settings.theme)
    }, [globalState.state.settings])

    const [opened, updateOpened] = useState(false)
    const toggleOpened = useCallback(()=>{
        updateOpened(!opened)
    }, [opened])

    const bugReportlink = useRef()

    const exportData = useCallback(async ()=>{
        const backup = await getBackup()

        const output = JSON.stringify(backup)

        downloadFile(jsonToBlob(output), "card-data.json")
    }, [])

    const [isImporting, _toggleIsImporting, setIsImporting] = useToggle(false)
    const importData = useCallback(async ev=>{
        setIsImporting(true)
        const loadedData = await new Promise(accept=>{
            let reader = new FileReader()
            let file = ev.target.files[0]

            reader.addEventListener("load", ()=>{
                let json = JSON.parse(reader.result)
                accept(json)
            })

            if (file){
                reader.readAsText(file)
            }
        })

        // step 1: handle v1 data if needed
        const v1DataToImport = [
            {
                key: "savedChampions1",
                type: "champion1"
            },
            {
                key: "savedChampions2",
                type: "champion2"
            },
            {
                key: "savedChampions3",
                type: "champion3"
            },
            {
                key: "savedFollowers",
                type: "follower"
            },
            {
                key: "savedKeywords",
                type: "keyword"
            },
            {
                key: "savedLandmarks",
                type: "landmark"
            },
            {
                key: "savedSpells",
                type: "spell"
            },
        ]
            .map(placeToCheck=>{
                if (!loadedData[placeToCheck.key]){
                    return []
                }

                return loadedData[placeToCheck.key]
                    .map(({id, cardData})=>{
                        cardData.id = id
                        cardData.type = placeToCheck.type
                        if (cardData.rarity === "gemless" || cardData.rarity === "none"){
                            cardData.rarity = ""
                        }
                        cardData.dataVersion = 2

                        return cardData
                    })
            })
            .flat()

        // step 2: get v2 data
        const v2DataToImport = loadedData.cards ? loadedData.cards.filter(cardData=>cardData.dataVersion === 2) : [] 

        ;[...v1DataToImport, ...v2DataToImport].forEach(cardToImport=>{
            if (!Object.prototype.hasOwnProperty.call(cardToImport, "clan")){
                return
            }

            if (Array.isArray(cardToImport.clan)){
				return
			}

			if (cardToImport.clan){
				cardToImport.clan = [cardToImport.clan]
			}
			else{
				cardToImport.clan = []
			}
        })

        // step 3: merge the updated v1 data and the v2 data
        const allDataToImport = [...v1DataToImport, ...v2DataToImport]

        // save the data. we use the slow for loop version here as to not overload the storge and to perserve ordering
        for(let cardData of allDataToImport){
            await saveCard(cardData.id, cardData)
        }

        setIsImporting(false)
        // the simplest way of getting the new data to show up in the UI. Probably should change this later XD
        document.location.reload()
    })

    const focusBatchExport = useCallback(()=>{
        globalState.setView(BatchExport)
        updateOpened(false)
    }, [globalState.setView])

    const focusBatchDelete = useCallback(()=>{
        globalState.setView(BatchDelete)
        console.log("batch delete time")
        updateOpened(false)
    }, [globalState.setView])

    return fragment(
        div({ 
            className: `side-bar-backdrop ${opened ? "open" : ""}`,
            onClick: toggleOpened
        }),
        nav(
            { className: `side-bar card-text-universe gutter-rl-3 flex column vhcenter ${opened ? "open" : ""}` },
            div(
                {
                    className: "menu-icon flex vhcenter",
                    onClick: toggleOpened
                },
                div({className: `icon clickable ${lowSpecsMode ? "" : "animated"} ${opened ? "multiply" : "menu"}` }),
            ),
            div(
                { className: "menu-contents gutter-tb-2" },
                label(
                    {
                        className: "menu-option clickable gutter-tb",
                    },
                    div( translate("theme") ),
                    select(
                        {
                            value: globalState.state.settings.theme || "oled",
                            onChange: ev=>globalState.patchSettings({theme: ev.target.value}),
                            className: "select-theme gutter-rl-1 gutter-tb-.5"
                        },
                        themeClassNames.map(className=>{
                            return option(
                                {
                                    key: className,
                                    value: className
                                },
                                translate(className)
                            )
                        })
                    ),
                ),
                label(
                    {
                        className: "menu-option clickable gutter-tb",
                    },
                    div( translate("language") ),
                    select(
                        {
                            value: globalState.state.settings.lang || "oled",
                            onChange: ev=>globalState.patchSettings({lang: ev.target.value}),
                            className: "select-theme gutter-rl-1 gutter-tb-.5"
                        },
                        SUPPORTED_LANGUAGES.map(languageKey=>{
                            return option(
                                {
                                    key: languageKey,
                                    value: languageKey
                                },
                                translate(languageKey)
                            )
                        })
                    ),
                ),
                label(
                    {
                        className: "menu-option clickable gutter-tb",
                    },
                    div( translate("export_format") ),
                    select(
                        {
                            value: globalState.state.settings.exportFormat || "png",
                            onChange: ev=>globalState.patchSettings({exportFormat: ev.target.value}),
                            className: "select-theme gutter-rl-1 gutter-tb-.5"
                        },
                        exportFormat.map(mode=>{
                            return option(
                                {
                                    key: mode,
                                    value: mode
                                },
                                translate(mode)
                            )
                        })
                    ),
                ),
                div(
                    { className: "menu-option clickable gutter-tb", onClick: focusBatchExport },
                    translate("batch_export")
                ),
                div(
                    { className: "menu-option clickable gutter-tb", onClick: focusBatchDelete },
                    translate("bulk_delete")
                ),
                div(
                    { className: "menu-option clickable gutter-tb", onClick: exportData },
                    translate("export_save")
                ),
                label(
                    { className: "menu-option clickable gutter-tb" },
                    isImporting ? undefined : translate("import_save"),
                    isImporting ? undefined : input({
                        className: "hide",
                        accept: "application/json",
                        type: "file",
                        onChange: importData,
                    }),
                    isImporting 
                        ? div({className: "icon loading"}) 
                        : undefined
                    ,
                ),
                label(
                    { className: "menu-option clickable gutter-tb", onClick: ()=>{} },
                    div( translate("low_specs_mode") ),
                    select(
                        {
                            value: globalState.state.settings.lowSpecsMode || 0,
                            onChange: ev=>globalState.patchSettings({lowSpecsMode: !!parseInt(ev.target.value)}),
                            className: "select-theme gutter-rl-1 gutter-tb-.5"
                        },
                        option(
                            {
                                value: 1
                            },
                            translate("on")
                        ),
                        option(
                            {
                                value: 0
                            },
                            translate("off")
                        ),
                    ),
                ),
                label(
                    { className: "menu-option clickable gutter-tb", onClick: ()=>bugReportlink.current.click() },
                    translate("report_bug"),
                    a({
                        ref: bugReportlink,
                        href: "https://github.com/muggy8/lor-card-maker/issues",
                        className: "hide",
                        target: "_blank"
                    })
                ),
                label(
                    { className: "menu-option clickable gutter-tb", onClick: ()=>bugReportlink.current.click() },
                    translate("join_discord"),
                    a({
                        ref: bugReportlink,
                        href: "https://discord.gg/tKScJa6u6m",
                        className: "hide",
                        target: "_blank"
                    })
                ),
            )
        )
    )

}

async function downloadFile(contentBlob, fileName) {
    if (window.AndroidNativeInterface){
        const b64 = await new Promise(accept=>{
            var reader = new FileReader();
            reader.readAsDataURL(contentBlob); 
            reader.onloadend = function() {
                accept(reader.result);       
            }
        })
        const typeRegex = /data:([^;]+);(([^;]+);)*base64,/
        const [dataUriHeader, contentType] = typeRegex.exec(b64)

        const message = JSON.stringify({
			image: b64.substr(dataUriHeader.length),
			fileName
		})
		window.AndroidNativeInterface.postMessage(message)
    }
    else{
        var a = document.createElement("a");
        a.href = URL.createObjectURL(contentBlob);
        a.download = fileName;
        a.click();
    }
}

export default factory(SidebarComponent, cssLoaded)
