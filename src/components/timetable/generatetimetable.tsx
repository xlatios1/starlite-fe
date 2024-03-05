import { daysToInt, timeslotToInt, convertRemarks } from '@utils/parsers.ts'
import type {
	CourseDetails,
	ModifiedCourseDetails,
	indexinfos,
} from '@components/searchbar/SearchBar.actions.ts'

type courseCombi = [courseCode: string, courseIndex: string]
type combinations = [number, courseCombi[], string[], string[]] | []

export function GenerateTimetable(timetable_data: CourseDetails[]): any[][] {
	const new_timetable_data = [...timetable_data]

	let allCombi = [] as combinations[] //holds all combinations
	for (const course of new_timetable_data) {
		let courseCode = Object.keys(course)[0]
		let indexes = course[courseCode].indexes as indexinfos[]
		let baseClass = [] as combinations[] //temporary holds all index of a certain course
		for (let i = 0; i < indexes.length; i++) {
			let temp = [] as string[]
			for (const classInfo of indexes[i].get_information) {
				let { start, duration } = timeslotToInt(classInfo.time)
				for (let i = start; i < start + duration; i++) {
					temp.push(
						`${daysToInt(classInfo.day)}${
							i > 9 ? i.toString() : '0' + i.toString()
						}${convertRemarks(classInfo.remark).join('')}`
					)
				}
			}
			baseClass.push([
				1,
				[[courseCode, indexes[i].index]],
				temp,
				[courseCode.toString() + indexes[i].index.toString()],
			])
		}
		let new_combi = [] as combinations[]
		for (let c = 0; c < allCombi.length; c++) {
			for (const baseCombi of baseClass) {
				if (!baseCombi[2].some((item) => allCombi[c][2].includes(item))) {
					new_combi.push([
						baseCombi[0] + allCombi[c][0],
						baseCombi[1].concat(allCombi[c][1]),
						baseCombi[2].concat(allCombi[c][2]),
						baseCombi[3].concat(allCombi[c][3]),
					])
				}
			}
		}
		allCombi = [...allCombi, ...baseClass, ...new_combi]
	}

	// Sort order to the most to the least combinations matched
	allCombi.sort((a, b) => b[0] - a[0])

	// Filter off any subset combinations
	let uniqueSetCombi = [] as combinations[]
	for (const combi of allCombi) {
		let isSubset = false
		for (const uniqueCombi of uniqueSetCombi) {
			isSubset = combi[3].some((item) => uniqueCombi[3].includes(item))
			if (isSubset) {
				break
			}
		}
		if (!isSubset) {
			uniqueSetCombi.push(combi)
		}
	}
	console.log('uniqueSetCombi', uniqueSetCombi)

	let finalResult = []

	for (const combi of uniqueSetCombi) {
		let temp = []
		for (const [courseCode, courseIndex] of combi[1]) {
			let courseData = timetable_data.filter((item) => item[courseCode])[0][
				courseCode
			]
			let indexDetails = courseData.indexes.filter(
				(item) => +item.index === +courseIndex
			)[0].get_information
			temp.push({ [courseCode]: indexDetails })
		}
		finalResult.push({
			timetable_data: GenerateTimetableFormat(temp),
			info: combi[1],
			rank: 1,
		})
	}
	console.log('finalResult', finalResult)
	return finalResult
}

export function GenerateCommonTimetable(search: Array<CourseDetails>): any[][] {
	const commonTimetable = search.map((course) => {
		const courseCode = Object.keys(course)[0]
		const commonClasses = course[courseCode].get_common_information
		return { [courseCode]: commonClasses }
	})
	return GenerateTimetableFormat(commonTimetable)
}

export function GenerateTimetableFormat(search: ModifiedCourseDetails[]) {
	let timetable_data: any[][] = Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	)
	for (const course of search) {
		const key = Object.keys(course)[0]
		for (const class_ of course[key]) {
			let { start, duration } = timeslotToInt(class_.time)
			if (timetable_data[daysToInt(class_.day)][start].length !== 0) {
				let prevData = timetable_data[daysToInt(class_.day)][start]
				timetable_data[daysToInt(class_.day)][start] = {
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
				timetable_data[daysToInt(class_.day)][start] = {
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
			if (timetable_data[days][timeslot]?.duration > 1) {
				let duration = timetable_data[days][timeslot].duration - 1
				let counter = 1
				for (; duration > 0; duration--, counter++) {
					if (timetable_data[days][timeslot + counter]?.duration) {
						console.log('OVERLAP, PLS CHECK FOR THIS CASE')
						timetable_data[days][timeslot] = {
							...timetable_data[days][timeslot],
							classDetails: [
								...timetable_data[days][timeslot].classDetails,
								...timetable_data[days][timeslot + counter].classDetails,
							],
						}
						duration = Math.max(
							duration,
							timetable_data[days][timeslot + counter].duration
						)
						timetable_data[days][timeslot + counter] = []
					}
				}
				timetable_data[days][timeslot].duration = counter
				timeslot += counter
			}
		}
	}

	return timetable_data
}
