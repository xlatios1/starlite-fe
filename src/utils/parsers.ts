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

// [[[],[],[],["cz3005","lec","2","remarks"],[]],   //mon
// [[],[],["cz3005","tut","1","remarks"],[],[],[]]]  //tues
export const extractDetails = () => {}
