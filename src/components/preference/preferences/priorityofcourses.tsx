import React from 'react'

import RadioButton from '@components/radiobutton/radiobutton.tsx'
import '../preferencelists.css'

export default function PriorityOfCourses({
	poc,
	dispatchPreference,
	handleReset,
	courses,
}) {
	const handlePoc = (course_code, i) => {
		const newPOC = { ...poc }
		newPOC[course_code] = +i
		dispatchPreference({ type: 'poc', value: newPOC })
	}

	return (
		<div className="preference-options priorityofcourses">
			<div className="preference-option-title-container">
				<p className="preference-option-title">Priority of Courses</p>
				<span className="clear-filter-btn" onClick={() => handleReset('poc')}>
					Reset filter
				</span>
			</div>
			<div className="preference-option-headers">
				<p className="preference-option-header course-code">Course</p>
				<div className="preference-option-header ranking">
					{courses.map((c, i) => {
						return (
							<p className="preference-option-header rank" key={i}>
								{i}
							</p>
						)
					})}
				</div>
			</div>
			{courses.map((course_code) => {
				return (
					<div className="preference-option-course" key={course_code}>
						<p className="preference-option-course-code">{course_code}</p>
						<div className="preference-option-radiobuttons">
							{courses.map((c, i) => {
								return (
									<RadioButton
										handleRadioButton={(e) => {
											handlePoc(course_code, String(i))
										}}
										course_code={course_code}
										id={i}
										check={poc[course_code]}
										key={i}
									></RadioButton>
								)
							})}
						</div>
					</div>
				)
			})}
		</div>
	)
}
