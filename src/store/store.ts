import {
	PayloadAction,
	combineReducers,
	configureStore,
} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import loadingSlice from './loading/loadingSlice.ts'
import { courseApi } from '@store/course/courseApi.ts'
import courseSlice from './course/courseSlice.ts'
import walkthroughSlice from './walkthrough/walkthroughSlice.ts'
import previewSlice from './preview/previewSlice.ts'
import timetableSlice from './timetable/timetableSlice.ts'

const appReducer = combineReducers({
	loading: loadingSlice.reducer,
	course: courseSlice.reducer,
	preview: previewSlice.reducer,
	timetable: timetableSlice.reducer,
	walkthrough: walkthroughSlice.reducer,
	[courseApi.reducerPath]: courseApi.reducer,
})

const rootReducer = (
	state: ReturnType<typeof appReducer> | undefined,
	action: PayloadAction<string | null>
) => {
	if (action.type === 'LOGOUT') {
		return appReducer(undefined, action)
	}
	return appReducer(state, action)
}

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(courseApi.middleware)
	},
})

setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
