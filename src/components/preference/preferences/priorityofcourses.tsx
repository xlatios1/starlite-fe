import React, { useState, useEffect } from 'react'

import RadioButton from '@components/radiobutton/radiobutton.tsx'
import '../preferencelists.css'

type PriorityOfCourses = {
	handlePreference: (preferenceType: any, preferences: any) => void
	courses: string[]
}

export default function PriorityOfCourses({
	handlePreference,
	courses,
}: PriorityOfCourses) {
	const [poc, setPoc] = useState(
		courses.reduce((acc, course) => {
			acc[course] = '0'
			return acc
		}, {})
	)

	const handlePoc = (course_code, i) => {
		setPoc((prev) => {
			const newPOC = { ...prev }
			newPOC[course_code] = i
			handlePreference('Priority of Course', newPOC)
			return newPOC
		})
	}

	useEffect(() => {
		handlePreference('Priority of Course', poc)
		setPoc((prev) => {
			const newPOC = { ...prev }

			// Remove courses that are not in the updated courses array
			Object.keys(newPOC).forEach((course) => {
				if (!courses.includes(course)) {
					delete newPOC[course]
				}
			})

			// Add new courses with default value '0'
			courses.forEach((course) => {
				if (!(course in newPOC)) {
					newPOC[course] = '0'
				}
			})

			// Refactor the values if set above the n-th boundary
			Object.keys(newPOC).forEach((course) => {
				newPOC[course] = String(Math.min(newPOC[course], courses.length - 1))
			})
			console.log(newPOC)
			return newPOC
		})
	}, [courses])

	return (
		<div className="preference-options priorityofcourses">
			<p className="preference-option-title">Priority of Courses</p>
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
										id={String(i)}
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
