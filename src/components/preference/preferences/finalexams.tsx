import React from 'react'
import { ToolTip } from '@components/preference/preferenceUtils.tsx'
import MultiSwitch from '@components/multiswitch/multiswitch.tsx'
import '../preferencelists.css'

export const finalExamOptions = [
	'Any Exams',
	'With Final Exams',
	'Without Final Exams',
]

export default function FinalExams({
	finalExam,
	dispatchPreference,
	handleReset,
}) {
	const handleFinalExams = (_, option) => {
		dispatchPreference({ type: 'finalExam', value: option })
	}

	const finalExamTooltip =
		'Choose between with or without final exams, the chosen one will have priority.'

	return (
		<div className="preference-options finalexam">
			<div className="preference-option-title-container">
				<p className="preference-option-title">
					Final Exams
					<ToolTip text={finalExamTooltip} />
				</p>
				<span
					className="clear-filter-btn"
					onClick={() => handleReset('finalExam')}
				>
					Reset filter
				</span>
			</div>
			<div className="preference-option-finalexam">
				<MultiSwitch
					handleMultiSwitch={handleFinalExams}
					text={''}
					options={finalExamOptions}
					check={finalExam}
				></MultiSwitch>
			</div>
		</div>
	)
}
