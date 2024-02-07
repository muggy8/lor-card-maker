import { useCallback, useEffect } from "/cdn/react"
import { getCardList } from "/Utils/service.js"
import useFilter from "/Utils/use-filter.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import getFilterOptionsFromCardsList from "/Components/deck/hooks/get-filter-options-form-card-list.js"

export default function useFilterableCustomCardList(knownCards){
    const customCards = useAssetCache(updateCustomcards=>{
        getCardList({exclude: ["deck"]}).then(customCards=>{
            updateCustomcards(customCards)
            customCards.forEach(card=>{
                if (!card || !card.id){
                    return
                }

                knownCards.current[card.id] = card
            })
        })
    }, [])

    const [displayedCustomCards, updateCustomCardSource, currentCustomCardsFilters, patchCustomCardsFilters] = useFilter({
        name: {
            filter: (userSelectedName, name)=>{
                if (!userSelectedName){
                    return true
                }
                return name.toLowerCase().includes(userSelectedName.toLowerCase())
            }
        },
        effect: {
            filter: (userSelectedDescription, descriptionRaw)=>{
                if (!userSelectedDescription){
                    return true
                }
                return descriptionRaw.toLowerCase().includes(userSelectedDescription .toLowerCase())
            }
        },
        lvup: {
            filter: (userSelectedDescription, descriptionRaw)=>{
                if (!userSelectedDescription){
                    return true
                }
                return descriptionRaw.toLowerCase().includes(userSelectedDescription .toLowerCase())
            }
        },
        clan: {
            filter: (userSelectedClan, clan)=>{
                if (!userSelectedClan){
                    return true
                }
                return Array.prototype.some.call(clan, clanName=>{
                    return clanName.toLowerCase().includes(userSelectedClan.toLowerCase())
                })
            }
        },
        keywords: {
            filter: (userSelectedKeywords, keywords)=>{
                if (!userSelectedKeywords || !userSelectedKeywords.length){
                    return true
                }
                return keywords.some(keywordOnCard=>
                    userSelectedKeywords.includes(keywordOnCard) ||
                    userSelectedKeywords.some(keywordStringOrObject=>{
                        if (typeof keywordStringOrObject === "string" || typeof keywordOnCard === "string"){
                            return false
                        }

                        return keywordStringOrObject.id === keywordOnCard.id
                    })
                )
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
        type: {
            filter: (userSelectedCardTypes, cardType)=>{
                if (!userSelectedCardTypes || !userSelectedCardTypes.length){
                    return true
                }
                return userSelectedCardTypes.includes(cardType)
            }
        },
        faction: {
            filter: (userSelectedFactions, cardFactions)=>{
                if (!userSelectedFactions || !userSelectedFactions.length){
                    return true
                }
                return userSelectedFactions.some(userSelectedRegion=>cardFactions.includes(userSelectedRegion))
            }
        },
        speed: {
            filter: (userSelectedSpeeds, speed)=>{
                if (!userSelectedSpeeds || !userSelectedSpeeds.length){
                    return true
                }
                return userSelectedSpeeds.includes(speed)
            }
        },
        mana: {
            filter: (userSelectedManaRange, mana)=>{
                if (!userSelectedManaRange || !userSelectedManaRange.length){
                    return true
                }

                const [min, max] = userSelectedManaRange

                return mana <= max && mana >= min
            }
        },
        power: {
            filter: (userSelectedPowerRange, power, card)=>{
                if (!userSelectedPowerRange || !userSelectedPowerRange.length){
                    return true
                }

                if ((card.type || "").toLowerCase() !== "unit"){
                    return false
                }

                const [min, max] = userSelectedPowerRange

                return power <= max && power >= min
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
        if (!customCards || !customCards.length){
            return updateCustomCardSource([])
        }

        updateCustomCardSource(customCards)

    }, [customCards])

    const patchCustomcardsFilter = useCallback((filterToPatch, patchSettings)=>{
        const patch = {}
        patch[filterToPatch] = patchSettings
        patchCustomCardsFilters(patch)
    }, [patchCustomCardsFilters])

    const customCardsFilterOptions = useAssetCache(updateFilterOptions=>{
        if (!customCards || !customCards.length || !displayedCustomCards || !displayedCustomCards.length){
            return
        }

        // who would have thought that there'd be a shit load of garbage data in user generated content ._.
        const baseOptions = getFilterOptionsFromCardsList(customCards)
        baseOptions.health && (baseOptions.health = baseOptions.health.filter(value=>typeof value !== "undefined" && value !== null))
        baseOptions.power && (baseOptions.power = baseOptions.power.filter(value=>typeof value !== "undefined" && value !== null))
        baseOptions.mana && (baseOptions.mana = baseOptions.mana.filter(value=>typeof value !== "undefined" && value !== null))
        const originalTypesList = baseOptions.type
        if (originalTypesList){
            baseOptions.type = baseOptions.type.filter(type=>!type.toLowerCase().includes("champion")) // filter out all champion types so we can replace it with a genaric champion type for easier filtering
            originalTypesList.length !== baseOptions.type.length && baseOptions.type.push("champion") // add a genaric champion type back in if we sliced out something with the above logic
        }
        const filteredResultsOptions = getFilterOptionsFromCardsList(displayedCustomCards)
        const keywordsAlreadyAccountedFor = []
        filteredResultsOptions.keywords && (filteredResultsOptions.keywords = filteredResultsOptions.keywords.filter(keyword=>{
            const keywordIdentifyer = keyword.id || keyword // if it's custom it'll have an id, otherwise it's just a string
            if (keywordsAlreadyAccountedFor.includes(keywordIdentifyer)){
                return false
            }

            keywordsAlreadyAccountedFor.push(keywordIdentifyer)
            return true
        }))

        const trueOptions = {
            ...baseOptions,
            keywords: filteredResultsOptions.keywords,
        }

        updateFilterOptions(trueOptions)
        // console.log(trueOptions, displayedCustomCards)
    }, [customCards, displayedCustomCards], {})

    return {
        cardList: customCards,
        filteredCardList: displayedCustomCards,
        currentFilters: currentCustomCardsFilters,
        patchFilter: patchCustomcardsFilter,
        patchFilters: patchCustomCardsFilters,
        filterOptions: customCardsFilterOptions
    }
}