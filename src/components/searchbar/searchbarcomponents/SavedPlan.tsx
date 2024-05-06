import React, { Dispatch, SetStateAction, useEffect } from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useDispatch, useSelector } from 'react-redux'
import { UserAuth } from '@authentications/AuthContext.js'
import { closeLoading, openLoading } from '@store/loading/loadingSlice.ts'
import {
	CourseColorPalette,
	CourseDetails,
	loadInitialCourse,
	setPlan,
	updateCourseColorPalette,
	syncCourse,
} from '@store/course/courseSlice.ts'
import {
	resetTimetable,
	setTimetablePreview,
} from '@store/timetable/timetableSlice.ts'
import { MatchCommonTimetable } from '@components/timetable/MatchTimetable.tsx'
import { RootState } from '@store/store'
import { Button } from '@mui/material'
import Notification from '@components/notification/notification.tsx'

const _ = require('lodash')

type SavedPlanProps = {
	courses: CourseDetails[]
	setOrdered: Dispatch<SetStateAction<{ bestChance: boolean; noExams: number }>>
}

export default function SavedPlan({ courses, setOrdered }: SavedPlanProps) {
	const { getFirebaseData, setFirebaseData, fetchUserInCache } = UserAuth()

	const dispatch = useDispatch()
	const planData = useSelector((state: RootState) => state.course.planData)

	const isCourseInitialRendered = useSelector(
		(state: RootState) => state.course.isInitialRendered
	)
	const currentPlan = useSelector(
		(state: RootState) => state.course.currentPlan
	) as 'Plan 1' | 'Plan 2' | 'Plan 3'

	const handleChange = (event: SelectChangeEvent) => {
		dispatch(setPlan(event.target.value as 'Plan 1' | 'Plan 2' | 'Plan 3'))
		dispatch(resetTimetable())
		setOrdered((prev) => {
			const previous = { ...prev }
			previous.bestChance = false
			return previous
		})
	}

	useEffect(() => {
		dispatch(openLoading())
		getFirebaseData(fetchUserInCache())
			.then(({ status, data, message }) => {
				switch (status) {
					case 200:
						const { createdAt, favourites, ...plans } = data
						if (!isCourseInitialRendered) dispatch(loadInitialCourse(plans))
						break
					case 204:
						break
					case 500:
						Notification('error', message, 2000)
						break
					default:
						break
				}
			})
			.catch(() => {
				Notification(
					'error',
					'An unexpected error has occured (Load Plans)',
					2000
				)
			})
			.finally(() => {
				dispatch(closeLoading())
			})
	}, [])

	useEffect(() => {
		dispatch(setTimetablePreview(MatchCommonTimetable(courses)))
	}, [courses])

	const handleSave = async () => {
		dispatch(openLoading())
		const { isDirty, ...data } = _.cloneDeep(planData[currentPlan])
		let missingPalette
		if (
			data.CourseColorPalette.length + data.courses.length !==
			CourseColorPalette.length
		) {
			let curPalette = [
				...data.CourseColorPalette,
				...planData[currentPlan].courses.map(
					(c: CourseDetails) => Object.values(c)[0].colorCode
				),
			]
			missingPalette = _.difference([...CourseColorPalette], curPalette)
			data.CourseColorPalette = [...data.CourseColorPalette, ...missingPalette]
			dispatch(
				updateCourseColorPalette([
					...data.CourseColorPalette,
					...missingPalette,
				])
			)
		}
		await setFirebaseData(fetchUserInCache(), { [currentPlan]: data })
			.then(() => {
				dispatch(syncCourse())
				Notification('success', `Successfully saved ${currentPlan}!`, 1000)
			})
			.catch(() => {
				Notification('error', 'An unexpected error has occured (Save)', 2000)
			})
			.finally(() => {
				dispatch(closeLoading())
			})
	}

	return (
		<FormControl
			sx={{
				m: 1,
				display: 'flex',
				width: '100%',
				justifyContent: 'space-around',
				alignItems: 'center',
				flexDirection: 'row',
			}}
		>
			<Select
				value={currentPlan}
				onChange={handleChange}
				displayEmpty
				inputProps={{
					'aria-label': 'Without label',
					MenuProps: { disableScrollLock: true },
				}}
				sx={{ width: '180px', height: '30px' }}
			>
				<MenuItem value={'Plan 1'}>{`Plan 1 ${
					planData['Plan 1'].isDirty ? '(unsaved)' : ''
				}`}</MenuItem>
				<MenuItem value={'Plan 2'}>{`Plan 2 ${
					planData['Plan 2'].isDirty ? '(unsaved)' : ''
				}`}</MenuItem>
				<MenuItem value={'Plan 3'}>{`Plan 3 ${
					planData['Plan 3'].isDirty ? '(unsaved)' : ''
				}`}</MenuItem>
			</Select>
			<Button variant="contained" size="small" onClick={handleSave}>
				Save
			</Button>
		</FormControl>
	)
}
