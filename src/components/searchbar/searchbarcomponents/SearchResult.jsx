import React from 'react'

export const SearchResult = ({ result, handleSelect, setShouldHandleBlur }) => {
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
			className="search-result"
			onClick={(e) => handleSelect(result.name)}
			onMouseDown={handleOptionMouseDown}
			onMouseUp={handleOptionMouseUp}
		>
			{result.name}
		</div>
	)
}
