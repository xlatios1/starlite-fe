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

const loadingActions = loadingSlice.actions
const loadingReducer = loadingSlice.reducer

export default loadingSlice
export { loadingActions, loadingReducer }
