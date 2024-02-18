import { daysToInt, timeslotToInt, convertRemarks } from '@utils/parsers.ts'
import type { CourseDetails, indexinfos } from '@utils/generatecommoninfo.ts'

type courseCombi = [courseCode: string, courseIndex: string]
type combinations = [number, courseCombi[], string[], string[]] | []

export function GenerateTimetable(timetable_data: CourseDetails[]) {
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
		finalResult.push({ timetable_data: temp, info: combi[1] })
	}
	console.log('finalResult', finalResult)
	return finalResult
}
