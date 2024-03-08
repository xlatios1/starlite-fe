import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import loadingSlice from './loading/loadingSlice.ts'
import { courseApi } from '@store/course/courseApi.ts'
import courseSlice from './course/courseSlice.ts'
import walkthroughSlice from './walkthrough/walkthroughSlice.ts'
import previewSlice from './preview/previewSlice.ts'
export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
	reducer: {
		loading: loadingSlice.reducer,
		course: courseSlice.reducer,
		preview: previewSlice.reducer,
		walkthrough: walkthroughSlice.reducer,
		[courseApi.reducerPath]: courseApi.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(courseApi.middleware)
	},
})

setupListeners(store.dispatch)
