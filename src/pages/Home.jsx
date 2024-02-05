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

	const handleSearch = (search, topn = null) => {
		console.log('handleSearch clicked!')
		if (document.getElementsByClassName('conflict-message').length !== 0) {
			const errorMessage =
				'Error! Please resolve course conflict before search!'
			Notification('error', errorMessage, 2000)
		} else {
			setSearched(search.map((obj) => Object.keys(obj)[0]))
			setData(search)
			console.table(search)
		}
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
							<FilterLists courses={searched}></FilterLists>
						</div>
					) : (
						<></>
					)}
				</div>
				<div className="time-table-wrapper">
					{null && data ? (
						<>
							{Object.keys(data).map((key) => {
								const item = data[key]
								return (
									<div className="time-table-container" key={key}>
										<TimeTable
											key={key + key}
											timetable={timetablePreview}
											info={undefined} //add in the course indexes informations {code: index}
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
						exam_schedule={
							data.map((obj) => {
								const course = Object.keys(obj)[0]
								return convertExamSchedule(
									course,
									obj[course].get_exam_schedule
								)
							})
							// ['CZ1103: Not Applicable',
							// 'CZ1104: 02-May-2024 1300to1500 hrs']
						}
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