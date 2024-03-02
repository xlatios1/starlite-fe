import React from 'react'
import './radiobutton.css'

type RadioButton = {
	handleRadioButton: (...args: any[]) => void
	id: number
	course_code: string
	check: number
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
				id={id.toString()}
				name={course_code}
				key={course_code + id}
				checked={check === +id}
			/>
		</div>
	)
}
