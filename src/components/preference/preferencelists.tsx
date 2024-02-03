import React, { useState, useEffect } from 'react'

import FreeDay from '@components/preference/preferences/freeday.tsx'
import PriorityOfCourses from '@components/preference/preferences/priorityofcourses.tsx'
import Timeslot from '@components/preference/timeslot.tsx'
import FinalExams from '@components/preference/preferences/finalexams.tsx'
import NCourseFilter from '@components/preference/preferences/ncoursefilter.tsx'
import './preferencelists.css'

export default function PreferenceLists({ courses }) {
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
		<div>
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
