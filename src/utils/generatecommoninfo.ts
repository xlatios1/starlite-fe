import { timeslotToInt, daysToInt } from '@utils/parsers.ts'

type CourseDetails = {
	course: {
		name: string
		initialism: string
		academic_units: number
		get_exam_schedule: { date: string; time: string; timecode: string }
		get_common_information: Record<string, []>
		indexes: Record<string, []>
	}
}

export async function GenerateCommonInfo(prevSearch: object[], search: string) {
	let prevCourse = prevSearch.map((obj) => Object.keys(obj)[0])
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
		if (!matches.includes(course) && !prevCourse.includes(course)) {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_COURSE_DETAIL_API}${course}/`
				)
				if (response?.ok) {
					const results = await response.json()
					if (results.detail !== 'Not found.') {
						let {
							name,
							academic_units,
							get_exam_schedule,
							get_common_information,
							indexes,
						} = results
						valid_course.push({
							[course]: {
								name: name,
								initialism:
									'(' +
									name
										.split(' ')
										.map((c) => c[0])
										.join('') +
									')',
								academic_units: academic_units,
								get_exam_schedule: get_exam_schedule,
								get_common_information: get_common_information,
								indexes: indexes,
							},
						})
						matches.push(course)
					}
				} else {
					console.log('NOT FOUND')
				}
			} catch (error) {
				console.log('Error fetching data:', error)
				return null
			}
		}
	}
	return valid_course
}

// [[[],[],[],["cz3005","lec","2"],[]],   //mon
//  [[],[],["cz3005","tut","1"],[],[],[]]]  //tues
export async function GenerateCommonTimetable(prevSearch: CourseDetails) {
	let parsed_data: any[][] = Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	)

	for (const key in prevSearch) {
		for (const class_ of prevSearch[key].get_common_information) {
			let { start, duration } = timeslotToInt(class_.time)
			if (parsed_data[daysToInt(class_.day)][start].length !== 0) {
				let prevData = parsed_data[daysToInt(class_.day)][start]
				parsed_data[daysToInt(class_.day)][start] = {
					classDetails: prevData.classDetails.push([
						key,
						class_.type,
						class_.remark,
					]),
					duration: duration + prevData.duration,
				}
			} else {
				parsed_data[daysToInt(class_.day)][start] = {
					classDetails: [[key, class_.type, class_.remark]],
					duration: duration,
				}
			}
		}
	}
}
