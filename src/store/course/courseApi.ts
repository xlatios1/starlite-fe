import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface ClassInfo {
	type: string
	group: string
	day: string
	time: string
	venue: string
	remark: string
}

interface SuccessResponse {
	id: number
	code: string
	name: string
	academic_units: number
	datetime_added: string
	get_exam_schedule: null | {
		date: string
		time: string
		timecode: string
	}
	get_common_information: ClassInfo[]
	common_schedule: string
	indexes: {
		id: string
		index: string
		get_information: ClassInfo[]
		get_filtered_information: ClassInfo[]
		schedule: string
	}[]
}

interface ErrorResponse {
	detail: string
}

type CourseResponse = SuccessResponse | ErrorResponse

export const courseApi = createApi({
	reducerPath: 'courseApi',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_COURSE_API }),
	endpoints: (builder) => ({
		findCourseContain: builder.query<any, string>({
			query: (search) => `?search__icontains=${search}`,
		}),

		getCourseDetails: builder.query<CourseResponse, string>({
			query: (courseCode) => `${courseCode}/`,
		}),
	}),
})

export const { useLazyFindCourseContainQuery, useLazyGetCourseDetailsQuery } =
	courseApi
