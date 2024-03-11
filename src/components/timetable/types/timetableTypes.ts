export type Details = {
	code: string
	type: string
	group: string
	time: { start: number; duration: number }
	remark: string
}

export type ClassDetails = { classDetails: Details[]; duration: number }

export type TimetableClassData = Array<[] | ClassDetails>

export type Info = [string, string, string][]

export type TimetableData = {
	timetable_data: Array<TimetableClassData>
	info: Info | null
	showDashboard: boolean
}

export type CourseCombi = [
	courseCode: string,
	courseIndex: string,
	colorCode: string
]

export type Combinations =
	| [number, CourseCombi[], string[], string[], number[][]]
	| []
