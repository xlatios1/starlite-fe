import type {
	TimetableClassData,
	ClassDetails,
} from '../types/timetableTypes.ts'
import { timeslotOptions } from '@components/preference/preferences/timeslot.tsx'
import { days } from '@components/preference/preferenceUtils.tsx'
import _ from 'lodash'

export const applyPreferences = (
	timetableData: {
		timetable_data: TimetableClassData[]
		info: [string, string, string][]
		rank: number
	}[],
	preferences
) => {
	const data = _.cloneDeep(timetableData)
	data.map((timetable) => (timetable.rank = 1))

	const parsedPreferences = {
		freeDay: preferences.freeDay.map((day: string) => days.indexOf(day)),
		timeslot: Object.entries(preferences.timeslot).reduce(
			(acc, [day, timeSlotValue]: [string, string]) => {
				const index = timeslotOptions.indexOf(timeSlotValue)
				if (index > 0) {
					acc[day] = index
				}
				return acc
			},
			{}
		),
	}

	const rankedData = data.map((item) => ({
		timetable_data: [...item.timetable_data],
		info: [...item.info],
		rank: item.rank,
	}))

	console.log('data', data)
	console.log('rankedData', rankedData)
	console.log('parsedPreferences', parsedPreferences)

	const result = []
	for (let i = 0; i < rankedData.length; i++) {
		// Check for Freedays
		if (parsedPreferences.freeDay.length > 0) {
			rankedData[i].rank *= parsedPreferences.freeDay
				.map((dayInt) =>
					rankedData[i].timetable_data[dayInt].map((classes) => {
						if (Array.isArray(classes)) {
							return 0
						} else {
							return +classes.duration
						}
					})
				)
				.map((temp) => temp.reduce((acc, cur) => acc + cur, 0))
				.reduce((acc, cur) => ((16 - cur) / 16) * acc, 1)
		}
		// Check for Timeslots
		for (const key in parsedPreferences.timeslot) {
			let tempdayta = rankedData[i].timetable_data[days.indexOf(key)]
			const morning = [0, 5] //0800 - 1230
			const afternoon = [5, 11] //1230 - 1830
			const night = [11, 16] // 1830 - 2330
			const timeSlice = [morning, afternoon, night]
			const start = timeSlice[parsedPreferences.timeslot[key] - 1][0]
			const end = timeSlice[parsedPreferences.timeslot[key] - 1][1]
			let count = 0
			for (let i = start; i < end; i++) {
				if (!Array.isArray(tempdayta[i])) {
					let classDetail = tempdayta[i] as ClassDetails
					i += classDetail.duration - 1
					count += classDetail.duration
				}
			}
			rankedData[i].rank *= (end - start - count) / (end - start)
		}
		result.push(rankedData[i])
	}
	result.sort((a, b) => b.rank - a.rank || b.info.length - a.info.length)
	return result
}
