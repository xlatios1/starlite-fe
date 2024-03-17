import { ClassDetails } from '../types/timetableTypes'

export const timeArr = [
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

export const convertExamSchedule = (searched) => {
	const examSchedule = searched.map((obj) => {
		const course = Object.keys(obj)[0]
		let examSchedule = obj[course].get_exam_schedule

		if (!examSchedule) {
			return `Exam Schedule: Not Applicable`
		}
		const { date, time } = examSchedule
		const monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		]
		const [yyyy, mm, dd] = date.split('-')

		// Parse time
		const [startTime, endTime] = time.split('-')
		const formattedTime = `${startTime.replace(':', '')}to${endTime.replace(
			':',
			''
		)} hrs`

		// return `${course}: ${dd}-${
		// 	monthNames[parseInt(mm)]
		// }-${yyyy} ${formattedTime}`
		return `Exam Schedule: ${dd}-${
			monthNames[parseInt(mm) - 1]
		}-${yyyy} ${formattedTime}`
	})
	console.log(searched, examSchedule)
	examSchedule.sort((a, b) => a.localeCompare(b))
	return examSchedule
}

/**
 *
 * @param date
 * @returns integer corresponding to the date
 */
export const daysToInt = (date: string): number => {
	const days_arr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
	return days_arr.indexOf(date.toUpperCase())
}

/**
 *
 * @param duration
 * @returns start: starting slot, duration: how long the class is
 */
export const timeslotToInt = (
	duration: string
): { start: number; duration: number } => {
	const [start, end] = duration
		.split('-')
		.map((t) => Math.ceil((parseInt(t) - 830) / 100) + 1)

	return { start: start, duration: end - start }
}

export const intToTimeslot = (start: number, duration: number): string => {
	const starting = (start * 100 + 730).toString()
	const ending = ((start + duration) * 100 + 730).toString()
	return `${starting.length === 3 ? `0${starting}` : `${starting}`}-${
		ending.length === 3 ? `0${ending}` : `${ending}`
	}`
}

export const convertRemarks = (remark: string): Array<number> => {
	const defaultRemark = Array.from({ length: 15 }, (_, index) => index)
	if (remark.slice(0, 8) === 'Teaching') {
		const wks = remark.split(' ')[1].slice(2)
		if (wks.includes('-')) {
			wks.split('-')
			return Array.from(
				{ length: +wks.split('-')[1] - +wks.split('-')[0] },
				(_, index) => index + +wks.split('-')[0]
			)
		} else if (wks.includes(',')) {
			return wks.split(',').map((i) => +i)
		} else if (!isNaN(Number(wks))) {
			return [+wks]
		}
	}
	return defaultRemark
}

export const checkConflictWeeks = (classDetails: ClassDetails): boolean => {
	let elementsSet = new Set()
	for (const slot of classDetails.classDetails) {
		let remarks = convertRemarks(slot.remark)
		for (let i = 0; i < slot.time.duration; i++) {
			for (const wk of remarks) {
				let newEle = `${slot.time.start}${i}${wk}`
				if (elementsSet.has(newEle)) {
					return true
				}
				elementsSet.add(newEle) // Add the element to the set
			}
		}
	}
	return false
}
