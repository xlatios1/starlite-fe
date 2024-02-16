import React, { useState, useEffect } from 'react'

import FreeDay from '@components/preference/preferences/freeday.tsx'
import PriorityOfCourses from '@components/preference/preferences/priorityofcourses.tsx'
import Timeslot from '@components/preference/preferences/timeslot.tsx'
import FinalExams from '@components/preference/preferences/finalexams.tsx'
import NCourseFilter from '@components/preference/preferences/ncoursefilter.tsx'
import {
	days,
	initializeState,
} from '@components/preference/preferenceUtils.tsx'
import './preferencelists.css'

export default function PreferenceLists({ courses, handleApplyPreference }) {
	let course = ['CZ3004', 'CZ3005', 'CZ3006', 'CZ3003']
	const defaultState = {
		nCourseFilter: 0,
		freeDay: [],
		poc: initializeState(course, 0),
		timeslot: initializeState(days, 'Any Time'),
		finalExam: 'Any Exams',
	}
	const [preference, setPreference] = useState(defaultState)

	useEffect(() => {
		setPreference(defaultState)
	}, [courses])

	const handlePreference = (preferenceType: string, values) => {
		setPreference((prev) => {
			const newPreference = { ...prev }
			newPreference[preferenceType] = values
			return newPreference
		})
	}

	const handleReset = (preferenceType: string) => {
		setPreference((prev) => {
			const newPreference = { ...prev }
			switch (preferenceType) {
				case 'nCourseFilter':
					newPreference[preferenceType] = 0
					break
				case 'freeDay':
					newPreference[preferenceType] = []
					break
				case 'poc':
					newPreference[preferenceType] = initializeState(courses, 0)
					break
				case 'timeslot':
					newPreference[preferenceType] = initializeState(days, 'Any Time')
					break
				case 'finalExam':
					newPreference[preferenceType] = 'Any Exams'
					break
			}
			return newPreference
		})
	}

	return (
		<div>
			<div className="preference-container">
				<NCourseFilter
					nCourseFilter={preference.nCourseFilter}
					handlePreference={handlePreference}
					handleReset={handleReset}
					courses={courses}
				/>
				<FreeDay
					freeDay={preference.freeDay}
					handlePreference={handlePreference}
					handleReset={handleReset}
				/>
				<PriorityOfCourses
					poc={preference.poc}
					handlePreference={handlePreference}
					handleReset={handleReset}
					courses={course}
				/>
				<Timeslot
					timeslot={preference.timeslot}
					handlePreference={handlePreference}
					handleReset={handleReset}
				/>
				<FinalExams
					finalExam={preference.finalExam}
					handlePreference={handlePreference}
					handleReset={handleReset}
				/>
				<div className="preference-options setPreference">
					<button
						className="fetch-btn"
						onClick={() => handleApplyPreference(preference)}
					>
						<span className="text">Apply Preference</span>
					</button>
				</div>
			</div>
		</div>
	)
}
