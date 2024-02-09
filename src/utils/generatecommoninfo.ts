import { timeslotToInt, daysToInt } from '@utils/parsers.ts'

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
	prevSearch: object[],
	search: string
): Promise<[] | Array<CourseDetails> | null> {
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
					console.log('Failed Response: Error fetching data', response)
					return null
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

export function generateCommonInfomationDetails(
	search: Array<CourseDetails>
): ModifiedCourseDetails[] {
	return search.map((course) => {
		const courseCode = Object.keys(course)[0]
		const commonClasses = course[courseCode].get_common_information
		return { [courseCode]: commonClasses }
	})
}

export function GenerateTimetableFormat(prevSearch: ModifiedCourseDetails[]) {
	let parsed_data: any[][] = Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	)
	for (const course of prevSearch) {
		const key = Object.keys(course)[0]
		for (const class_ of course[key]) {
			let { start, duration } = timeslotToInt(class_.time)
			if (parsed_data[daysToInt(class_.day)][start].length !== 0) {
				let prevData = parsed_data[daysToInt(class_.day)][start]
				parsed_data[daysToInt(class_.day)][start] = {
					classDetails: [
						...prevData.classDetails,
						{
							code: key,
							type: class_.type,
							group: class_.group,
							time: { start, duration },
							remark: class_.remark,
						},
					],
					duration: Math.max(duration, prevData.duration),
				}
			} else {
				parsed_data[daysToInt(class_.day)][start] = {
					classDetails: [
						{
							code: key,
							type: class_.type,
							group: class_.group,
							time: { start, duration },
							remark: class_.remark,
						},
					],
					duration: duration,
				}
			}
		}
	}
	for (let days = 0; days < 7; days++) {
		for (let timeslot = 0; timeslot < 16; timeslot++) {
			if (parsed_data[days][timeslot]?.duration > 1) {
				let duration = parsed_data[days][timeslot].duration - 1
				let counter = 1
				for (; duration > 0; duration--, counter++) {
					if (parsed_data[days][timeslot + counter]?.duration) {
						console.log('OVERLAP, PLS CHECK FOR THIS CASE')
						parsed_data[days][timeslot] = {
							...parsed_data[days][timeslot],
							classDetails: [
								...parsed_data[days][timeslot].classDetails,
								...parsed_data[days][timeslot + counter].classDetails,
							],
						}
						duration = Math.max(
							duration,
							parsed_data[days][timeslot + counter].duration
						)
						parsed_data[days][timeslot + counter] = []
					}
				}
				parsed_data[days][timeslot].duration = counter
				timeslot += counter
			}
		}
	}

	return parsed_data
}
