import React, { useState, useEffect } from 'react'

import FreeDay from '@components/preference/freeday.tsx'
import PriorityOfCourses from '@components/preference/priorityofcourses.tsx'
import Timeslot from '@components/preference/timeslot.tsx'
import FinalExams from '@components/preference/finalexams.tsx'
import NCourseFilter from '@components/preference/ncoursefilter.tsx'
import './preferencelists.css'

PreferenceLists.defaultProps = {
	transformYValue: 0, // Default value for transformYValue
}

export default function PreferenceLists({
	courses,
	toggleCourseList,
	transformYValue,
}) {
	// const initialPriorityOfCourse = courses.reduce((acc, course) => {
	// 	acc[course] = '0'
	// 	return acc
	// }, {})

	const [preference, setPreference] = useState({})

	const handlePreference = (preferenceType, values) => {
		setPreference((prev) => {
			const newPreference = { ...prev }
			newPreference[preferenceType] = values
			return newPreference
		})
	}

	return (
		<div
			className={`preference-wrap ${toggleCourseList ? '' : 'hidden'}`}
			style={{
				transform: toggleCourseList
					? ''
					: `translateY(-${transformYValue - 15}px)`,
			}}
		>
			<div className="preference-container">
				<NCourseFilter handlePreference={handlePreference} courses={courses} />
				<FreeDay handlePreference={handlePreference} courses={courses} />
				<PriorityOfCourses
					handlePreference={handlePreference}
					courses={courses}
				/>
				<Timeslot handlePreference={handlePreference} courses={courses} />
				<FinalExams handlePreference={handlePreference} courses={courses} />
			</div>
		</div>
	)
}
