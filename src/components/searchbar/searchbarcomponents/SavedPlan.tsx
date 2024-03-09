import React, { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useDispatch } from 'react-redux'
import { UserAuth } from '@authentications/AuthContext.js'
import { closeLoading, openLoading } from '@store/loading/loadingSlice.ts'
import { setCourse } from '@store/course/courseSlice.ts'
import { MatchCommonTimetable } from '@components/timetable/MatchTimetable.tsx'

export default function SavedPlan({ courses, setOrdered, setTimetablePreview }) {
	const [plan, setPlan] = useState(1)
	const [isInitialRender, setIsInitialRender] = useState(true)
	const { getFirebaseData, setFirebaseData, fetchUserInCache } = UserAuth()
	
	const user = fetchUserInCache()
	const dispatch = useDispatch()
	const handleChange = (event: SelectChangeEvent) => {
		setPlan(+event.target.value)
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
				if (data.hasOwnProperty(`plan ${plan}`)) {
					dispatch(setCourse(data[`plan ${plan}`]))
				} else {
					dispatch(setCourse([]))
				}
				dispatch(closeLoading())
			})
			.finally(() => setIsInitialRender(false))
	}, [plan])

	useEffect(() => {
		if (!isInitialRender) {
			setFirebaseData(user, { [`plan ${plan}`]: courses })
		}
		setTimetablePreview(MatchCommonTimetable(courses))
	}, [courses])

	return (
		<FormControl
			sx={{
				m: 1,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Select
				value={plan.toString()}
				onChange={handleChange}
				displayEmpty
				inputProps={{
					'aria-label': 'Without label',
					MenuProps: { disableScrollLock: true },
				}}
				sx={{ width: '260px', height: '30px' }}
			>
				<MenuItem value={1}>Plan 1</MenuItem>
				<MenuItem value={2}>Plan 2</MenuItem>
				<MenuItem value={3}>Plan 3</MenuItem>
			</Select>
		</FormControl>
	)
}
