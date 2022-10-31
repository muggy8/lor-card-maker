import factory, { div, span, label, a, input } from "/Utils/elements.js"
import { useCallback, useState, useRef, useContext } from "/cdn/react" 
import { Globals } from "/Views/index.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import { getCardList, saveCard } from "/Utils/service.js"
import BatchExport from "/Views/batch-export.js"

const cssLoaded = loadCss("/Components/side-bar.css")

function SidebarComponent(){
    const translate = useLang()

    const globalState = useContext(Globals)

    const [opened, updateOpened] = useState(false)
    const toggleOpened = useCallback(()=>{
        updateOpened(!opened)
    }, [opened])

    const bugReportlink = useRef()

    const exportData = useCallback(async ()=>{
        const cards = await getCardList()

        cards.reverse()

        const output = JSON.stringify({cards})

        downloadFile(output, "card-data.json", "application/json")
    }, [])

    const importData = useCallback(async ev=>{
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

        // step 3: merge the updated v1 data and the v2 data
        const allDataToImport = [...v1DataToImport, ...v2DataToImport]

        // save the data. we use the slow for loop version here as to not overload the storge and to perserve ordering
        for(let cardData of allDataToImport){
            await saveCard(cardData.id, cardData)
        }

        // the simplest way of getting the new data to show up in the UI. Probably should change this later XD
        document.location.reload()
    })

    const focusBatchExport = useCallback(()=>{
        globalState.setView(BatchExport)
        updateOpened(false)
    }, [globalState.setView])

    return div(
        { className: `side-bar card-text-universe gutter-rl-3 flex column vhcenter ${opened ? "open" : ""}` },
        div(
            {
                className: "menu-icon flex vhcenter",
                onClick: toggleOpened
            },
            div({className: "icon animate clickable" }, 
                span({ className: opened ? "delete" : "menu" })
            ),
        ),
        div(
            { className: "menu-option clickable gutter-tb", onClick: focusBatchExport },
            translate("batch_export")
        ),
        div(
            { className: "menu-option clickable gutter-tb", onClick: exportData },
            translate("export_save")
        ),
        label(
            { className: "menu-option clickable gutter-tb" },
            translate("import_save"),
            input({
                className: "hide",
                accept: "application/json",
                type: "file",
                onChange: importData,
            }),
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
    )

}

function downloadFile(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

export default factory(SidebarComponent, cssLoaded)