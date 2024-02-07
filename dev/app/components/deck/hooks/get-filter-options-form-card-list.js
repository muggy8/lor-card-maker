export default function getOptionsFromCardsList(cardList){
	const options = cardList.reduce((variationCollector, card)=>{
		if (!card){
			return variationCollector
		}

		Object.keys(card).forEach(property=>{
			variationCollector[property] = variationCollector[property] || new Map()

			const value = card[property]
			if (Array.isArray(value)){
				value.forEach(actualValue=>{
					variationCollector[property].set(actualValue, true)
				})
				return
			}
			variationCollector[property].set(value, true)
		})

		return variationCollector
	}, {})

	Object.keys(options).forEach(property=>{
		const valueMap = options[property]
		options[property] = []
		valueMap.forEach((_value, key)=>{
			options[property].push(key)
		})
	})

	return options
}