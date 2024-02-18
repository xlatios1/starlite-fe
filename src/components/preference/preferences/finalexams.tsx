import React from 'react'

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

	return (
		<div className="preference-options finalexam">
			<div className="preference-option-title-container">
				<p className="preference-option-title">Final Exams</p>
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
