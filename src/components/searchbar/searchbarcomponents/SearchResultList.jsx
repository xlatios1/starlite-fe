import React from 'react'
import { SearchResult } from './SearchResult'

export const SearchResultList = ({
	results,
	handleSelect,
	setShouldHandleBlur,
}) => {
	return (
		<div className="results-list">
			{results.map((result, id) => {
				return (
					<SearchResult
						result={result}
						key={id}
						handleSelect={handleSelect}
						setShouldHandleBlur={setShouldHandleBlur}
					/>
				)
			})}
		</div>
	)
}
