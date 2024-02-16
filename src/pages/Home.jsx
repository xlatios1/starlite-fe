import { useState, useEffect, useRef } from 'react'
import logo from '@images/logo.png'
import SearchBar from '@components/searchbar/SearchBar'
import TimeTable from '@components/timetable/TimeTable.tsx'
import Loading from '@components/loading/Loading.tsx'
import Notification from '@components/notification/notification.tsx'
import ScrollButton from '@components/scrollbutton/scrollbutton.tsx'
import FilterLists from '@components/preference/preferencelists.tsx'
import ExamInfo from '@components/examinfo/examinfo.tsx'
import { convertExamSchedule } from '@utils/parsers.ts'
import { GenerateTimetable } from '@utils/generatetimetable.tsx'
import { GenerateTimetableFormat } from '@utils/generatecommoninfo.ts'
import '@styles/home.css'

export default function Home() {
	const initializedTimetable = Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	)
	const [data, setData] = useState(null) //timetable option datas
	const [searched, setSearched] = useState([]) //searched courses
	const [isLoading, setIsLoading] = useState(false)
	const [toggleCourseList, setToggleCourseList] = useState(true)
	const [transformYValue, setTransformYValue] = useState(0)
	const searchValidRef = useRef(null)
	const [timetablePreview, setTimetablePreview] = useState(initializedTimetable)
	const [preferences, setPreferences] = useState(null)

	const handleSearch = (search, topn = null) => {
		setIsLoading(true)
		setTimeout(async () => {
			if (document.getElementsByClassName('conflict-message').length !== 0) {
				const errorMessage =
					'Error! Please resolve course conflict before search!'
				Notification('error', errorMessage, 2000)
			} else {
				console.log(timetablePreview)
				setSearched(search)
				setData(GenerateTimetable(search))
				setToggleCourseList(false)
				Notification('success', 'Search successful', 2000)
			}
			setIsLoading(false)
		}, 1000)
	}

	useEffect(() => {
		// Scroll only when there is data
		if (data) {
			window.scrollTo({
				left: 0,
				top: 250,
				behavior: 'smooth',
			})
		}
	}, [data])

	useEffect(() => {
		if (searchValidRef.current) {
			const observer = new ResizeObserver((entries) => {
				for (let entry of entries) {
					if (entry.target === searchValidRef.current) {
						setTransformYValue(entry.target.clientHeight)
					}
				}
			})
			observer.observe(searchValidRef.current)

			return () => {
				observer.disconnect()
			}
		}
	}, [searchValidRef.current, transformYValue])

	const handleApplyPreference = (preference) => {
		setIsLoading(true)
		setTimeout(async () => {
			setPreferences(preference)
			setIsLoading(false)
		}, 1000)
	}

	return (
		<div className="hp">
			{isLoading && <Loading />}
			<div className="upper-detail-wrapper">
				<div className="logo-container">
					<img className="logo" src={logo} alt="starlite" />
				</div>
			</div>
			<div className="lower-detail-wrapper">
				<div className="search-wrapper">
					<SearchBar
						handleSearch={handleSearch}
						setIsLoading={setIsLoading}
						setToggleCourseList={setToggleCourseList}
						toggleCourseList={toggleCourseList}
						searchValidRef={searchValidRef}
						setTimetablePreview={setTimetablePreview}
					></SearchBar>
					{!!searched.length ? (
						<div
							className={`preference-wrap ${toggleCourseList ? '' : 'hidden'}`}
							style={{
								transform: toggleCourseList
									? ''
									: `translateY(-${transformYValue - 15}px)`,
							}}
						>
							<FilterLists
								courses={searched.map((obj) => Object.keys(obj)[0])}
								handleApplyPreference={handleApplyPreference}
							></FilterLists>
						</div>
					) : (
						<></>
					)}
				</div>
				;
				<div className="time-table-wrapper">
					{/* { timetable_data: temp, info: combi[1] } */}
					{data ? (
						<>
							{data.map(({ timetable_data, info }, key) => {
								let timetableData = GenerateTimetableFormat(timetable_data)
								console.log('HERE', timetableData, timetable_data, info)
								return (
									<div className="time-table-container" key={key}>
										<TimeTable
											key={key + key}
											timetable_data={timetableData}
											info={info} //add in the course indexes informations {code: index}
										/>
									</div>
								)
							})}
							<ScrollButton />
						</>
					) : (
						<TimeTable
							key={'default_table'}
							timetable_data={timetablePreview}
							info={null}
						/>
					)}
				</div>
				{data ? (
					<ExamInfo
						exam_schedule={searched.map((obj) => {
							const course = Object.keys(obj)[0]
							return convertExamSchedule(course, obj[course].get_exam_schedule)
						})}
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}










// function popObject(obj) {
// 	const keys = Object.keys(obj)
// 	const lastKey = keys[keys.length - 1]
// 	const popValue = obj[lastKey]
// 	delete obj[lastKey]
// 	return { [lastKey]: popValue }
// }

// const handleSearch = (search, topn = null) => {
// 	setIsLoading(() => true)
// 	setTimeout(async () => {
// 		const API_URL = 'http://localhost:5000/get_timetable_plan'
// 		const bodyParam = {
// 			course_lists: search.join(' '),
// 			...(topn !== null ? { topn } : {}),
// 			debugged: true,
// 		}
// 		const [response_status, response_data] = await apiRequest(
// 			API_URL,
// 			bodyParam
// 		)
// 		if (response_status) {
// 			const validCourses = popObject(response_data)
// 			// if (notFound['Not Found'].length !== 0) {
// 			// 	//TODO: handle not found, have a pop up.
// 			// }
// 			if (Object.keys(response_data).length !== 0) {
// 				Notification('success', 'Successful matched!', 2000)
// 				setData((prev) => response_data)
// 				setSearched((prev) =>
// 					validCourses.validCourses.map((course) => course.toUpperCase())
// 				)
// 				setToggleCourseList(false)
// 			} else {
// 				Notification('info', 'No course data found', 2000)
// 				setData((prev) => null)
// 			}
// 		} else {
// 			Notification('error', 'Error! Unable to fetch data!', 2000)
// 		}
// 		setIsLoading(() => false)
// 	}, 1000)
// }