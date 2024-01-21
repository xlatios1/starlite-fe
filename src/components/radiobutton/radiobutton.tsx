import React from 'react'
import '@styles/radiobutton.css'

type RadioButton = {
	handleRadioButton: (...args: any[]) => void
	id: string
	course_code: string
	check: string
}

export default function RadioButton({
	handleRadioButton,
	id,
	course_code,
	check,
}: RadioButton) {
	return (
		<div className="radiobutton option">
			<input
				onChange={handleRadioButton}
				type="radio"
				id={id}
				name={course_code}
				key={course_code + id}
				checked={check === id}
			/>
		</div>
	)
}
