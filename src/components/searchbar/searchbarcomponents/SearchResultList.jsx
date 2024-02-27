import React from 'react'
import { SearchResult } from './SearchResult'

export const SearchResultList = ({
	results,
	handleSelect,
	setShouldHandleBlur,
	selectedIndex,
}) => {
	return (
		<div className="results-list">
			{results.map((result, id) => {
				return (
					<SearchResult
						result={result}
						key={id}
						selectedIndex={selectedIndex === id}
						handleSelect={handleSelect}
						setShouldHandleBlur={setShouldHandleBlur}
					/>
				)
			})}
		</div>
	)
}
