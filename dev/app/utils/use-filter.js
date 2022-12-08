import { useEffect, useState } from "/cdn/react"


export default function useFilter(){
	const [sourceData, updateSourceData] = useState([])
	const [filteredData, updateFilteredData] = useState([])
	const [filters, updateFilters] = useState({})

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

				filteredProperties.forEach(prop=>{
					if (!assumePassesFilter){
						return
					}

					const filterToCheckAgainst = filters[prop]
					const match = filterToCheckAgainst.match
					const include = filterToCheckAgainst.include

					if (match && include){
						throw new Error("Only 'match' or 'include' is allowed")
					}
					if (match){
						const matchMultiple = Array.isArray(match)

						if (matchMultiple){
							let canInclude = false

							if (!match.length){
								canInclude = true
							}


							match.forEach(termToMatch=>{
								if (canInclude){
									return
								}

								if (termToMatch === item[prop]){
									canInclude = true
								}
							})

							assumePassesFilter = assumePassesFilter && canInclude
						}
						else{
							if (typeof match === "undefined"){
								return
							}

							assumePassesFilter = assumePassesFilter && match === item[prop]
						}
					}
					else if (include){
						const matchMultiple = Array.isArray(include)

						if (matchMultiple){
							let canInclude = false


							if (!include.length){
								canInclude = true
							}

							include.forEach(termToInclude=>{
								if (canInclude){
									return
								}

								if ( String.prototype.includes.call(
									String.prototype.toLowerCase.call(item[prop]),
									termToInclude
								) ){
									canInclude = true
								}
							})

							assumePassesFilter = assumePassesFilter && canInclude
						}
						else{
							if (typeof include === "undefined" || include === ""){
								return
							}

							assumePassesFilter = assumePassesFilter && String.prototype.includes.call(
								String.prototype.toLowerCase.call(item[prop]),
								include
							)
						}
					}

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
		updateFilters,
	]
}
