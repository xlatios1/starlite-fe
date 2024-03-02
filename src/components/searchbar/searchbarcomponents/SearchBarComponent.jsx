import React from 'react'
import { RiSearchLine } from 'react-icons/ri'

export const SearchBarComponent = ({
	handleInput,
	input,
	searchBoxRef,
	setIsFocused,
	shouldHandleBlur,
}) => {
	const handleFocus = () => {
		console.log('FOCUSES')
		setIsFocused(true)
	}

	const handleBlur = () => {
		console.log('NOT')
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
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
		</div>
	)
}
