import React, { useState, useId } from 'react'
import '@styles/timetable.css'

export default function TimeTable({ timetable, info }) {
	const randID = useId()
	const [isClicked, setIsClicked] = useState(false)
	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

	// [[[],[],[],["cz3005","lec","2"],[]],   //mon
	//  [[],[],["cz3005","tut","1"],[],[],[]]]  //tues

	const handleClick = (e) => {
		e.preventDefault()
		if (info) setIsClicked((prev) => !prev)
	}

	return (
		<div className="conic">
			{/* {info || !gotConflict ? null : (
				<p
					style={{
						color: 'red',
						display: 'flex',
						justifyContent: 'center',
						fontWeight: 'bold',
					}}
				>
					Please resolve the course conflict!
				</p>
			)} */}
			<table
				onClick={handleClick}
				className={isClicked ? 'table blurred' : 'table'}
			>
				<tbody>
					<tr key="details">
						<th style={{ width: '60px' }}>Time/Day</th>
						{days.map((day) => {
							return (
								<th style={{ width: '75px' }} key={day}>
									{day}
								</th>
							)
						})}
					</tr>
					{timetable.map((rows, i) => {
						return (
							<tr style={{ height: '30px' }} key={i}>
								{rows.map((timeblock) => {
									return timeblock
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
			{isClicked ? (
				<div className="table-info" onClick={handleClick}>
					<div className="table-wrapper">
						<p className="table-content">List of courses with indexes</p>
						{info.map(([courseCode, courseNumber]) => {
							return (
								<p key={randID} className="table-content">
									{courseCode}: {courseNumber}
								</p>
							)
						})}
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	)
}
