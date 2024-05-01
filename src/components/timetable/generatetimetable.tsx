import React from 'react'
import {
	checkConflictWeeks,
	intToTimeslot,
	timeArr,
} from '@components/timetable/utils/timetableUtils.ts'
import type {
	ClassDetails,
	Details,
	Info,
	TimetableClassData,
} from '@components/timetable/types/timetableTypes.ts'

export const GenerateTimetable = (
	timetable_data: Array<TimetableClassData>,
	info: Info | null
) => {
	let length = 16
	for (; length > 11; length--) {
		const sliced = timetable_data.map((col) => col.slice(length - 1, length))
		if (!sliced.flat().every((data) => Array.isArray(data))) {
			break
		}
	}

	const colorCodedInfo = {}
	if (info) {
		info.map((data) => (colorCodedInfo[data[0]] = data[2]))
	}

	let timetable = Array.from({ length }, (_, i) => [
		<td key={`time ${timeArr[i]}`}>{timeArr[i]}</td>,
	])

	let unikey = 1
	let hasConflict = false

	const handleMultipleClass = (input: Details[], innerConflict: boolean) => {
		const baseTime = Math.min(...input.map((data) => data.time.start))
		let beautify: Details[][] = Array.from({ length: input.length }, () => [])
		input.map((details: Details) =>
			beautify[details.time.start - baseTime].push(details)
		)
		let returnValue = []
		let carryOver = 0
		for (const classes of beautify) {
			if (classes.length > 0) {
				returnValue.push(
					<tr
						key={`details multi-row-${classes[0].time.start}-${classes[0].type}`}
					>
						{
							// eslint-disable-next-line no-loop-func
							classes.map((class_, i) => {
								carryOver = Math.max(carryOver, class_.time.duration)
								return (
									<td
										key={`details multi-${i}-${class_.code}-${class_.type}-${class_.time.duration}`}
										rowSpan={class_.time.duration}
										style={{
											color: innerConflict ? 'red' : '',
											// border: `5px solid var(${
											// 	colorCodedInfo[details[0].code]
											// })`,
											backgroundColor: `var(${colorCodedInfo[class_.code]})`,
											borderRadius: '3px',
											minWidth: '70px',
										}}
									>
										{class_.code}
										<br /> {class_.type}
										<br /> {class_.group}
										<br /> {class_.remark}
										{/* {class_.remark !== '' && <br />}
									<br />{' '}
									{intToTimeslot(class_.time.start, class_.time.duration)} */}
									</td>
								)
							})
						}
					</tr>
				)
			} else {
				// add an empty placeholder if required
				if (carryOver !== 0) {
					returnValue.push(
						<tr key={`details multi-row-placeholder`}>
							<td />
						</tr>
					)
				}
			}
			carryOver -= 1
		}
		return returnValue
	}
	for (const col of timetable_data) {
		for (let row = 0; row < length; row++, unikey++) {
			if ('duration' in col[row]) {
				const classDetails = col[row] as ClassDetails
				const details = classDetails.classDetails as Details[]
				let innerConflict = false
				if (details.length > 1) {
					innerConflict = checkConflictWeeks(classDetails)
				}
				timetable[row].push(
					<td
						key={`details single-${unikey}-${row}-${details[0].code}-${details[0].time}`}
						rowSpan={classDetails.duration}
						style={{
							color: innerConflict ? 'red' : '',
							// border: `5px solid var(${
							// 	colorCodedInfo[details[0].code]
							// })`,
							backgroundColor:
								details.length === 1
									? `var(${colorCodedInfo[details[0].code]})`
									: '',
							borderRadius: '3px',
						}}
					>
						{details.length === 1 ? (
							<div
								key={`details single-${unikey}-${row}-${details[0].code}-${details[0].time}`}
							>
								{details[0].code}
								<br /> {details[0].type}
								<br /> {details[0].group}
								<br /> {details[0].remark}
								{/* {details[0].remark !== '' && <br />}
								<br />{' '}
								{intToTimeslot(details[0].time.start, details[0].time.duration)} */}
							</div>
						) : (
							<div style={{ width: '100%', height: '100%' }}>
								<table>
									<tbody>{handleMultipleClass(details, innerConflict)}</tbody>
								</table>
							</div>
						)}
					</td>
				)
				row += classDetails.duration - 1
				hasConflict = hasConflict || innerConflict
			} else {
				timetable[row].push(<td key={`timeblock ${unikey}-${row}`}></td>)
			}
		}
	}
	return { timetable, hasConflict }
}
