import { convertExamSchedule } from '@utils/parsers.ts'

export default async function GenerateTimetable(search: string) {
	const valid_course = []
	try {
		const response = await fetch(
			`${process.env.REACT_APP_COURSE_DETAIL_API}${search}/`
		)
		if (!response.ok) {
			throw new Error('Network response was not ok.')
		}
		const results = await response.json()
		if (results?.detail !== 'Not found.') {
			valid_course.push(results)
		}
	} catch (error) {
		console.error('Error fetching data:', error)
		return null
	}
	console.log(valid_course)
	return valid_course
}
