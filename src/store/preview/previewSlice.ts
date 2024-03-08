import { TimetableClassData } from '@components/timetable/types/timetableTypes'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type PreviewState = {
	preview: Array<TimetableClassData>
}

const initialState: PreviewState = {
	preview: Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	),
}

const previewSlice = createSlice({
	name: 'previewSlice',
	initialState,
	reducers: {
		setPreviewTimetable: (
			state: PreviewState,
			actions: PayloadAction<Array<TimetableClassData>>
		) => {
			state.preview = actions.payload
		},
	},
})

export default previewSlice
export const { setPreviewTimetable } = previewSlice.actions
