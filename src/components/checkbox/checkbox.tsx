import React from 'react'
import '@styles/checkbox.css'

type CheckBoxType = {
	handleCheckbox: (...args: any[]) => void
	text: string
	check: string[]
}

export default function CheckBox({
	handleCheckbox,
	text,
	check,
}: CheckBoxType) {
	return (
		<div className="checkbox option">
			<input
				type="checkbox"
				id={text}
				onChange={handleCheckbox}
				checked={check.includes(text)}
			/>
			<label htmlFor={text}>{text}</label>
		</div>
	)
}
