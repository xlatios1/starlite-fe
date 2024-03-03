import { createSlice } from '@reduxjs/toolkit'

type WalkthroughState = {
	walkthrough: number
}

const initialState: WalkthroughState = {
	walkthrough: 0,
}

const walkthroughSlice = createSlice({
	name: 'walkthroughSlice',
	initialState,
	reducers: {
		setWalkthough: (state: WalkthroughState, action) => {
			state.walkthrough = action.payload
		},
	},
})

export const { setWalkthough } = walkthroughSlice.actions
export const walkthroughReducer = walkthroughSlice.reducer
export default walkthroughSlice
