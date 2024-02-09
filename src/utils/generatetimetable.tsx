import React from 'react'
import { daysToInt, timeslotToInt, convertRemarks } from '@utils/parsers.ts'
import type { CourseDetails } from '@utils/generatecommoninfo.ts'

export async function GenerateTimetable(timetable_data: CourseDetails[]) {
	// const new_timetable_data = [...timetable_data]
	// console.log('CALLED', new_timetable_data)
	// new_timetable_data.sort(
	// 	(a, b) =>
	// 		Object.values(a)[0].indexes.length - Object.values(b)[0].indexes.length
	// )
	// let results = []
	// for (let course of new_timetable_data) {
	// 	let courseCode = Object.keys(course)[0]
	// 	let indexes = course[courseCode].indexes
	// 	let allCombi = [] //holds all combinations
	// 	for (let i = 0; i < indexes.length; i++) {
	// 		let baseClass = [] //temporary holds all index of a certain course
	// 		for
	// 	}
	// }
}
