import React, { useState, useEffect } from 'react'
import Checkbox from '@components/checkbox/checkbox.tsx'

import '../preferencelists.css'

export default function FreeDay({ handlePreference, courses }) {
	const days = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	]

	const [freeDay, setFreeDay] = useState([])

	const handleFreeDays = (option) => {
		setFreeDay((prev) => {
			let newFreeDays
			if (prev.includes(option)) {
				newFreeDays = prev.filter((day) => day !== option)
			} else {
				newFreeDays = [...prev, option]
			}
			handlePreference('Free days', newFreeDays)
			return newFreeDays
		})
	}

	useEffect(() => {
		handlePreference('Free days', freeDay)
	}, [courses])

	return (
		<div className="preference-options freeday">
			<p className="preference-option-title">Free days</p>
			{days.map((option) => {
				return (
					<div className="preference-option-freeday" key={option}>
						<Checkbox
							key={option}
							handleCheckbox={() => {
								handleFreeDays(option)
							}}
							text={option}
							check={freeDay}
						/>
					</div>
				)
			})}
		</div>
	)
}
