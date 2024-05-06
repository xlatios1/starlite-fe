import { TimetableClassData } from '@components/timetable/types/timetableTypes'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type timetableState = {
	activeTab: 'fixed slot' | 'timetables'
	timetablePreview: Array<TimetableClassData>
	timetableData: Array<{
		timetable_data: Array<TimetableClassData>
		info: [string, string, string][] //course code, index, color
		rank: number
	}>
	totalPage: number
	currentPage: number
}

const initialState: timetableState = {
	activeTab: 'fixed slot',
	timetablePreview: Array.from({ length: 7 }, () =>
		Array.from({ length: 11 }, () => [])
	),
	timetableData: [],
	totalPage: 0,
	currentPage: 1,
}

const timetableSlice = createSlice({
	name: 'timetableSlice',
	initialState,
	reducers: {
		setActiveTab: (
			state: timetableState,
			actions: PayloadAction<'fixed slot' | 'timetables'>
		) => {
			state.activeTab = actions.payload
		},
		setTimetablePreview: (
			state: timetableState,
			actions: PayloadAction<Array<TimetableClassData>>
		) => {
			state.timetablePreview = actions.payload
		},
		setTimetableData: (
			state: timetableState,
			actions: PayloadAction<
				Array<{
					timetable_data: TimetableClassData[]
					info: [string, string, string][]
					rank: number
				}>
			>
		) => {
			state.timetableData = actions.payload
			state.totalPage = actions.payload.length
		},
		setCurrentPage: (state: timetableState, actions: PayloadAction<number>) => {
			state.currentPage = actions.payload
		},
		resetTimetable: (state: timetableState, actions: PayloadAction<null>) => {
			for (const keys of [
				'activeTab',
				'timetableData',
				'totalPage',
				'currentPage',
			]) {
				state[keys] = initialState[keys]
			}
		},
	},
})

export default timetableSlice
export const {
	setActiveTab,
	setTimetablePreview,
	setTimetableData,
	setCurrentPage,
	resetTimetable,
} = timetableSlice.actions
