import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type classinfo = {
	type: string
	group: string
	day: string
	time: string
	venue: string
	remark: string
}

export type indexinfos = {
	id: string
	index: string
	get_information: classinfo[]
	get_filtered_information: classinfo[] | []
	schedule: string
}

export type CourseDetails = {
	[courseCode: string]: {
		name: string
		initialism: string
		academic_units: number
		get_exam_schedule: { date: string; time: string; timecode: string }
		get_common_information: classinfo[] | []
		indexes: indexinfos[]
	}
}

export type AllCourseDetails = {
	courses: CourseDetails[]
}

const initialState: AllCourseDetails = {
	courses: [],
}

const timetableSlice = createSlice({
	name: 'timetableSlice',
	initialState,
	reducers: {
		addCourse: (
			state: AllCourseDetails,
			actions: PayloadAction<CourseDetails>
		) => {
			state.courses.push(actions.payload)
		},
		removeCourse: (state: AllCourseDetails, actions: PayloadAction<string>) => {
			state.courses = state.courses.filter(
				(course) => Object.keys(course)[0] !== actions.payload
			)
		},
		reorderCourses: (
			state: AllCourseDetails,
			actions: PayloadAction<CourseDetails[]>
		) => {
			state.courses = actions.payload
		},
	},
})

export default timetableSlice
export const { addCourse, removeCourse, reorderCourses } =
	timetableSlice.actions
