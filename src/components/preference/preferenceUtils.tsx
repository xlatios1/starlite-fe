import React, { useEffect, useState } from 'react'
import MinCourseFilter from './preferences/mincoursefilter'

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

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (showTooltip && !event.target.closest('.tooltip')) {
				setShowTooltip(false)
			}
		}

		document.body.addEventListener('click', handleClickOutside)

		return () => {
			document.body.removeEventListener('click', handleClickOutside)
		}
	}, [showTooltip])

	return (
		<div className={`tooltip ${showTooltip ? 'active' : ''}`}>
			<i
				className="fa fa-question-circle"
				style={{ color: 'grey', fontSize: '10px' }}
				onClick={() => setShowTooltip((prev) => !prev)}
			/>
			<span
				className="tooltip-text"
				onClick={() => setShowTooltip((prev) => !prev)}
			>
				{text}
			</span>
		</div>
	)
}

export const tooltipHelperText = {
	minCourseFilter: 'Will filter off the number of courses mapped accordingly.',
	freeDays: 'Will depriortize timetables that has classes on selected days.',
	timeSlot:
		'Will depriortize timetables that has classes on selected timeslots.',
	finalExams:
		'Will prioritize timetables with courses mapped to the corresponding preference.',
}
