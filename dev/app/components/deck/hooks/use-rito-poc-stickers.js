import { getRitoPoCItemRelic, patchRitoPocItemRelic, getLatestPoCItemRelicData } from "/Utils/service.js"
import { useState, useCallback, useEffect } from "/cdn/react"


export default function useRitoPocStickers(){
	const [ritoPocItemRelics, updateRitoPoCItemReics] = useState({items: [], relics: []})
	useEffect(()=>{
		getRitoPoCItemRelic({}, {items: [], relics: []}).then(updateRitoPoCItemReics)
	}, [])

	const [ritoPoCLoading, updateRitoPoCLoading] = useState(false)
	const refreshRitoPocItemRelics = useCallback(()=>{
		if (ritoPoCLoading){
            return
        }
		updateRitoPoCLoading(true)
		getLatestPoCItemRelicData().then(async ritoPocData => {
			await patchRitoPocItemRelic(ritoPocData)
			updateRitoPoCItemReics(ritoPocData)
			updateRitoPoCLoading(false)
		})
	}, [ritoPoCLoading])

    return {
        ...ritoPocItemRelics,
        refreshList: refreshRitoPocItemRelics,
        loading: ritoPoCLoading,
    }
}