export type Details = {
	code: string
	type: string
	group: string
	time: { start: number; duration: number }
	remark: string
}

export type ClassDetails = { classDetails: Details[]; duration: number }

export type TimetableClassData = Array<[] | ClassDetails>

export type TimetableData = {
	timetable_data: Array<TimetableClassData>
	info: null | [string, string][]
}

export type CourseCombi = [courseCode: string, courseIndex: string]

export type Combinations =
	| [number, CourseCombi[], string[], string[], number[][]]
	| []
