import { useState, useCallback, useEffect, useContext } from "/cdn/react"
import { getRitoCards, patchRitoCards, getLatestRitoData } from "/Utils/service.js"
import useFilter from "/Utils/use-filter.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import getFilterOptionsFromCardsList from "/Components/deck/hooks/get-filter-options-form-card-list.js"
import { Globals } from "/Views/index.js"

export function getRitoCardsFromDataDump({sets}){
	if (!sets){
		return
	}

	const cards = sets.map(expantion=>expantion.data).flat()
	cards.sort((a,b)=>{
		if (a.rarityRef.toLowerCase() === "champion" && b.rarityRef.toLowerCase() !== "champion"){
			return -1
		}
		if (a.rarityRef.toLowerCase() !== "champion" && b.rarityRef.toLowerCase() === "champion"){
			return 1
		}

		const costDiff = a.cost - b.cost
		if (costDiff){
			return costDiff
		}

		const collectableDiff = b.collectible - a.collectible
		if (collectableDiff){
			return collectableDiff
		}

		const nameDif = a.name.localeCompare(b.name)
		if (nameDif){
			return nameDif
		}

		return 0
	})

	return cards
}

export default function useFilterableRitoCardList(knownCards){
    const [ritoCards, updateRitoCards] = useState()
	const globalState = useContext(Globals)

	useEffect(()=>{
		getRitoCards().then(ritoData=>{
			let ritoCards
			updateRitoCards(ritoCards = getRitoCardsFromDataDump(ritoData))
			ritoCards.forEach(card=>{
				if (!card){
					return
				}

				knownCards.current[card.cardCode] = card
			})
		})
	}, [])

    const [ritoLoading, updateRitoLoading] = useState(false)
	const loadRitoData = useCallback(()=>{
		if (ritoLoading){
            return
        }
		updateRitoLoading(true)
		getLatestRitoData({}, globalState.state.settings.lang).then(async ritoData => {
			await patchRitoCards(ritoData)
			updateRitoCards(getRitoCardsFromDataDump(ritoData))
			updateRitoLoading(false)
		})
	}, [ritoLoading])

    const [displayedRitoCards, updateRitoCardSource, currentRitoCardsFilters, patchRitoCardsFilters] = useFilter({
		collectible: {
			value: true,
			filter: (userSelectedCollectable, collectible)=>{
				return collectible === userSelectedCollectable
			}
		},
		name: {
			filter: (userSelectedName, name)=>{
				if (!userSelectedName){
					return true
				}
				return name.toLowerCase().includes(userSelectedName.toLowerCase())
			}
		},
		descriptionRaw: {
			filter: (userSelectedDescription, descriptionRaw, cardData)=>{
				if (!userSelectedDescription){
					return true
				}
				return descriptionRaw.toLowerCase().includes(userSelectedDescription.toLowerCase()) 
					|| cardData.levelupDescriptionRaw.toLowerCase().includes(userSelectedDescription.toLowerCase()) 
					|| cardData.description.toLowerCase().includes(userSelectedDescription.toLowerCase()) 
					|| cardData.levelupDescription.toLowerCase().includes(userSelectedDescription.toLowerCase()) 
			}
		},
		subtypes: {
			filter: (userSelectedSubtype, subtypes)=>{
				if (!userSelectedSubtype){
					return true
				}
				return Array.prototype.some.call(subtypes, subtypeName=>{
					return subtypeName.toLowerCase().includes(userSelectedSubtype.toLowerCase())
				})
			}
		},
		type: {
			filter: (userSelectedTypes, type)=>{
				if (!userSelectedTypes || !userSelectedTypes.length){
					return true
				}
				return userSelectedTypes.includes(type)
			}
		},
		set: {
			filter: (userSelectedSets, set)=>{
				if (!userSelectedSets || !userSelectedSets.length){
					return true
				}
				return userSelectedSets.includes(set)
			}
		},
		keywords: {
			filter: (userSelectedKeywords, keywords)=>{
				if (!userSelectedKeywords || !userSelectedKeywords.length){
					return true
				}
				return keywords.some(keywordOnCard=>userSelectedKeywords.includes(keywordOnCard))
			}
		},
		rarityRef: {
			filter: (userSelectedRarities, rarityRef)=>{
				if (!userSelectedRarities || !userSelectedRarities.length){
					return true
				}
				return userSelectedRarities.includes(rarityRef)
			}
		},
		regionRefs: {
			filter: (userSelectedRegions, cardRegions)=>{
				if (!userSelectedRegions || !userSelectedRegions.length){
					return true
				}
				return userSelectedRegions.some(userSelectedRegion=>cardRegions.includes(userSelectedRegion))
			}
		},
		spellSpeed: {
			filter: (userSelectedSpellSpeeds, spellSpeed)=>{
				if (!userSelectedSpellSpeeds || !userSelectedSpellSpeeds.length){
					return true
				}
				return userSelectedSpellSpeeds.includes(spellSpeed)
			}
		},
		cost: {
			filter: (userSelectedCostRange, cost)=>{
				if (!userSelectedCostRange || !userSelectedCostRange.length){
					return true
				}

				const [min, max] = userSelectedCostRange

				return cost <= max && cost >= min
			}
		},
		attack: {
			filter: (userSelectedAtttackRange, attack, card)=>{
				if (!userSelectedAtttackRange || !userSelectedAtttackRange.length){
					return true
				}

				if ((card.type || "").toLowerCase() !== "unit"){
					return false
				}

				const [min, max] = userSelectedAtttackRange

				return attack <= max && attack >= min
			}
		},
		health: {
			filter: (userSelectedHealthRange, health, card)=>{
				if (!userSelectedHealthRange || !userSelectedHealthRange.length){
					return true
				}

				if ((card.type || "").toLowerCase() !== "unit"){
					return false
				}

				const [min, max] = userSelectedHealthRange

				return health <= max && health >= min
			}
		},
	})

    useEffect(()=>{
		if (!ritoCards || !ritoCards.length){
			return updateRitoCardSource([])
		}

		updateRitoCardSource(ritoCards)
	}, [ritoCards])

    const patchRitoCardsFilter = useCallback((filterToPatch, patchSettings)=>{
		const patch = {}
		patch[filterToPatch] = patchSettings
		patchRitoCardsFilters(patch)
	}, [patchRitoCardsFilters])

	const ritoCardsFilterOptions = useAssetCache(updateFilterOptions=>{
		if (!ritoCards || !ritoCards.length || !displayedRitoCards || !displayedRitoCards.length){
			return
		}

		const baseOptions = getFilterOptionsFromCardsList(ritoCards)
		baseOptions.set.sort((a,b)=>a.localeCompare(b))
		const filteredResultsOptions = getFilterOptionsFromCardsList(displayedRitoCards)
		const trueOptions = {
			...baseOptions,
			keywords: filteredResultsOptions.keywords,
		}

		updateFilterOptions(trueOptions)
	}, [ritoCards, displayedRitoCards], {})

    return {
        cardList: ritoCards,
        loading: ritoLoading,
        refreshList: loadRitoData,
        filteredCardList: displayedRitoCards,
        currentFilters: currentRitoCardsFilters,
        patchFilter: patchRitoCardsFilter,
        patchFilters: patchRitoCardsFilters,
        filterOptions: ritoCardsFilterOptions
    }
}