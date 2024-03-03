import { createSlice } from '@reduxjs/toolkit'

type LoadingState = {
	isLoading: boolean
}

const initialState: LoadingState = {
	isLoading: false,
}

const loadingSlice = createSlice({
	name: 'loadingSlice',
	initialState,
	reducers: {
		openLoading: (state: LoadingState) => {
			state.isLoading = true
		},
		closeLoading: (state: LoadingState) => {
			state.isLoading = false
		},
	},
})

export default loadingSlice
export const { openLoading, closeLoading } = loadingSlice.actions
