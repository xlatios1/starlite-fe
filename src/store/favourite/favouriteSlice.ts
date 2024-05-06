import {
	Info,
	TimetableClassData,
} from '@components/timetable/types/timetableTypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'

export type FavoriteTimetable = {
	name: string
	timetable_data: Array<TimetableClassData>
	info: Info
}

export type FavouriteState = {
	favouriteArray: Array<FavoriteTimetable>
	oldFavouriteArray: Array<FavoriteTimetable>
	isInitialRendered: boolean
	isDirty: boolean
}

const initialState: FavouriteState = {
	favouriteArray: [],
	oldFavouriteArray: [],
	isInitialRendered: false,
	isDirty: false,
}

const favouriteSlice = createSlice({
	name: 'favouriteSlice',
	initialState,
	reducers: {
		loadInitialFavourites: (
			state: FavouriteState,
			actions: PayloadAction<FavoriteTimetable[]>
		) => {
			if (!state.isInitialRendered) {
				state.favouriteArray = actions.payload ?? []
				state.oldFavouriteArray = actions.payload ?? []
				state.isInitialRendered = true
			}
		},
		addNewFavorite: (
			state: FavouriteState,
			actions: PayloadAction<FavoriteTimetable>
		) => {
			state.favouriteArray.push(actions.payload)
			state.isDirty = true
		},
		renameFavorite: (
			state: FavouriteState,
			actions: PayloadAction<{ target: number; value: string }>
		) => {
			if (
				!state.favouriteArray
					.map((f) => f.name)
					.includes(actions.payload.value) &&
				actions.payload.value.length < 13
			) {
				state.favouriteArray[actions.payload.target].name =
					actions.payload.value
				state.isDirty = !_.isEqual(
					state.oldFavouriteArray,
					state.favouriteArray
				)
			}
		},
		removeFavorite: (state: FavouriteState, actions: PayloadAction<number>) => {
			state.favouriteArray.splice(actions.payload, 1)
			state.isDirty = true
		},
		savedFavorite: (state: FavouriteState, actions: PayloadAction<null>) => {
			state.oldFavouriteArray = state.favouriteArray
			state.isDirty = false
		},
		revertFavorite: (state: FavouriteState, actions: PayloadAction<null>) => {
			state.favouriteArray = state.oldFavouriteArray
			state.isDirty = false
		},
	},
})

export default favouriteSlice
export const {
	loadInitialFavourites,
	addNewFavorite,
	renameFavorite,
	removeFavorite,
	savedFavorite,
	revertFavorite,
} = favouriteSlice.actions
