import React, { useState, useId } from 'react'
import '@styles/timetable.css'

type Details = {
	code: string
	type: string
	group: string
	remark: string
}

type classDetails = { classDetails: Details[]; duration: number }

type TimetableClassData = Array<[] | classDetails>

type TimetableData = Array<TimetableClassData>

type TimeTable = {
	timetable_data: TimetableData
	missed_course: string[][]
	info: string[][]
	setIsConflict: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TimeTable({
	timetable_data,
	missed_course,
	info,
	setIsConflict,
}: TimeTable) {
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
	let gotConflict = false
	for (let col of timetable_data) {
		for (let row = 0; row < 16; row++, unikey++) {
			console.log('ASDSAD', 'duration' in col[row])
			if ('duration' in col[row]) {
				console.log('WHAT', 'duration' in col[row], col[row])
				console.log('?????')
				let classDetails = col[row] as classDetails
				timetable[row].push(
					<td
						rowSpan={classDetails.duration}
						style={{
							color: classDetails.classDetails.length > 1 ? 'red' : '',
						}}
						key={`timeblock ${unikey}-${row}`}
					>
						{classDetails.classDetails.length > 1 ? (gotConflict = true) : null}
						{classDetails.classDetails.map((details: Details) => (
							<p>
								{details.code}
								<br /> {details.type}
								<br /> {details.group}
								<br /> {details.remark}
							</p>
						))}
					</td>
				)
				row += classDetails.duration - 1
			} else {
				timetable[row].push(<td key={`timeblock ${unikey}-${row}`}></td>)
			}
		}
	}

	setIsConflict(gotConflict)

	const handleClick = (e) => {
		e.preventDefault()
		if (info) setIsClicked((prev) => !prev)
	}

	return (
		<div className="conic">
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
