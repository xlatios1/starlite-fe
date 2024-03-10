import React from 'react'
import {
	checkConflictWeeks,
	timeArr,
} from '@components/timetable/utils/timetableUtils.ts'
import type {
	ClassDetails,
	Details,
	TimetableClassData,
} from '@components/timetable/types/timetableTypes.ts'

export const GenerateTimetable = (
	timetable_data: Array<TimetableClassData>
) => {
	let length = 16
	for (; length > 11; length--) {
		const sliced = timetable_data.map((col) => col.slice(length - 1, length))
		if (!sliced.flat().every((data) => Array.isArray(data))) {
			break
		}
	}

	let timetable = Array.from({ length }, (_, i) => [
		<td key={`time ${timeArr[i]}`}>{timeArr[i]}</td>,
	])

	let unikey = 1
	let hasConflict = false

	const handleMultipleClass = (input: Details[]) => {
		const baseTime = Math.min(...input.map((data) => data.time.start))
		const depth = Math.max(...input.map((data) => data.time.duration))
		let beautify: any[][] = Array.from({ length: input.length }, () =>
			Array.from({ length: depth }, () => [])
		)

		for (let c = 0; c < input.length; c++) {
			let class_ = input[c]
			let curBlock = class_.time.start - baseTime
			if (beautify[curBlock].length === 0) {
				beautify[curBlock].push(
					<div
						key={`details Combi ${c}-${class_.code}-${class_.time}-${class_.time.duration}`}
						style={{
							display: 'grid',
							gridTemplateRows: `repeat(${class_.time.duration},1fr)`,
						}}
					>
						{class_.code}
						<br /> {class_.type}
						<br /> {class_.group}
						<br /> {class_.remark}
					</div>
				)
			} else {
			}
		}
	}

	for (const col of timetable_data) {
		for (let row = 0; row < length; row++, unikey++) {
			if ('duration' in col[row]) {
				let classDetails = col[row] as ClassDetails
				let innerConflict = false
				if (classDetails.classDetails.length > 1) {
					innerConflict = checkConflictWeeks(classDetails)
				}
				timetable[row].push(
					<td
						rowSpan={classDetails.duration}
						style={{ color: innerConflict ? 'red' : '' }}
						key={`timeblock data ${unikey}-${row}`}
					>
						<div>
							{classDetails.classDetails.map((details: Details, i: number) => (
								<div
									key={`details ${unikey}-${i}-${row}-${details.code}-${details.time}`}
								>
									{details.code}
									<br /> {details.type}
									<br /> {details.group}
									<br /> {details.remark}
								</div>
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
	return { timetable, hasConflict }
}
