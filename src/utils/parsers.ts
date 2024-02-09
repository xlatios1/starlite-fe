export const convertExamSchedule = (
	code: string,
	examSchedule: {
		date: string
		time: string
		timecode: string
	} | null
) => {
	if (!examSchedule) {
		return `${code}: Not Applicable`
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

	return `${code}: ${dd}-${monthNames[parseInt(mm)]}-${yyyy} ${formattedTime}`
}

export const daysToInt = (date: string): number => {
	const days_arr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
	return days_arr.indexOf(date.toUpperCase())
}

export const timeslotToInt = (
	duration: string
): { start: number; duration: number } => {
	const [start, end] = duration
		.split('-')
		.map((t) => Math.ceil((parseInt(t) - 830) / 100) + 1)

	return { start: start, duration: end - start }
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

// [[[],[],[],["cz3005","lec","2","remarks"],[]],   //mon
// [[],[],["cz3005","tut","1","remarks"],[],[],[]]]  //tues
export const extractDetails = () => {}
