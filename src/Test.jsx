import React, { useState } from 'react'

function DropdownExample() {
	const [isTextFieldFocused, setIsTextFieldFocused] = useState(false)

	const handleTextFieldFocus = () => {
		setIsTextFieldFocused(true)
	}

	const handleTextFieldBlur = () => {
		// Check if the blur event should be handled or not
		if (!shouldHandleBlur) {
			return
		}
		setIsTextFieldFocused(false)
	}

	const handleOptionClick = () => {
		// Prevent the blur event from being handled
		// when an option is clicked
	}

	const handleOptionMouseDown = () => {
		// Set the flag to indicate that the blur event should not be handled
		setShouldHandleBlur(false)
	}

	const handleOptionMouseUp = () => {
		// Set the flag back to true when the mouse button is released
		setShouldHandleBlur(true)
	}

	const [shouldHandleBlur, setShouldHandleBlur] = useState(true)

	return (
		<div>
			<input
				type="text"
				placeholder="Type here..."
				onFocus={handleTextFieldFocus}
				onBlur={handleTextFieldBlur}
			/>
			{isTextFieldFocused && (
				<div className="dropdown">
					{/* Dropdown content */}
					<ul>
						<li
							onClick={handleOptionClick}
							onMouseDown={handleOptionMouseDown}
							onMouseUp={handleOptionMouseUp} // Added onMouseUp event
						>
							Option 1
						</li>
						<li
							onClick={handleOptionClick}
							onMouseDown={handleOptionMouseDown}
							onMouseUp={handleOptionMouseUp} // Added onMouseUp event
						>
							Option 2
						</li>
						<li
							onClick={handleOptionClick}
							onMouseDown={handleOptionMouseDown}
							onMouseUp={handleOptionMouseUp} // Added onMouseUp event
						>
							Option 3
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}

export default DropdownExample
