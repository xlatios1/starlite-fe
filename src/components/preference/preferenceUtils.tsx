export const days = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
]

export const initializeState = (
	options: string[],
	defaultValue: string | number
): { [acc: string]: number | string } => {
	return options.reduce((acc, day) => {
		acc[day] = defaultValue
		return acc
	}, {})
}
