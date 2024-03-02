import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import loadingSlice from './loading/loadingSlice.ts'

export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
	reducer: { loading: loadingSlice.reducer },
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat()
	},
})

setupListeners(store.dispatch)
