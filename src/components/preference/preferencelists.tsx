import React, { useState, useEffect, useReducer } from 'react'

import FreeDay from '@components/preference/preferences/freeday.tsx'
// import PriorityOfCourses from '@components/preference/preferences/priorityofcourses.tsx'
import Timeslot from '@components/preference/preferences/timeslot.tsx'
import FinalExams from '@components/preference/preferences/finalexams.tsx'
import MinCourseFilter from '@components/preference/preferences/mincoursefilter.tsx'
import {
	days,
	initializeState,
} from '@components/preference/preferenceUtils.tsx'
import './preferencelists.css'

export default function PreferenceLists({ courses, handleApplyPreference }) {
	const initialState = {
		minCourseFilter: 1,
		freeDay: [],
		// poc: initializeState(courses, 0),
		timeslot: initializeState(days, 'Any Time'),
		finalExam: 'Any Exams',
	}

	const reducer = (state: typeof initialState, action) => {
		switch (action.type) {
			case 'reset':
				return action.value
			default:
				return { ...state, [action.type]: action.value }
		}
	}
	const [curCourse, setCurCourse] = useState([])
	const [statePreference, dispatchPreference] = useReducer(
		reducer,
		initialState
	)

	useEffect(() => {
		if (
			JSON.stringify(curCourse.slice().sort()) !==
			JSON.stringify(courses.slice().sort())
		) {
			dispatchPreference({ type: 'reset', value: initialState })
			setCurCourse(courses)
		}
	}, [courses])

	const handleReset = (preferenceType: string) => {
		dispatchPreference({
			type: preferenceType,
			value: initialState[preferenceType],
		})
	}

	return (
		<div>
			<div className="preference-container">
				<MinCourseFilter
					minCourseFilter={statePreference.minCourseFilter}
					dispatchPreference={dispatchPreference}
					handleReset={handleReset}
					courses={courses}
				/>
				<FreeDay
					freeDay={statePreference.freeDay}
					dispatchPreference={dispatchPreference}
					handleReset={handleReset}
				/>
				{/* <PriorityOfCourses
					poc={statePreference.poc}
					dispatchPreference={dispatchPreference}
					handleReset={handleReset}
					courses={courses}
				/> */}
				<Timeslot
					timeslot={statePreference.timeslot}
					dispatchPreference={dispatchPreference}
					handleReset={handleReset}
				/>
				<FinalExams
					finalExam={statePreference.finalExam}
					dispatchPreference={dispatchPreference}
					handleReset={handleReset}
				/>
				<div className="preference-options setPreference">
					<button
						className="fetch-btn"
						onClick={() => handleApplyPreference(statePreference)}
					>
						<span className="text">Apply Preference</span>
					</button>
				</div>
			</div>
		</div>
	)
}
