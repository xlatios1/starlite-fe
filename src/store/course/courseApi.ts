import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const courseApi = createApi({
	reducerPath: 'courseApi',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_COURSE_API }),
	endpoints: (builder) => ({
		findCourseContain: builder.query({
			query: (search) => `?search__icontains=${search}`,
		}),

		getCourseDetails: builder.query({
			query: (courseCode) => `${courseCode}/`,
		}),
	}),
})

export const { useLazyFindCourseContainQuery, useLazyGetCourseDetailsQuery } =
	courseApi