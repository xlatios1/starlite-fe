import React, { useState, useEffect } from 'react'

import MultiSwitch from '@components/multiswitch/multiswitch.tsx'
import './preferencelists.css'
export default function Timeslot({ handlePreference, courses }) {
	const days = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	]

	const [timeslot, setTimeslot] = useState(
		days.reduce((acc, day) => {
			acc[day] = 'Any Time'
			return acc
		}, {})
	)

	const handleTimeslot = (text, option) => {
		setTimeslot((prev) => {
			const newTS = { ...prev }
			newTS[text] = option
			handlePreference('Timeslot', newTS)
			return newTS
		})
	}

	useEffect(() => {
		handlePreference('Timeslot', timeslot)
	}, [courses])

	return (
		<div className="preference-options timeslot">
			<p className="preference-option-title">Timeslots</p>
			{days.map((day) => {
				return (
					<div className="preference-option-timeslot">
						<MultiSwitch
							handleMultiSwitch={handleTimeslot}
							text={day}
							options={['Any Time', 'Morning', 'Afternoon', 'Evening']}
							check={timeslot[day]}
						></MultiSwitch>
					</div>
				)
			})}
		</div>
	)
}
