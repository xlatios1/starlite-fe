import React from 'react'
import { ToolTip, days } from '@components/preference/preferenceUtils.tsx'
import MultiSwitch from '@components/multiswitch/multiswitch.tsx'
import '../preferencelists.css'

export const timeslotOptions = ['Any Time', 'Morning', 'Afternoon', 'Evening']

export default function Timeslot({
	timeslot,
	dispatchPreference,
	handleReset,
}) {
	const handleTimeslot = (text, option) => {
		const newTS = { ...timeslot }
		newTS[text] = option
		dispatchPreference({ type: 'timeslot', value: newTS })
	}

	return (
		<div className="preference-options timeslot">
			<div className="preference-option-title-container">
				<p className="preference-option-title">
					Timeslots
					<ToolTip text={'good!'} />
				</p>
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
							options={timeslotOptions}
							check={timeslot[day]}
						></MultiSwitch>
					</div>
				)
			})}
		</div>
	)
}
