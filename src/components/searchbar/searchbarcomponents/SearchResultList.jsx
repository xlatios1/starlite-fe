import React from 'react'
import { SearchResult } from './SearchResult'

export const SearchResultList = ({
	suggestions,
	handleSelect,
	setShouldHandleBlur,
	selectedIndex,
}) => {
	return (
		<div className="results-list">
			{suggestions.length > 0 ? (
				suggestions.map((result, id) => {
					return (
						<SearchResult
							key={id}
							result={result}
							handleSelect={handleSelect}
							setShouldHandleBlur={setShouldHandleBlur}
							selectedIndex={selectedIndex === id}
						/>
					)
				})
			) : (
				<div className="search-result">No courses found.</div>
			)}
		</div>
	)
}
