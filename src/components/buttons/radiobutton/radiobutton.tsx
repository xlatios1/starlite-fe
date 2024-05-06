import React from 'react'
import './radiobutton.css'

type RadioButtonProp = {
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
}: RadioButtonProp) {
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
