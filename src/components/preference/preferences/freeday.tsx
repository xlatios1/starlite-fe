import React from 'react'
import Checkbox from '@components/buttons/checkbox/checkbox.tsx'
import {
	ToolTip,
	days,
	tooltipHelperText,
} from '@components/preference/preferenceUtils.tsx'
import '../preferencelists.css'

export default function FreeDay({ freeDay, dispatchPreference, handleReset }) {
	const handleFreeDays = (option) => {
		let newFreeDays
		if (freeDay.includes(option)) {
			newFreeDays = freeDay.filter((day) => day !== option)
		} else {
			newFreeDays = [...freeDay, option]
		}
		dispatchPreference({ type: 'freeDay', value: newFreeDays })
	}

	return (
		<div className="preference-options freeday">
			<div className="preference-option-title-container">
				<div className="preference-option-title">
					Free days
					<ToolTip text={tooltipHelperText.freeDays} />
				</div>
				<span
					className="clear-filter-btn"
					onClick={() => handleReset('freeDay')}
				>
					Reset filter
				</span>
			</div>
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
