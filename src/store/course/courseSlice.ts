import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'

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

export type ColorPalette =
	| '--orange'
	| '--yellow'
	| '--green'
	| '--lightblue'
	| '--blue'
	| '--violet'
	| '--purple'
	| '--pink'
	| '--limegreen'
	| '--brown'

export type CourseDetails = {
	[courseCode: string]: {
		name: string
		initialism: string
		academic_units: number
		get_exam_schedule: { date: string; time: string; timecode: string }
		get_common_information: classinfo[] | []
		indexes: indexinfos[]
		colorCode: ColorPalette
	}
}

export type AllPlans = {
	'Plan 1': {
		courses: CourseDetails[]
		CourseColorPalette: ColorPalette[]
	}
	'Plan 2': {
		courses: CourseDetails[]
		CourseColorPalette: ColorPalette[]
	}
	'Plan 3': {
		courses: CourseDetails[]
		CourseColorPalette: ColorPalette[]
	}
}

export type AllPlanDetails = {
	currentPlan: string
	planData: AllPlans
	isDirtyValue: boolean
	isInitialRendered: boolean
}

export const ExistingPlans = ['Plan 1', 'Plan 2', 'Plan 3']
export const CourseColorPalette = [
	'--orange',
	'--yellow',
	'--green',
	'--lightblue',
	'--blue',
	'--violet',
	'--purple',
	'--pink',
	'--limegreen',
	'--brown',
] as ColorPalette[]

const initialState: AllPlanDetails = {
	currentPlan: 'Plan 1',
	planData: {
		'Plan 1': { courses: [], CourseColorPalette },
		'Plan 2': { courses: [], CourseColorPalette },
		'Plan 3': { courses: [], CourseColorPalette },
	},
	isDirtyValue: false,
	isInitialRendered: false,
}

const courseSlice = createSlice({
	name: 'courseSlice',
	initialState,
	reducers: {
		loadInitialCourse: (
			state: AllPlanDetails,
			actions: PayloadAction<AllPlans>
		) => {
			if (!state.isInitialRendered) {
				for (const course in actions.payload) {
					state.planData[course] = actions.payload[course]
				}
				state.isDirtyValue = false
				state.isInitialRendered = true
			}
		},
		updateCourseColorPalette: (
			state: AllPlanDetails,
			actions: PayloadAction<ColorPalette[]>
		) => {
			state.planData[state.currentPlan].CourseColorPalette = actions.payload
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
			const index = state.planData[state.currentPlan].courses.findIndex((c) => {
				return Object.keys(current(c))[0] === actions.payload
			})
			state.planData[state.currentPlan].CourseColorPalette.push(
				state.planData[state.currentPlan].courses[index][actions.payload]
					.colorCode
			)
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
	},
})

export default courseSlice
export const {
	loadInitialCourse,
	updateCourseColorPalette,
	addCourse,
	removeCourse,
	setPlan,
	setCourse,
} = courseSlice.actions
