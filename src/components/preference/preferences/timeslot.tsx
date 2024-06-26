import React from 'react'
import {
	ToolTip,
	days,
	tooltipHelperText,
} from '@components/preference/preferenceUtils.tsx'
import MultiSwitch from '@components/buttons/multiswitch/multiswitch.tsx'
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
				<div className="preference-option-title">
					Timeslots
					<ToolTip text={tooltipHelperText.timeSlot} />
				</div>
				<span
					className="clear-filter-btn"
					onClick={() => handleReset('timeslot')}
				>
					Reset filter
				</span>
			</div>
			<div className="preference-option-info">
				<div className="preference-option-info-detail">
					<p className="preference-option-info-detail-text">Morning:</p>
					<p className="preference-option-info-detail-timing">8am - 12.30pm</p>
				</div>
				<div className="preference-option-info-detail">
					<p className="preference-option-info-detail-text">Afternoon:</p>
					<p className="preference-option-info-detail-timing">
						12.30pm - 6.30pm
					</p>
				</div>
				<div className="preference-option-info-detail">
					<p className="preference-option-info-detail-text">Evening:</p>
					<p className="preference-option-info-detail-timing">
						6.30pm - 11.30pm
					</p>
				</div>
			</div>
			{days.map((day) => {
				return (
					<div className="preference-option-timeslot" key={day}>
						<MultiSwitch
							handleMultiSwitch={handleTimeslot}
							text={day}
							options={timeslotOptions}
							check={timeslot[day]}
							disabled={false}
						></MultiSwitch>
					</div>
				)
			})}
		</div>
	)
}
