import factory, { div, label, strong, button } from "/Utils/elements.js"
import useLang from "/Utils/use-lang.js"
import { useCallback, useRef } from "/cdn/react"
import useFilterableCustomCardList from "/Components/deck/hooks/use-filterable-custom-card-list.js"
import reactModal from "/cdn/react-modal"
import customCardsFiltersUi from "/Components/deck/custom-cards-filters-ui.js"
import cardName from "/Components/deck/card-name.js"
import useToggle from "/Utils/use-toggle.js"
import loadCss from "/Utils/load-css.js"


const modal = factory(reactModal)
const cssLoaded = loadCss("/Components/card-config/edit-clone-existing.css")

function EditCloneExistingComponent(props){
    const translate = useLang()

    const knownCards = useRef({})
	const customCardList = useFilterableCustomCardList(knownCards, { exclude: props.exclude, include: props.include, only: props.only })

    const [cardSelectorModalOpen, toggleSelectorModalOpen, setSelectorModalOpen] = useToggle(false)

    const utilizeCloneData = useCallback((dataToBeCloned)=>{
        Object.keys(dataToBeCloned).forEach(propertyToClone=>{
            if (
                propertyToClone === "id" || 
                propertyToClone === "type"|| 
                propertyToClone === "dataVersion"
            ){
                return
            }
            const propertyUpdater = props.cardDataUpdaters[propertyToClone]
            if (typeof propertyUpdater === "undefined"){
                return
            }

            propertyUpdater(dataToBeCloned[propertyToClone])
        })
        setSelectorModalOpen(false)
    }, [props.cardDataUpdaters, setSelectorModalOpen])

    return label(
        { className: "box" },
        div(
            { className: "flex gutter-b-.5" },
            div(
                { className: "grow flex vcenter" },
                strong(
                    translate("clone")
                )
            ),
            button({ className: "gutter-trbl-.5", onClick: toggleSelectorModalOpen }, 
                div({ className: `icon ${ cardSelectorModalOpen ? "no-eye" : "eye" }` })
            )
        ),
        modal(
            {
                isOpen: cardSelectorModalOpen,
                contentLabel: "Select Card to Clone",
                shouldCloseOnOverlayClick: true,
				onRequestClose: ()=>setSelectorModalOpen(false),
				ariaHideApp: false,
                className: "clone-selection-modal gutter-trbl",
                overlayClassName: "clone-selection-overlay",
            },
            customCardsFiltersUi({
                filterOptions: customCardList.filterOptions,
                updateSelectedFilters: customCardList.patchFilters,
                updateSelectedFilter: customCardList.patchFilter,
                selectedFilters: customCardList.currentFilters,
            }),
            div(
                (customCardList.filteredCardList || []).map(card=>card
                    ? div(
                        { className: "flex gutter-b", key: card.id },

                        cardName({ card, className: "box-9" }, card.name),

                        div(
                            { className: "box-3 flex no-wrap" },
                            button({ className: "grow gutter-trbl-.5", onClick: ()=>utilizeCloneData(card) }, 
                                div(
                                    translate("clone")
                                )
                            ),
                        ),
                    )
                    :undefined
                )
            )
        )
    )
}

export default factory(EditCloneExistingComponent, cssLoaded)