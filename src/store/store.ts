import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import loadingSlice from './loading/loadingSlice.ts'
import { timetableApi } from '@store/timetable/timetableApi.ts'
import timetableSlice from './timetable/timetableSlice.ts'
import walkthroughSlice from './walkthrough/walkthroughSlice.ts'
export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
	reducer: {
		loading: loadingSlice.reducer,
		timetable: timetableSlice.reducer,
		walkthrough: walkthroughSlice.reducer,
		[timetableApi.reducerPath]: timetableApi.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(timetableApi.middleware)
	},
})

setupListeners(store.dispatch)
