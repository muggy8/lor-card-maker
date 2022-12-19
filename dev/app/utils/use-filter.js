import { useEffect, useState, useCallback } from "/cdn/react"

export default function useFilter(defaultFilters){
	const [sourceData, updateSourceData] = useState([])
	const [filteredData, updateFilteredData] = useState([])
	const [filters, updateFilters] = useState(defaultFilters || {})

	let unpatchedUpdates = {}
	const patchFilters = useCallback((patch)=>{
		unpatchedUpdates = mergeDeep(unpatchedUpdates, patch)
		const newState = mergeDeep({}, filters, unpatchedUpdates )
		updateFilters(newState)
	}, [filters])

	useEffect(()=>{
		// actually perform the filtering logic in here
		const filteredProperties = Object.keys(filters)

		const filterResults = Array.prototype.filter.call(
			sourceData || [],
			item=>{
				let assumePassesFilter = true

				if (typeof item === "undefined" || item === null){
					return false
				}

				// and across properties, or within properties
				filteredProperties.forEach(prop=>{
					if (!assumePassesFilter){
						return
					}

					const filterToCheckAgainst = filters[prop]

					if (!filterToCheckAgainst.filter || !Object.prototype.hasOwnProperty.call(filterToCheckAgainst, "value")){
						return
					}

					assumePassesFilter = assumePassesFilter && filterToCheckAgainst.filter(filterToCheckAgainst.value, item[prop], item)

				})

				return assumePassesFilter
			}
		)

		updateFilteredData(filterResults)

	}, [sourceData, filters])

	return [
		filteredData,
		updateSourceData,
		filters,
		patchFilters,
	]
}


// copy paste code from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
// too lazy to actually do the coding

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}
  
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}