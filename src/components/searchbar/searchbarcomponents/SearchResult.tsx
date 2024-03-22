import React, { Dispatch, SetStateAction } from 'react'

type SearchResultProps = {
	result: { code: string; name: string }
	handleSelect: (value: string) => void
	setShouldHandleBlur: Dispatch<SetStateAction<boolean>>
	selectedIndex: boolean
}

export const SearchResult = ({
	result,
	handleSelect,
	setShouldHandleBlur,
	selectedIndex,
}: SearchResultProps) => {
	const handleOptionMouseDown = () => {
		// Set the flag to indicate that the blur event should not be handled
		setShouldHandleBlur(false)
	}

	const handleOptionMouseUp = () => {
		// Set the flag back to true when the mouse button is released
		setShouldHandleBlur(true)
	}

	return (
		<div
			className={`search-result ${selectedIndex ? 'selected' : ''}`}
			onClick={(e) => handleSelect(result.code)}
			onMouseDown={handleOptionMouseDown}
			onMouseUp={handleOptionMouseUp}
		>
			{`${result.code}: ${result.name}`}
		</div>
	)
}
