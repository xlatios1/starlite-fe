import React, { useState } from 'react'
import './timetable.css'
import { TimetableData } from './types/timetableTypes.ts'
import { GenerateTimetable } from './Generatetimetable.tsx'
import TimetableDashboard from './TimetableDashboard.tsx'
import SaveTimetable from './SaveTimetable.tsx'

export default function TimeTable({
	timetable_data,
	info,
	showDashboard,
}: TimetableData) {
	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	const { timetable, hasConflict } = GenerateTimetable(timetable_data, info)
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<div className="conic">
				{hasConflict ? (
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
				) : (
					<></>
				)}
				<TimetableDashboard
					dashboardInfo={info}
					showDashboard={showDashboard}
				/>
				<table
					className="table"
					onClick={() => {
						if (showDashboard) setIsOpen(true)
					}}
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
			</div>
			<SaveTimetable
				open={isOpen}
				setClose={() => setIsOpen(false)}
				data={{ timetable_data, info }}
			></SaveTimetable>
		</>
	)
}
