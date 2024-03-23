import React from 'react'
import {
	ToolTip,
	tooltipHelperText,
} from '@components/preference/preferenceUtils.tsx'
import MultiSwitch from '@components/buttons/multiswitch/multiswitch'
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
	courses,
}) {
	const handleFinalExams = (_, option) => {
		dispatchPreference({ type: 'finalExam', value: option })
	}

	return (
		<div className="preference-options finalexam">
			<div className="preference-option-title-container">
				<div className="preference-option-title">
					Final Exams
					<ToolTip text={tooltipHelperText.finalExams} />
				</div>
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
					disabled={courses.length < 2}
				></MultiSwitch>
			</div>
		</div>
	)
}
