import React, { useEffect, useState } from 'react'
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
	setCourse,
	setPlan,
	updateCourseColorPalette,
} from '@store/course/courseSlice.ts'
import { MatchCommonTimetable } from '@components/timetable/MatchTimetable.tsx'
import { RootState } from '@store/store'
import { Button } from '@mui/material'
import Notification from '@components/notification/notification.tsx'
const _ = require('lodash')

export default function SavedPlan({
	courses,
	setOrdered,
	setTimetablePreview,
}) {
	const [isInitialRender, setIsInitialRender] = useState(true)
	const { getFirebaseData, setFirebaseData, fetchUserInCache } = UserAuth()

	const user = fetchUserInCache()
	const dispatch = useDispatch()
	const planData = useSelector((state: RootState) => state.course.planData)
	const currentPlan = useSelector(
		(state: RootState) => state.course.currentPlan
	)

	const handleChange = (event: SelectChangeEvent) => {
		dispatch(setPlan(event.target.value as 'Plan 1' | 'Plan 2' | 'Plan 3'))
		setOrdered((prev) => {
			const previous = { ...prev }
			previous.bestChance = false
			return previous
		})
	}

	useEffect(() => {
		dispatch(openLoading())
		getFirebaseData(user)
			.then((data) => {
				if (Object.keys(data).length > 0) {
					dispatch(loadInitialCourse(data))
				}
			})
			.finally(() => {
				setIsInitialRender(false)
				dispatch(closeLoading())
			})
	}, [])

	useEffect(() => {
		if (!isInitialRender) {
			dispatch(setCourse(courses))
		}
		setTimetablePreview(MatchCommonTimetable(courses))
	}, [courses])

	const handleSave = async () => {
		dispatch(openLoading())
		const data = _.cloneDeep(planData[currentPlan])
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
		await setFirebaseData(user, { [currentPlan]: data })
			.then(() => {
				Notification('success', `Successfully saved ${currentPlan}!`, 1000)
			})
			.catch(() => {
				Notification('error', 'An unexpected error has occured (Save)', 3000)
			})
			.finally(() => {
				dispatch(closeLoading())
				setIsInitialRender(false)
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
				<MenuItem value={'Plan 1'}>Plan 1</MenuItem>
				<MenuItem value={'Plan 2'}>Plan 2</MenuItem>
				<MenuItem value={'Plan 3'}>Plan 3</MenuItem>
			</Select>
			<Button variant="contained" size="small" onClick={handleSave}>
				Save
			</Button>
		</FormControl>
	)
}
