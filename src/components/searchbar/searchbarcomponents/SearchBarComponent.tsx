import React, { Dispatch, SetStateAction } from 'react'
import { RiSearchLine } from 'react-icons/ri'

type SearchBarComponentProps = {
	handleInput: (value?: string) => Promise<void>
	input: string
	searchBoxRef: React.LegacyRef<HTMLInputElement>
	setIsFocused: Dispatch<SetStateAction<boolean>>
	shouldHandleBlur: boolean
}

export const SearchBarComponent = ({
	handleInput,
	input,
	searchBoxRef,
	setIsFocused,
	shouldHandleBlur,
}: SearchBarComponentProps) => {
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
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
		</div>
	)
}
