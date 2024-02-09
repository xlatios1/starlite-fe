import React, { useState, useId } from 'react'
import '@styles/timetable.css'
import { convertRemarks } from '@utils/parsers.ts'

type Details = {
	code: string
	type: string
	group: string
	time: { start: number; duration: number }
	remark: string
}

type classDetails = { classDetails: Details[]; duration: number }

type TimetableClassData = Array<[] | classDetails>

type TimetableData = {
	timetable_data: Array<TimetableClassData>
	info: null | [string, string][]
}

export default function TimeTable({ timetable_data, info }: TimetableData) {
	const randID = useId()
	const [isClicked, setIsClicked] = useState(false)
	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

	// [[[],[],[],["cz3005","lec","2"],[]],   //mon
	//  [[],[],["cz3005","tut","1"],[],[],[]]]  //tues

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

	let timetable = Array.from({ length: 16 }, (_, i) => [
		<td key={`time ${timeArr[i]}`}>{timeArr[i]}</td>,
	])

	const checkConflictWeeks = (classDetails: classDetails): boolean => {
		// classDetails.classDetails.map((i) => console.log(i.remark))
		// return true
		let elementsSet = new Set()
		for (const slot of classDetails.classDetails) {
			let remarks = convertRemarks(slot.remark)
			for (let i = 0; i < slot.time.duration; i++) {
				for (const wk of remarks) {
					let newEle = `${slot.time.start}${i}${wk}`
					console.log(newEle, elementsSet)
					if (elementsSet.has(newEle)) {
						return true
					}
					elementsSet.add(newEle) // Add the element to the set
				}
			}
		}
		return false
	}

	let unikey = 1
	let hasConflict = false
	console.log(timetable_data)
	for (let col of timetable_data) {
		for (let row = 0; row < 16; row++, unikey++) {
			if ('duration' in col[row]) {
				let classDetails = col[row] as classDetails
				let innerConflict = false
				if (classDetails.classDetails.length > 1) {
					innerConflict = checkConflictWeeks(classDetails)
				}
				timetable[row].push(
					<td
						key={`timeblock ${unikey}-${row}`}
						rowSpan={classDetails.duration}
						style={{
							color: innerConflict ? 'red' : '',
						}}
					>
						<div>
							{classDetails.classDetails.map((details: Details, i: number) => (
								<>
									<hr />
									<p key={`details ${unikey}-${i}-${row}-${details.code}`}>
										{details.code}
										<br /> {details.type}
										<br /> {details.group}
										<br /> {details.remark}
									</p>
									<hr />
								</>
							))}
						</div>
					</td>
				)
				row += classDetails.duration - 1
				hasConflict = hasConflict || innerConflict
			} else {
				timetable[row].push(<td key={`timeblock ${unikey}-${row}`}></td>)
			}
		}
	}

	const handleClick = (e) => {
		e.preventDefault()
		if (info) setIsClicked((prev) => !prev)
	}

	return (
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