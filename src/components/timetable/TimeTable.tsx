import React, { EventHandler } from 'react'
import { useState, useId } from 'react'
import '@styles/timetable.css'

type timetable = {
	timetable_data: string[][] | number[][]
	missed_course: string[][]
	info: string[][]
}

export default function TimeTable({
	timetable_data,
	missed_course,
	info,
	exam_schedule,
}: timetable) {
	const randID = useId()
	const [isClicked, setIsClicked] = useState(false)
	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	const timeArr = [
		'0800-0830', //0
		'0830-0930', //1
		'0930-1030', //2
		'1030-1130', //3
		'1130-1230', //4
		'1230-1330', //5
		'1330-1430', //6
		'1430-1530', //7
		'1530-1630', //8
		'1630-1730', //9
		'1730-1830', //10
		'1830-1930', //11
		'1930-2030', //12
		'2030-2130', //13
		'2130-2230', //14
		'2230-2330', //15
	]
	// [[[],[],[],["cz3005","lec","2"],[]],   //mon
	//  [[],[],["cz3005","tut","1"],[],[],[]]]  //tues
	let timetable = Array.from({ length: 16 }, (_, i) => [
		<td key={`time ${timeArr[i]}`}>{timeArr[i]}</td>,
	])

	let unikey = 1
	console.log(info)
	for (let col of timetable_data) {
		for (let row = 0; row < 16; row++) {
			if (col[row] === undefined) {
				timetable[row].push(<td key={`timeblock ${unikey}-${row}`}></td>)
			} else {
				if (col[row][2] > 1) {
					timetable[row].push(
						<td rowSpan={col[row][2]} key={`timeblock ${unikey}-${row}`}>
							{col[row][0]} {col[row][1]} {col[row][3]}
						</td>
					)
					row += col[row][2] - 1
				} else
					timetable[row].push(
						<td key={`timeblock ${unikey}-${row}`}>
							{col[row][0]} {col[row][1]} {col[row][3]}
						</td>
					)
			}
		}
		unikey++
	}

	const handleClick = (e) => {
		e.preventDefault()
		setIsClicked((prev) => !prev)
	}

	return (
		<div className="conic">
			<p>Exam schedules</p>
			{exam_schedule.map((exam) => (
				<p>{exam}</p>
			))}
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
			{missed_course.length !== 0 ? (
				<p>The following courses clash: {missed_course.join(', ')}</p>
			) : (
				<></>
			)}
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
