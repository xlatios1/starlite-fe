import { addCourse } from '@store/timetable/timetableSlice.ts'
import Notification from '@components/notification/notification.tsx'

export type classinfo = {
	type: string
	group: string
	day: string
	time: string
	venue: string
	remark: string
}

export type indexinfos = {
	id: string
	index: string
	get_information: classinfo[]
	get_filtered_information: classinfo[] | []
	schedule: string
}

export type CourseDetails = {
	[courseCode: string]: {
		name: string
		initialism: string
		academic_units: number
		get_exam_schedule: { date: string; time: string; timecode: string }
		get_common_information: classinfo[] | []
		indexes: indexinfos[]
	}
}

export type ModifiedCourseDetails = { [courseCode: string]: classinfo[] }

export async function FetchCourseDetails(
	search: string,
	prevCourses: ModifiedCourseDetails[],
	dispatch,
	getCourseDetails
) {
	const prevCourseCode = prevCourses.map((obj) => Object.keys(obj)[0])

	const text_without_punctuation: string = search.replace(
		/[.,/#!$%^&*;:{@+|}=\-_`~()]/g,
		''
	)
	const valid_course = []
	const courseRegex: RegExp = /\b\w{6}\b/g
	let match
	let matches = []
	while ((match = courseRegex.exec(text_without_punctuation)) !== null) {
		const course: string = match[0].toUpperCase()
		if (!matches.includes(course) && !prevCourseCode.includes(course)) {
			await getCourseDetails(course)
				.unwrap()
				.then(async (data) => {
					if (data.detail !== 'Not found.') {
						const courseDetail = {
							[course]: {
								name: data.name,
								initialism:
									'(' +
									data.name
										.split(' ')
										.map((c) => c[0])
										.join('') +
									')',
								academic_units: data.academic_units,
								get_exam_schedule: data.get_exam_schedule,
								get_common_information: data.get_common_information,
								indexes: data.indexes,
							},
						}
						await dispatch(addCourse(courseDetail))
						valid_course.push(course)
					}
				})
				.catch((err) => {
					console.log('Error fetching data:', err)
				})
		}
	}
	if (valid_course.length > 0) {
		Notification(
			'success',
			`Successfully mapped course: ${valid_course.map((c) => c).join(', ')}`,
			1000
		)
	} else {
		Notification('info', 'No unique valid course found!', 1000)
	}
}
