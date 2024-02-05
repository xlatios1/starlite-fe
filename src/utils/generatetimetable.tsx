import React from 'react'
// import { convertExamSchedule } from '@utils/parsers.ts'

type Details = {
	code: string
	type: string
	group: string
	remark: string
}

type classDetails = { classDetails: Details[]; duration: number }

type TimetableClassData = Array<[] | classDetails>

type TimetableData = Array<TimetableClassData>

export async function GenerateTimetable(timetable_data: TimetableData) {}
