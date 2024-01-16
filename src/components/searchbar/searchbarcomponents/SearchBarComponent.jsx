import React, { useState, useEffect } from 'react'
import { RiSearchLine } from 'react-icons/ri'

export const SearchBarComponent = ({
	handleSearch,
	handleInput,
	input,
	searchBoxRef,
	setIsFocused,
	shouldHandleBlur,
}) => {
	const handleFocus = () => {
		setIsFocused(true)
	}

	const handleBlur = () => {
		if (shouldHandleBlur) setIsFocused(false)
	}

	return (
		<div className="input-wrapper">
			<RiSearchLine id="search-icon" />
			<input
				placeholder="Type your course codes..."
				value={input}
				ref={searchBoxRef}
				onChange={(e) => handleInput(e.target.value)}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						handleSearch(e.target.value)
						searchBoxRef.current.blur()
					}
				}}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
		</div>
	)
}
