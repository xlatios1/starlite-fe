import React, { useState } from 'react'
import './timetable.css'
import { TimetableData } from './types/timetableTypes.ts'
import { GenerateTimetable } from './GenerateTimetable.tsx'
import { Box, Button } from '@mui/material'
import TimetableDashboard from './TimetableDashboard.tsx'

export default function TimeTable({ timetable_data, info }: TimetableData) {
	const [isClicked, setIsClicked] = useState(false)
	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

	const handleClick = (e) => {
		// e.preventDefault()
		// if (info) setIsClicked((prev) => !prev)
	}

	const { timetable, hasConflict } = GenerateTimetable(timetable_data)

	return (
		<>
			{false && hasConflict ? (
				<></>
			) : (
				<div className="conic">
					{info || !hasConflict ? null : (
						<p
							className="conflict-message"
							style={{
								color: 'red',
								display: 'flex',
								justifyContent: 'center',
								fontWeight: 'bold',
							}}
						>
							Please resolve the course conflict!
						</p>
					)}
					{info ? <TimetableDashboard info={info} /> : <></>}
					<table
						onClick={handleClick}
						className={`table ${isClicked ? 'blurred' : ''}`}
					>
						<tbody>
							<tr key="details">
								<th style={{ width: '60px' }}>Time/Day</th>
								{days.map((day) => {
									return (
										<th style={{ width: '75px' }} key={'DAY' + day}>
											{day}
										</th>
									)
								})}
							</tr>
							{timetable.map((rows, i) => {
								return (
									<tr style={{ height: '30px' }} key={'I' + i}>
										{rows.map((timeblock) => {
											return timeblock
										})}
									</tr>
								)
							})}
						</tbody>
					</table>
					{info ? (
						<div className={`table-info ${isClicked ? 'shown' : ''}`}>
							<div className="table-wrapper">
								<p className="table-content">List of Courses and Indexes</p>
								{info.map(([courseCode, courseNumber], i) => {
									return (
										<p key={'randID' + i} className="table-content">
											{courseCode}: {courseNumber}
										</p>
									)
								})}
								<Box display="flex" justifyContent="space-around" m="10px">
									<Button variant="contained">Set Favourite</Button>
									<Button variant="contained" onClick={handleClick}>
										Back
									</Button>
								</Box>
							</div>
						</div>
					) : (
						<></>
					)}
				</div>
			)}
		</>
	)
}
