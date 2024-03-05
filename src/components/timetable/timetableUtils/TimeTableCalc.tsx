import type { TimetableClassData, classDetails } from '../TimeTable.tsx'
import { timeslotOptions } from '@components/preference/preferences/timeslot.tsx'
import { days } from '@components/preference/preferenceUtils.tsx'

export const handlePreferences = (
	data: {
		timetable_data: TimetableClassData[]
		info: [string, string][]
		rank: number
	}[],
	preferences
) => {
	const parsedPreferences = {
		...preferences,
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
		timetable: [...item.timetable_data],
		info: [...item.info],
		rank: item.rank,
	}))

	console.log('data', data)
	console.log('rankedData', rankedData)
	console.log('parsedPreferences', parsedPreferences)

	const result = []
	for (let i = 0; i < rankedData.length; i++) {
		if (rankedData[i].info.length >= parsedPreferences.minCourseFilter) {
			// Check for Freedays
			if (parsedPreferences.freeDay.length > 0) {
				rankedData[i].rank *= parsedPreferences.freeDay
					.map((dayInt) =>
						rankedData[i].timetable[dayInt].map((classes) => {
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
				let tempdayta = rankedData[i].timetable[days.indexOf(key)]
				const morning = [0, 5] //0800 - 1230
				const afternoon = [5, 11] //1230 - 1830
				const night = [11, 16] // 1830 - 2330
				const timeSlice = [morning, afternoon, night]
				const start = timeSlice[parsedPreferences.timeslot[key] - 1][0]
				const end = timeSlice[parsedPreferences.timeslot[key] - 1][1]
				let count = 0
				for (let i = start; i < end; i++) {
					if (!Array.isArray(tempdayta[i])) {
						let classDetail = tempdayta[i] as classDetails
						i += classDetail.duration - 1
						count += classDetail.duration
					}
				}
				rankedData[i].rank *= (end - start - count) / (end - start)
			}
			result.push(rankedData[i])
		}
	}
	result.sort((a, b) => b.rank - a.rank)
	console.log(result)
	return result
}
