import { TimetableClassData } from '@components/timetable/types/timetableTypes'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type timetableState = {
	timetable:  Array<{
        timetable_data: TimetableClassData[]
        info: [string, string][]
        rank: number
    }>
    totalPage: number
    currentPage: number
}

const initialState: timetableState = {
	timetable: [],
    totalPage: 0,
    currentPage: 1,
}

const timetableSlice = createSlice({
	name: 'timetableSlice',
	initialState,
	reducers: {
		settimetableTimetable: (
			state: timetableState,
			actions: PayloadAction<Array<{
                timetable_data: TimetableClassData[]
                info: [string, string][]
                rank: number
            }>>
		) => {
			state.timetable = actions.payload
            state.totalPage = actions.payload.length
            state.currentPage = 1
		},
	},
})

export default timetableSlice
export const { settimetableTimetable } = timetableSlice.actions
