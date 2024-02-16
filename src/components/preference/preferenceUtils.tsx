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
) => {
	return options.reduce((acc, day) => {
		acc[day] = defaultValue
		return acc
	}, {})
}
