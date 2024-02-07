import factory, { div, strong, button, nav, section, label, fragment, img } from "/Utils/elements.js"
import { useState, useCallback, useRef, useEffect, useContext, useLayoutEffect, createElement } from "/cdn/react"
import { getCard, saveCard, deleteCard } from "/Utils/service.js"
import loadCss from "/Utils/load-css.js"
import useLang from "/Utils/use-lang.js"
import listLimit from "/Components/list-limit.js"
import cardName from "/Components/deck/card-name.js"
import ritoCardsFiltersUi from "/Components/deck/rito-cards-filters-ui.js"
import deckView from "/Components/deck/deck-view.js"
import useAssetCache from "/Utils/use-asset-cache.js"
import customCardsFiltersUi from "/Components/deck/custom-cards-filters-ui.js"
import debounceFunction from "/Utils/debounce-function.js"
import { svgRefference } from "/Views/card-editor.js"
import { Globals } from "/Views/index.js"
import editName from "/Components/card-config/edit-name.js"
import editArt from "/Components/card-config/edit-art.js"
import { ExternalCustomCard, isExternalImage } from "/Components/deck/deck-card.js"
import exportFromApp from "/Components/export.js"
import EditCheckbox from "/Components/card-config/edit-checkbox.js"
import EditFileName from "/Components/card-config/edit-file-name.js"
import datauri from "/Utils/datauri.js"
import reactModal from "/cdn/react-modal"
import pocRelicItemSelectionModalIcon, { RelicItemRitoIcon } from "/Components/deck/poc-relic-item-selection-modal-icon.js"
import useFilterableRitoCardList from "/Components/deck/hooks/use-filterable-rito-card-list.js"
import useFilterableCustomCardList from "/Components/deck/hooks/use-filterable-custom-card-list.js"
import useRitoPocStickers from "/Components/deck/hooks/use-rito-poc-stickers.js"

const modal = factory(reactModal)

const cssLoaded = loadCss("/Views/deck-builder.css")

const defaultDeck = {
	id: undefined,
	cards: [],
	type: "deck",
	name: "",
	showDeckStats: true,
	includeAssociated: false,
	showPocItems: false,
	showAssociatedCards: false,
	dataVersion: 2,
	fileName: "",
}

function deckBuilderComponenet(){

	const translate = useLang()
	const globalState = useContext(Globals)
	const lowSpecsMode = globalState.state.settings.lowSpecsMode === true
	const globalStateRef = useRef()
	globalStateRef.current = globalState

	// data that's needed for the cards to be rendered in a pretty UI
	const [deck, updateDeck] = useState(defaultDeck)
	const deckCardsToRender = deck.cards

	let unPatchedChanged = {}
	const patchDeck = useCallback((update)=>{
		unPatchedChanged = {...unPatchedChanged, ...update}

		updateDeck({
			...deck,
			...unPatchedChanged,
		})
	}, [deck])
	
	const updateDeckName = useCallback(name=>{
		patchDeck({ name })
	}, [patchDeck])
	
	const updateFileName = useCallback(fileName=>{
		patchDeck({ fileName })
	}, [patchDeck])

	const toggleDeckDeets = useCallback(()=>{
		patchDeck({ showDeckStats: !deck.showDeckStats })
	}, [patchDeck, deck.showDeckStats])

	const toggleIncludeAssociatedCards = useCallback(()=>{
		patchDeck({ includeAssociated: !deck.includeAssociated })
	}, [patchDeck, deck.includeAssociated])

	const toggleShowPocItems = useCallback(()=>{
		patchDeck({ showPocItems: !deck.showPocItems })
	}, [patchDeck, deck.showPocItems])

	const deckCardsListOrder = useAssetCache(updateList=>{
		const listOrder = [
			...deckCardsToRender
		]

		listOrder.sort((a,b)=>{
			const aManaCost = (Object.prototype.hasOwnProperty.call(a.card, "mana") ? a.card.mana : a.card.cost) || Infinity
			const bManaCost = (Object.prototype.hasOwnProperty.call(b.card, "mana") ? b.card.mana : b.card.cost) || Infinity

			const aName = (a.card.name || "").toLowerCase()
			const bName = (b.card.name || "").toLowerCase()

			return (aManaCost - bManaCost) || aName.localeCompare(bName)
		})

		updateList(listOrder)
	}, [deckCardsToRender], [])

	// deal with the back button
	useEffect(()=>{
		const checkAllowGoBackAtStartup = globalState.getAllowBack()
		globalStateRef.current.setAllowBack(checkAllowGoBack)

		return function(){
			// here we are greedy and will always rest the allow back callback to our cached state as this view is one of the top level views.
			globalStateRef.current.setAllowBack(checkAllowGoBackAtStartup)
		}

		function checkAllowGoBack(){
			if (document.documentElement.scrollTop > 100){
				const lowSpecsMode = globalStateRef.current.state.settings.lowSpecsMode === true
				setImmediate(()=>window.scroll({
					top: -document.documentElement.scrollTop,
					left: 0,
					behavior: lowSpecsMode ? "instant" :"smooth",
				}))
				return false
			}
			else{
				return checkAllowGoBackAtStartup()
			}
		}
	}, [])

	// load pre-existing deck if we're loading into a new deck
	const selectedCards = useRef(new Map())
	useEffect(()=>{
		globalState.state.cardId && getCard(globalState.state.cardId)
			.then(deckData=>{
				updateDeck({...defaultDeck, ...deckData})
				deckData.cards.forEach(cardData=>{
					const cardId = cardData.card.id || cardData.card.cardCode

					selectedCards.current.set(cardId, cardData)
				})
			})
		return ()=>{
			globalStateRef.current.patchState({cardId: ""})
		}
	}, [globalState.state.cardId])

	const [selectedTab, updateSelectedTab] = useState("rito")

	const simpleDeckStatsRef = useRef()
	const simpleDeckStatHeight = useAssetCache(updateHeight=>{
		const reCacheHeight = ()=>updateHeight(simpleDeckStatsRef.current.offsetHeight)
		reCacheHeight()
		
		window.addEventListener("resize", reCacheHeight)
		return ()=>window.removeEventListener("resize", reCacheHeight)
	}, [])

	// get the list for custom cards and rito cards
	const knownCards = useRef({})
	const customCardList = useFilterableCustomCardList(knownCards)
	const ritoCardList = useFilterableRitoCardList(knownCards)

	// functionality for management of the decklist
	const updateRenderedDeck = useCallback(()=>{
		const renderedDeck = []
		selectedCards.current.forEach((value)=>renderedDeck.push(value))
		renderedDeck.sort((a,b)=>{
			
			const aManaCost = (Object.prototype.hasOwnProperty.call(a.card, "mana") ? a.card.mana : a.card.cost) || Infinity
			const bManaCost = (Object.prototype.hasOwnProperty.call(b.card, "mana") ? b.card.mana : b.card.cost) || Infinity

			const aName = (a.card.name || "").toLowerCase()
			const bName = (b.card.name || "").toLowerCase()

			return (b.count - a.count) || (aManaCost - bManaCost) || aName.localeCompare(bName)
		})
		patchDeck({cards: renderedDeck})
	}, [patchDeck])
	const addCard = useCallback(card=>{
		const cardId = card.id || card.cardCode || card.url

		let existingData = selectedCards.current.get(cardId)
		if (!existingData){
			existingData = {
				count: 0,
				card
			}

			selectedCards.current.set(cardId, existingData)
		}

		existingData.count ++ // we dont limit it at 3 because it's possible that somehow, the user wishes to put 4+ of the same card into the deck cuz PoC or some silly origin passive or something

		updateRenderedDeck()
	}, [updateRenderedDeck])
	const removeCard = useCallback(card=>{
		const cardId = card.id || card.cardCode || card.url

		let existingData = selectedCards.current.get(cardId)
		if (!existingData){
			return
		}

		if (existingData.count){
			existingData.count--
		}

		if (existingData.count < 1){
			selectedCards.current.delete(cardId)
		}
		updateRenderedDeck()
	}, [updateRenderedDeck])

	// data for poc stickers
	const ritoPoCStickers = useRitoPocStickers()

	// functionality for managing the PoC related stuff of the decklist.
	const [showPoCStickerModal, updateShowPoCStickerModal] = useState(false)
	const [addSticker, updateAddSticker] = useState(()=>console.log) // a callback to add the sticker. this changes each time the modal is opened.
	const chooseSticker = useCallback(card=>{
		updateAddSticker(()=>(sticker)=>{ // react allows updating the value of a state with a function that gets called. in order to store a function in the state, we need to create a function that returns a function.
			const cardId = card.id || card.cardCode || card.url
	
			let existingData = selectedCards.current.get(cardId)
	
			if (!existingData){
				return
			}
	
			if (!existingData.stickers){
				existingData.stickers = []
			}
	
			existingData.stickers.push(sticker)
	
			updateRenderedDeck()
			updateShowPoCStickerModal(false)
		})
		updateShowPoCStickerModal(true)
	}, [updateRenderedDeck])
	const removeSticker = useCallback((card, stickerIndex)=>{
		const cardId = card.id || card.cardCode || card.url

		let existingData = selectedCards.current.get(cardId)

		if (!existingData || !existingData.stickers){
			return
		}

		existingData.stickers.splice(stickerIndex, 1)

		updateRenderedDeck()
	}, [updateRenderedDeck])
	const stickerSlotUri = useAssetCache(updateStickerSlotUri=>{
		datauri("/Assets/poc/empty-sticker-epic.png").then(updateStickerSlotUri)
	}, [])

	// copy paste more code for managing the preview view
	const fixedDisplayRef = useRef()
    const [useableWidth, updateUseableWidth] = useState(0)
    const [previewHeight, updatePreviewHeight] = useState(0)
    useLayoutEffect(()=>{        
        const setFixedDisplayDimentions = debounceFunction(function(){
            let useableWidth = fixedDisplayRef.current.parentNode.clientWidth
            const computedStyle = getComputedStyle(fixedDisplayRef.current.parentNode)

            useableWidth = useableWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)

            updateUseableWidth(useableWidth)
            updatePreviewHeight(fixedDisplayRef.current.offsetHeight)
        }, 250)
        requestAnimationFrame(setFixedDisplayDimentions)

        const observer = new MutationObserver(setFixedDisplayDimentions)

        window.addEventListener("resize", setFixedDisplayDimentions)
        observer.observe(fixedDisplayRef.current, {
            childList: true,
            subtree: true,
            attributes: ["style"]
        })

        return function(){
            window.removeEventListener("resize", setFixedDisplayDimentions)
            observer.disconnect()
        }
    }, [])

	// logic to do with exporting 
	const [svgRef, updateSvgRef] = useState(null)
	const [isExporting, setExporting] = useState(false)
	const exportCard = useCallback(()=>{
		if (isExporting){
			return
		}

		setExporting(true)

		const exportData = {...deck}
		if (deck.includeAssociated){
			const associatedCardsData = []
			deck.cards.forEach(cardMeta=>{
				const cardData = cardMeta.card

				const associatedCardsKeys = cardData.associatedCardRefs || cardData.associatedCards

				if (!associatedCardsKeys){
					return
				}

				associatedCardsKeys.forEach(associatedKey=>{
					const associatedData = knownCards.current[associatedKey] || knownCards.current[associatedKey.id] || knownCards.current[associatedKey.cardCode] || associatedKey
					associatedCardsData.push(associatedData)
				})
			})

			exportData.associatedCardsData = associatedCardsData
		}

		exportFromApp(exportData, svgRef, globalState).then(()=>setExporting(false), (err)=>console.warn(err) + setExporting(false))
	}, [svgRef, isExporting, deck, globalState])

	// logic to do with saving
	const [canSave, setCanSave] = useState(!deck.id)
	const [isSaving, setisSaving] = useState(false)
	useEffect(()=>{
		setCanSave(true)
	}, Object.keys(deck).map(prop=>deck[prop]))
	const saveDeck = useCallback(()=>{
		if (!canSave || isSaving){
			return
		}
		setisSaving(true)
		function doneSaving(){
			setCanSave(false)
			setisSaving(false)
		}
		if (deck.id){
			return saveCard(deck.id, deck).then(doneSaving, doneSaving)
		}
		const newId = Date.now().toString()
		saveCard(newId, deck).then(doneSaving, doneSaving)
		patchDeck({id: newId})
	}, [!canSave || isSaving, deck, patchDeck])

	return section(
		{ id: "deck-builder", className: "flex hcenter gutter-t-2" },
		div(
			{ 
				className: "deck-preview box-xs-12 box-s-10 box-m-6",
				style: { paddingBottom: previewHeight + "px"}
			},
			div(
				{ 
					className: "preview-content gutter-rl-2", 
					ref: fixedDisplayRef, 
					style: {
						width: useableWidth + "px"
					} 
				},
				div({ className: "flex vhcenter", ref: simpleDeckStatsRef }, 
					div({ className: "gutter-rl" },
						translate("deck_size"),
						": ",
						deckCardsToRender.reduce((sum, cardMetaData)=>sum+cardMetaData.count, 0)
					),
				),
				createElement(
					svgRefference.Provider,
					{ value: {
						current: svgRef,
						setRef: updateSvgRef,
					} },
					div({ className: "preview-height-limit flex vhcenter", style: { "--simple-stats-height": simpleDeckStatHeight + "px" } },
						deckView({ 
							cards: deckCardsToRender, 
							loading: isExporting, 
							cardStats: deck.showDeckStats,
							showAssociatedCards: deck.showAssociatedCards,
						}),
					),
				),
				div({ className: "flex vhcenter gutter-b" }, 
					div(
						{ className: "gutter-rl-.5" },
						button(
							{
								className: `gutter-trbl-.5 ${deck.id ? "" : "hide"}`,
								onClick: ()=>{
									deleteCard(deck.id).then(()=>{
										document.location.reload()
									})
								}
							},
							strong(translate("delete_deck"))
						)
					),
					div(
						{ className: "gutter-rl-.5" },
						button(
							{
								className: "gutter-trbl-.5",
								[(canSave || !setisSaving ? "data-foo" : "disabled")]: true,
								onClick: saveDeck
							},
							strong(translate("save_deck"))
						)
					),
					div(
						{ className: "gutter-rl-.5" },
						button(
							{
								className: "gutter-trbl-.5",
								[(isExporting ? "disabled" : "data-foo")]: true,
								onClick: exportCard
							},
							strong(translate("share"))
						)
					),
				)
			),
		),
		div(
			{ className: "card-finder box-xs-12 box-s-10 box-m-6" },

			nav(
				{ className: "flex no-wrap card-list-options gutter-t-.5" },
				div(
					{ 
						className: (selectedTab === "rito" ? "active " : "" ) + "tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("rito"),
					}, 
					translate("official_cards")
				),
				div(
					{ 
						className: (selectedTab === "custom" ? "active " : "" ) + "tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("custom"),
					}, 
					translate("custom_cards")
				),
				div(
					{ 
						className: (selectedTab === "inDeck" ? "active " : "" ) + "tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("inDeck"),
					}, 
					translate("currently_selected_cards")
				),
				div(
					{ 
						className: (selectedTab === "about" ? "active " : "" ) + "tab-header grow gutter-trbl-.5 clickable flex vhcenter text-center",
						onClick: ()=>updateSelectedTab("about"),
					}, 
					translate("about_deck_builder")
				),
			),
			
			div(
				{ className: "tab-body" },

				selectedTab === "rito" 
					? div(
						{ className: "gutter-rl" },

						ritoCardsFiltersUi({
							refreshRitoData: ritoCardList.refreshList,
							refreshRitoLoading: ritoCardList.loading,
							filterOptions: ritoCardList.filterOptions,
							updateSelectedFilters: ritoCardList.patchFilters,
							updateSelectedFilter: ritoCardList.patchFilter,
							selectedFilters: ritoCardList.currentFilters
						}),

						div(
							{ className: "card-name-list" },

							listLimit(
								{ defaultSize: lowSpecsMode ? 8 : 24 },
								(ritoCardList.filteredCardList || []).map(card=>card
									? div(
										{ className: "flex gutter-b", key: card.cardCode },
	
										cardName({ card, className: "box-9" }, card.name),
	
										div(
											{ className: "box-3 flex no-wrap" },
											button({ className: "grow gutter-trbl-.5", onClick: ()=>addCard(card) }, 
												div({ className: "icon plus" })
											),
											div({ className: "gutter-rl-.25" }),
											button({ className: "grow gutter-trbl-.5", onClick: ()=>removeCard(card) }, 
												div({ className: "icon minus" })
											),
										),
									)
									:undefined
								)
							),
	
							!ritoCardList.cardList || !ritoCardList.cardList.length 
								? div(
									{ className: "flex" },
									button(
										{ 
											onClick: ritoCardList.refreshList,
											className: "gutter-trbl-.5 grow",
										}, 
										ritoCardList.loading 
											? div({ className: "icon loading" })
											: translate("load_rito_data")
										,
									)
								)
								: undefined 
							, 

						),

					) 
					: undefined
				,

				selectedTab === "custom" 
					? div(
						{ className: "gutter-rl" },

						customCardsFiltersUi({
							filterOptions: customCardList.filterOptions,
							updateSelectedFilters: customCardList.patchFilters,
							updateSelectedFilter: customCardList.patchFilter,
							selectedFilters: customCardList.currentFilters,
						}),

						div(
							{ className: "card-name-list" },
							listLimit(
								{ defaultSize: lowSpecsMode ? 8 : 24 },
								(customCardList.cardList || []).map(card=>card
									? div(
										{ className: "flex gutter-b", key: card.id },

										cardName({ card, className: "box-9" }, card.name),

										div(
											{ className: "box-3 flex no-wrap" },
											button({ className: "grow gutter-trbl-.5", onClick: ()=>addCard(card) }, 
												div({ className: "icon plus" })
											),
											div({ className: "gutter-rl-.25" }),
											button({ className: "grow gutter-trbl-.5", onClick: ()=>removeCard(card) }, 
												div({ className: "icon minus" })
											),
										),
									)
									:undefined
								)
							)
						),
					)
					: undefined
				,

				selectedTab === "inDeck" 
					? div(
						{ className: "gutter-rl" },

						div(
							{ className: "card-name-list gutter-t" },

							div(
								{ className: "current-deck-input-fields gutter-rl-.5 gutter-b-1" },
								editName({
									label: translate("deck_name"),
									value: deck.name,
									updateValue: updateDeckName,
								}),
							),

							div(
								{ className: "current-deck-input-fields gutter-rl-.5 gutter-b-1" },
								EditFileName({
									label: translate("file_name"),
									value: deck.fileName,
									updateValue: updateFileName,
									placeholder: deck.name,
								}),
							),

							div(
								{ className: "current-deck-input-fields gutter-rl-.5 gutter-b-1" },
								editArt({
									label: translate("other_custom_card"),
									moveable: false,
									multiple: true,
									updateValue: urls=>{
										urls.forEach(url=>addCard({ url }))
									}
								})
							),
							
							div(
								{ className: "current-deck-input-fields gutter-rl-.5 gutter-b-1" },
								EditCheckbox({
									label: translate("show_deck_stats"),
									value: deck.showDeckStats, 
									updateValue: toggleDeckDeets
								}),
							),
							
							div(
								{ className: "current-deck-input-fields gutter-rl-.5 gutter-b-1" },
								EditCheckbox({
									label: translate("include_associated_cards"),
									value: deck.includeAssociated, 
									updateValue: toggleIncludeAssociatedCards
								}),
							),
							
							div(
								{ className: "current-deck-input-fields gutter-rl-.5 gutter-b-1" },
								EditCheckbox({
									label: translate("show_poc_items"),
									value: deck.showPocItems, 
									updateValue: toggleShowPocItems
								}),
							),

							(deckCardsListOrder || []).map(cardMeta=>cardMeta
								? div( {className: deck.showPocItems ? "gutter-b" : "gutter-b-.5", key: cardMeta.card.id || cardMeta.card.cardCode || cardMeta.card.url },
									div(
										{ className: "flex gutter-b-.5"},

										isExternalImage(cardMeta.card) 
											? div(
												{ className: "box-9 gutter-rl" },
												ExternalCustomCard(cardMeta.card)
											)
											: cardName({ card: cardMeta.card, className: "box-9" }, cardMeta.card.name)
										,

										div(
											{ className: `box-3 flex no-wrap ${ isExternalImage(cardMeta.card) ? "vcenter" : "" }` },
											button({ className: "grow gutter-trbl-.5", onClick: ()=>addCard(cardMeta.card) }, 
												div({ className: "icon plus" })
											),
											div({ className: "gutter-rl-.25" }),
											button({ className: "grow gutter-trbl-.5", onClick: ()=>removeCard(cardMeta.card) }, 
												div({ className: "icon minus" })
											),
										),
									),
									deck.showPocItems 
										? fragment(
											div(
												{ className: "flex" },
												cardMeta.stickers
													? Array.prototype.map.call(cardMeta.stickers, (sticker, index)=>div(
														{ 
															className: "box-2 text-center",
															key: sticker.itemCode || sticker.relicCode,
														},
														RelicItemRitoIcon(sticker),
														button(
															{ 
																className: "gutter-trbl-.5 clickable",
																onClick: ()=>removeSticker(cardMeta.card, index)
															},
															div({ className: "icon multiply" })
														)
													))
													: undefined
												,
												div(
													{ className: "box-2 clickable", }, 
													RelicItemRitoIcon({
														url: stickerSlotUri,
														urlFull: stickerSlotUri,
														onClick: ()=>chooseSticker(cardMeta.card)
													})
												)
											)
										) 
										: undefined
								)
								:undefined
							)
						),
					)
					: undefined
				,

				selectedTab === "about" 
					? div(
						{ className: "gutter-rl" },

						div(
							{ className: "about-deck-uilder gutter-t" },

							div({ className: "about-info" }, translate("about_deck_builder_1", true)),

							div({ className: "about-info" }, translate("about_deck_builder_2", true)),

							div({ className: "about-info" }, translate("about_deck_builder_3", true)),
							
							div({ className: "about-info" }, translate("about_deck_builder_4", true)),
							
							div({ className: "about-info" }, translate("about_deck_builder_5", true)),
						),
					)
					: undefined
				,
			),
		),
		modal(
			{
				isOpen: showPoCStickerModal,
				contentLabel: "Select PoC Items or Relics",
				className: "poc-item-relic-modal gutter-trbl",
           		overlayClassName: "poc-item-relic-overlay",
				shouldCloseOnOverlayClick: true,
				onRequestClose: ()=>updateShowPoCStickerModal(false),
				ariaHideApp: false,
			},
			// ritoPocItemRelics.map(),
			div(
				{ className: "flex gutter-b" },
				button(
					{ 
						className: "gutter-trbl-.5 grow",
						onClick: ritoPoCStickers.refreshList
					},
					ritoPoCStickers.relics.length || ritoPoCStickers.items.length
						? translate("refresh_rito_data")
						: translate("load_rito_data")
				)
			),
			ritoPoCStickers.relics.length
				? div(
					div({ className: "text-center gutter-t gutter-b-.5" },
						strong(
							translate("relic")
						)
					),
					div({ className: "flex" }, 
					ritoPoCStickers.relics.map(relic=>(
							pocRelicItemSelectionModalIcon({ 
								...relic, 
								onClick: ()=>addSticker(relic),
								key: relic.relicCode,
							})
						))
					),
				)
				: undefined
			,
			ritoPoCStickers.items.length
				? div(
					div({ className: "text-center gutter-t gutter-b-.5" },
						strong(
							translate("item")
						)
					),
					div({ className: "flex" }, 
						ritoPoCStickers.items.map(item=>(
							pocRelicItemSelectionModalIcon({ 
								...item, 
								onClick: ()=>addSticker(item),
								key: item.itemCode,
							})
						))
					),
				)
				: undefined
			,
		)
	)
}

export default factory(deckBuilderComponenet, cssLoaded)
