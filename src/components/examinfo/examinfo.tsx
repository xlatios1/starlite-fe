import React from 'react'

export default function ExamInfo({ exam_schedule }) {
	return (
		<>
			<p>Exam schedules</p>
			<hr></hr>
			{exam_schedule.map((exam) => (
				<p key={exam}>{exam}</p>
			))}
		</>
	)
}
