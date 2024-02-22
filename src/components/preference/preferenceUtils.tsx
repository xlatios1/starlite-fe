import React, { useState } from 'react'

export const days = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
]

export const initializeState = (
	options: string[],
	defaultValue: string | number
): { [acc: string]: number | string } => {
	return options.reduce((acc, day) => {
		acc[day] = defaultValue
		return acc
	}, {})
}

export function ToolTip({ text }) {
	const [showTooltip, setShowTooltip] = useState(false)
	return (
		<div className={`tooltip ${showTooltip ? 'active' : ''}`}>
			<i
				className="fa fa-question-circle"
				style={{ color: 'grey', fontSize: '10px' }}
				onClick={() => setShowTooltip((prev) => !prev)}
			/>
			<span className="tooltip-text">{text}</span>
		</div>
	)
}
