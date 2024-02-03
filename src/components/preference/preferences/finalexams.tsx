import React, { useState, useEffect } from 'react'

import MultiSwitch from '@components/multiswitch/multiswitch.tsx'
import '../preferencelists.css'

export default function FinalExams({ handlePreference, courses }) {
	const finalExamOptions = [
		'Any Exams',
		'With Final Exams',
		'Without Final Exams',
	]

	const [finalexam, setFinalExam] = useState('Any Exams')

	const handleFinalExams = (text, option) => {
		setFinalExam((prev) => {
			handlePreference('Final Exam', option)
			return option
		})
	}

	useEffect(() => {
		handlePreference('Final Exam', finalexam)
	}, [courses])

	return (
		<div className="preference-options finalexam">
			<p className="preference-option-title">Final Exams</p>
			<div className="preference-option-finalexam">
				<MultiSwitch
					handleMultiSwitch={handleFinalExams}
					text={''}
					options={finalExamOptions}
					check={finalexam}
				></MultiSwitch>
			</div>
		</div>
	)
}
