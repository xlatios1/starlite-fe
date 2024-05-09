import {
	addCourse,
	ColorPalette,
	updateCourseColorPalette,
} from '@store/course/courseSlice.ts'
import type { CourseDetails } from '@store/course/courseSlice.ts'
import Notification from '@components/notification/notification.tsx'
import { Dispatch, UnknownAction } from '@reduxjs/toolkit'

export async function FetchCourseDetails(
	search: string,
	courseData: {
		courses: CourseDetails[]
		CourseColorPalette: ColorPalette[]
	},
	dispatch: Dispatch<UnknownAction>,
	getCourseDetails
) {
	const palette = [...courseData.CourseColorPalette]
	const prevCourseCode = courseData.courses.map((obj) => Object.keys(obj)[0])
	const text_without_punctuation: string = search.replace(
		/[.,/#!$%^&*;:{@+|}=\-_`~()]/g,
		''
	)
	const valid_course = []
	const courseRegex: RegExp = /\b\w{6}\b/g
	let match
	while (
		(match = courseRegex.exec(text_without_punctuation)) !== null &&
		prevCourseCode.length < 10
	) {
		const course: string = match[0].toUpperCase()
		if (!prevCourseCode.includes(course)) {
			await getCourseDetails(course)
				.unwrap()
				.then(async (data) => {
					if (!('detail' in data)) {
						let color = palette.splice(
							Math.floor(Math.random() * palette.length),
							1
						)[0]
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
								colorCode: color,
							},
						}
						await dispatch(addCourse(courseDetail))
						valid_course.push(course)
						prevCourseCode.push(course)
					}
				})
				.catch((err) => {
					// Notification(
					// 	'error',
					// 	'An unexpected error has occured (search)',
					// 	3000
					// )
				})
		}
	}
	if (match && (match.length > 0 || prevCourseCode.length > 10)) {
		Notification(
			'error',
			'Hit the limit of 10 courses only! Are you a god?',
			3000
		)
	}
	await dispatch(updateCourseColorPalette(palette))
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

export { CourseDetails }
