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
			{results.length > 1 ? (
				results.map((result, id) => {
					return (
						<SearchResult
							result={result}
							key={id}
							handleSelect={handleSelect}
							setShouldHandleBlur={setShouldHandleBlur}
						/>
					)
				})
			) : (
				<div className="search-result">No courses found.</div>
			)}
		</div>
	)
}
