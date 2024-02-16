import React from 'react'
import { days } from '@components/preference/preferenceUtils.tsx'
import MultiSwitch from '@components/multiswitch/multiswitch.tsx'
import '../preferencelists.css'

export default function Timeslot({ timeslot, handlePreference, handleReset }) {
	const handleTimeslot = (text, option) => {
		const newTS = { ...timeslot }
		newTS[text] = option
		handlePreference('timeslot', newTS)
	}

	return (
		<div className="preference-options timeslot">
			<div className="preference-option-title-container">
				<p className="preference-option-title">Timeslots</p>
				<span
					className="clear-filter-btn"
					onClick={() => handleReset('timeslot')}
				>
					Reset filter
				</span>
			</div>
			{days.map((day) => {
				return (
					<div className="preference-option-timeslot" key={day}>
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
