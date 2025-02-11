import { getRitoPoCItemRelic, patchRitoPocItemRelic, getLatestPoCItemRelicData } from "/Utils/service.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import useFilter, { mergeDeep } from "/Utils/use-filter.js"
import { useState, useCallback, useEffect, useMemo, useContext } from "/cdn/react"
import getFilterOptionsFromCardsList from "/Components/deck/hooks/get-filter-options-form-card-list.js"
import { Globals } from "/Views/index.js"

export default function useRitoPocStickers(){
	const [ritoPocItemRelics, updateRitoPoCItemReics] = useState({items: [], relics: []})
    const globalState = useContext(Globals)
	useEffect(()=>{
		getRitoPoCItemRelic({}, {items: [], relics: []})
            .then(updateRitoPoCItemReics)
	}, [])

	const [ritoPoCLoading, updateRitoPoCLoading] = useState(false)
	const refreshRitoPocItemRelics = useCallback(()=>{
		if (ritoPoCLoading){
            return
        }
		updateRitoPoCLoading(true)
		getLatestPoCItemRelicData({}, globalState.state.settings.lang).then(async ritoPocData => {
			await patchRitoPocItemRelic(ritoPocData)
			updateRitoPoCItemReics(ritoPocData)
			updateRitoPoCLoading(false)
		})
	}, [ritoPoCLoading])

    const [filteredItems, updateItemSource, currentItemFilters, patchItemFilters] = useFilter({
        name: {
            filter: (userSelectedName, name)=>{
                if (!userSelectedName){
                    return true
                }
                return name.toLowerCase().includes(userSelectedName.toLowerCase())
            }
        },
        descriptionRaw: {
            filter: (userSelectedDescription, descriptionRaw)=>{
                if (!userSelectedDescription){
                    return true
                }
                return descriptionRaw.toLowerCase().includes(userSelectedDescription .toLowerCase())
            }
        },
        rarity: {
            filter: (userSelectedRarities, rarity)=>{
                if (!userSelectedRarities || !userSelectedRarities.length){
                    return true
                }
                return userSelectedRarities.includes(rarity)
            }
        },
    })
    useEffect(()=>{
        if (ritoPocItemRelics.items && ritoPocItemRelics.items.length){
            return updateItemSource(ritoPocItemRelics.items)
        }

        updateItemSource([])
    }, [ritoPocItemRelics.items])

    const itemsFilterOption = useAssetCache(updateFilterOptions=>{
		if (!ritoPocItemRelics.items || !ritoPocItemRelics.items.length){
			return
		}

		const baseOptions = getFilterOptionsFromCardsList(ritoPocItemRelics.items)
		updateFilterOptions(baseOptions)
	}, [ritoPocItemRelics.items], {})

    const patchItemFilter = useCallback((filterToPatch, patchSettings)=>{
        const patch = {}
        patch[filterToPatch] = patchSettings
        patchItemFilters(patch)
    }, [patchItemFilters])

    const [filteredRelics, updateRelicSource, currentRelicFilters, patchRelicFilters] = useFilter({
        name: {
            filter: (userSelectedName, name)=>{
                if (!userSelectedName){
                    return true
                }
                return name.toLowerCase().includes(userSelectedName.toLowerCase())
            }
        },
        descriptionRaw: {
            filter: (userSelectedDescription, descriptionRaw)=>{
                if (!userSelectedDescription){
                    return true
                }
                return descriptionRaw.toLowerCase().includes(userSelectedDescription .toLowerCase())
            }
        },
        rarity: {
            filter: (userSelectedRarities, rarity)=>{
                if (!userSelectedRarities || !userSelectedRarities.length){
                    return true
                }
                return userSelectedRarities.includes(rarity)
            }
        },
    })
    useEffect(()=>{
        if (ritoPocItemRelics.relics && ritoPocItemRelics.relics.length){
            return updateRelicSource(ritoPocItemRelics.relics)
        }

        updateRelicSource([])
    }, [ritoPocItemRelics.relics])

    const relicsFilterOption = useAssetCache(updateFilterOptions=>{
		if (!ritoPocItemRelics.relics || !ritoPocItemRelics.relics.length){
			return
		}

		const baseOptions = getFilterOptionsFromCardsList(ritoPocItemRelics.relics)
		updateFilterOptions(baseOptions)
	}, [ritoPocItemRelics.relics], {})

    const patchRelicFilter = useCallback((filterToPatch, patchSettings)=>{
        const patch = {}
        patch[filterToPatch] = patchSettings
        patchRelicFilters(patch)
    }, [patchRelicFilters])

    const patchFilters = useCallback(function(){
        patchItemFilters.call(this, ...arguments)
        patchRelicFilters.call(this, ...arguments)
    }, [patchItemFilters, patchRelicFilters])
    
    const patchFilter = useCallback(function(){
        patchItemFilter.call(this, ...arguments)
        patchRelicFilter.call(this, ...arguments)
    }, [patchItemFilter, patchRelicFilter])

    const filterOptions = useMemo(()=>{
        return mergeDeep({}, itemsFilterOption, relicsFilterOption)
    }, [itemsFilterOption, relicsFilterOption])

    const currentFilters = useMemo(()=>{
        return mergeDeep({}, currentItemFilters, currentRelicFilters)
    }, [currentItemFilters, currentRelicFilters])

    return {
        item: {
            list: ritoPocItemRelics.items,
            filteredList: filteredItems,
            currentFilters: currentItemFilters,
            patchFilter: patchItemFilter,
            patchFilters: patchItemFilters,
            filterOptions: itemsFilterOption
        },
        relic: {
            list: ritoPocItemRelics.relics,
            filteredList: filteredRelics,
            currentFilters: currentRelicFilters,
            patchFilter: patchRelicFilter,
            patchFilters: patchRelicFilters,
            filterOptions: relicsFilterOption,
        },
        refreshList: refreshRitoPocItemRelics,
        loading: ritoPoCLoading,
        currentFilters,
        patchFilter,
        patchFilters,
        filterOptions,
    }
}