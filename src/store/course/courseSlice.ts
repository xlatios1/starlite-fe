import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import React from 'react'

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

export type FavoriteTimetable = React.JSX.Element[][]

export type AllPlans = {
	'Plan 1': {
		courses: CourseDetails[]
		favorite: FavoriteTimetable
	}
	'Plan 2': {
		courses: CourseDetails[]
		favorite: FavoriteTimetable
	}
	'Plan 3': {
		courses: CourseDetails[]
		favorite: FavoriteTimetable
	}
}

export type AllPlanDetails = {
	currentPlan: string
	planData: AllPlans
	isDirtyValue: boolean
}

export const ExistingPlans = ['Plan 1', 'Plan 2', 'Plan 3']

const initialState: AllPlanDetails = {
	currentPlan: 'Plan 1',
	planData: {
		'Plan 1': { courses: [], favorite: [] },
		'Plan 2': { courses: [], favorite: [] },
		'Plan 3': { courses: [], favorite: [] },
	},
	isDirtyValue: false,
}

const courseSlice = createSlice({
	name: 'courseSlice',
	initialState,
	reducers: {
		loadInitialCourse: (
			state: AllPlanDetails,
			actions: PayloadAction<AllPlans>
		) => {
			console.log('SET INITIAL DATA AS: ', actions.payload)
			state.planData = actions.payload
			state.isDirtyValue = false
		},
		addCourse: (
			state: AllPlanDetails,
			actions: PayloadAction<CourseDetails>
		) => {
			state.planData[state.currentPlan].courses.push(actions.payload)
			state.isDirtyValue = true
		},
		removeCourse: (state: AllPlanDetails, actions: PayloadAction<string>) => {
			state.planData[state.currentPlan].courses = state.planData[
				state.currentPlan
			].courses.filter(
				(course: string) => Object.keys(course)[0] !== actions.payload
			)
			state.isDirtyValue = true
		},
		setPlan: (
			state: AllPlanDetails,
			actions: PayloadAction<'Plan 1' | 'Plan 2' | 'Plan 3'>
		) => {
			if (ExistingPlans.includes(actions.payload)) {
				state.currentPlan = actions.payload
			}
		},
		setCourse: (
			state: AllPlanDetails,
			actions: PayloadAction<CourseDetails[]>
		) => {
			state.planData[state.currentPlan].courses = actions.payload
			state.isDirtyValue = true
		},
		setFavorite: (
			state: AllPlanDetails,
			actions: PayloadAction<FavoriteTimetable>
		) => {
			state.planData[state.currentPlan].favorite = actions.payload
			state.isDirtyValue = true
		},
	},
})

export default courseSlice
export const {
	loadInitialCourse,
	addCourse,
	removeCourse,
	setPlan,
	setCourse,
	setFavorite,
} = courseSlice.actions
