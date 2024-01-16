import React from 'react'
import '@styles/checkbox.css'

type checkbox_type = {
	text: string
	handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Checkbox({ text, handleCheckbox }: checkbox_type) {
	return (
		<div className="checkbox option" onChange={handleCheckbox}>
			<input type="checkbox" id={text} />
			<label htmlFor={text}>{text}</label>
		</div>
	)
}
