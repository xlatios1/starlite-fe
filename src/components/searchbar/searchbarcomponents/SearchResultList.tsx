import React, { Dispatch, SetStateAction } from 'react'
import { SearchResult } from './SearchResult.tsx'

type SearchResultListProps = {
	suggestions: { code: string; name: string }[]
	handleSelect: (value: string) => void
	setShouldHandleBlur: Dispatch<SetStateAction<boolean>>
	selectedIndex: number
}

export const SearchResultList = ({
	suggestions,
	handleSelect,
	setShouldHandleBlur,
	selectedIndex,
}: SearchResultListProps) => {
	return (
		<div className="search-bar-wrapper">
			<div className="results-list">
				{suggestions.length > 0 ? (
					suggestions.map((result, id: number) => {
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
		</div>
	)
}
