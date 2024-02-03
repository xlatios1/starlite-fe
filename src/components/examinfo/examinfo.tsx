import React from 'react'
import '@styles/examinfo.css'

export default function ExamInfo({ exam_schedule }) {
	return (
		<div className="exam-wrapper">
			<p>Exam schedules</p>
			<hr></hr>
			{exam_schedule.map((exam) => (
				<p key={exam}>{exam}</p>
			))}
		</div>
	)
}
