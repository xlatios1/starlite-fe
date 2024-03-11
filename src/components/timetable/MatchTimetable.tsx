import {
	daysToInt,
	timeslotToInt,
	convertRemarks,
} from '@components/timetable/utils/timetableUtils.ts'
import type {
	Combinations,
	TimetableClassData,
} from './types/timetableTypes.ts'
import { CourseDetails, indexinfos } from '@store/course/courseSlice.ts'

export function MatchTimetable(timetable_data: CourseDetails[]): {
	timetable_data: TimetableClassData[]
	info: [string, string][]
	rank: number
}[] {
	console.log('WAOITARFNEHWJKAN FKCJENWSDBKFVCNK<EN ', timetable_data)
	const new_timetable_data = [...timetable_data]
	console.log('data in:', new_timetable_data)
	let allCombi = [] as Combinations[] //holds all combinations
	for (const course of new_timetable_data) {
		let courseCode = Object.keys(course)[0]
		let indexes = course[courseCode].indexes as indexinfos[]
		let baseClass = [] as Combinations[] //temporary holds all index of a certain course
		for (let i = 0; i < indexes.length; i++) {
			let hours = [] as string[]
			let wks = [] as number[][]
			for (const classInfo of indexes[i].get_information) {
				let { start, duration } = timeslotToInt(classInfo.time)
				for (let i = start; i < start + duration; i++) {
					hours.push(
						`${daysToInt(classInfo.day)}${
							i > 9 ? i.toString() : '0' + i.toString()
						}`
					)
					wks.push(convertRemarks(classInfo.remark))
				}
			}
			baseClass.push([
				1,
				[[courseCode, indexes[i].index, course[courseCode].colorCode]],
				[courseCode.toString() + indexes[i].index.toString()],
				hours,
				wks,
			])
		}
		let new_combi = [] as Combinations[]
		for (let c = 0; c < allCombi.length; c++) {
			for (const baseCombi of baseClass) {
				let conflict = false
				for (const hour of baseCombi[3]) {
					let index = allCombi[c][3].indexOf(hour)
					if (
						index !== -1 &&
						baseCombi[4][0].some((w) => allCombi[c][4][index].includes(w))
					) {
						conflict = true
						break
					}
				}
				if (!conflict) {
					new_combi.push([
						allCombi[c][0] + baseCombi[0],
						allCombi[c][1].concat(baseCombi[1]),
						allCombi[c][2].concat(baseCombi[2]),
						allCombi[c][3].concat(baseCombi[3]),
						allCombi[c][4].concat(baseCombi[4]),
					])
				}
			}
		}
		allCombi = [...allCombi, ...baseClass, ...new_combi]
	}

	// Sort order to the most to the least combinations matched
	allCombi.sort((a, b) => b[0] - a[0])
	console.log('All combi: ', allCombi)
	// Filter off any subset combinations
	let uniqueSetCombi = [] as Combinations[]
	const maxMatched = allCombi[0][0]
	for (const combi of allCombi) {
		// optimistic approach, all maximum combi are not a subset of each other.
		if (combi[0] === maxMatched && uniqueSetCombi.length < 1000) {
			uniqueSetCombi.push(combi)
		} else {
			// for any other courses < maxMatch, find uniques, limit to max 100
			if (uniqueSetCombi.length < 100) {
				for (const combi of allCombi) {
					let isSubset = false
					for (const uniqueCombi of uniqueSetCombi) {
						isSubset = combi[2].every((item) => uniqueCombi[2].includes(item))
						if (isSubset) {
							break
						}
					}
					if (!isSubset) {
						uniqueSetCombi.push(combi)
					}
				}
			} else {
				break
			}
		}
	}

	console.log('uniqueSetCombi', uniqueSetCombi)
	let finalResult = []

	for (const combi of uniqueSetCombi) {
		let temp = []
		for (const [courseCode, courseIndex] of combi[1]) {
			let courseData = timetable_data.find(
				(item) => Object.keys(item)[0] === courseCode
			)[courseCode]
			let indexDetails = courseData.indexes.find(
				(item) => +item.index === +courseIndex
			).get_information
			temp.push({ [courseCode]: indexDetails })
		}
		finalResult.push({
			timetable_data: MatchTimetableFormat(temp),
			info: combi[1],
			rank: 1,
		})
	}
	console.log('finalResult', finalResult)
	return finalResult
}

export function MatchCommonTimetable(search: Array<CourseDetails>): any[][] {
	const commonTimetable = search.map((course) => {
		const courseCode = Object.keys(course)[0]
		const commonClasses = course[courseCode].get_common_information
		return { [courseCode]: commonClasses }
	})
	return MatchTimetableFormat(commonTimetable)
}

export function MatchTimetableFormat(search) {
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
