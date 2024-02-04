import { useState, useEffect, useRef } from 'react'
import logo from '@images/logo.png'
import SearchBar from '@components/searchbar/SearchBar'
import TimeTable from '@components/timetable/TimeTable.tsx'
import apiRequest from '@components/apihandler/apiRequest'
import Loading from '@components/loading/Loading.tsx'
import Notification from '@components/notification/notification.tsx'
import ScrollButton from '@components/scrollbutton/scrollbutton.tsx'
import FilterLists from '@components/preference/preferencelists.tsx'
import ExamInfo from '@components/examinfo/examinfo.tsx'
import GenerateTimetable from '@utils/generatetimetable.ts'

import '@styles/home.css'

export default function Home() {
	const [data, setData] = useState(null)
	const [searched, setSearched] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [toggleCourseList, setToggleCourseList] = useState(true)
	const [transformYValue, setTransformYValue] = useState(0)
	const searchValidRef = useRef(null)
	const [isConflict, setIsConflict] = useState(false)
	const [timetablePreview, setTimetablePreview] = useState(
		Array.from({ length: 7 }, () => Array.from({ length: 16 }, () => []))
	)

	function popObject(obj) {
		const keys = Object.keys(obj)
		const lastKey = keys[keys.length - 1]
		const popValue = obj[lastKey]
		delete obj[lastKey]
		return { [lastKey]: popValue }
	}

	const handleSearch = (search, topn = null) => {
		setIsLoading(() => true)
		setTimeout(async () => {
			const API_URL = 'http://localhost:5000/get_timetable_plan'
			const bodyParam = {
				course_lists: search.join(' '),
				...(topn !== null ? { topn } : {}),
				debugged: true,
			}
			const [response_status, response_data] = await apiRequest(
				API_URL,
				bodyParam
			)
			if (response_status) {
				const validCourses = popObject(response_data)
				// if (notFound['Not Found'].length !== 0) {
				// 	//TODO: handle not found, have a pop up.
				// }
				if (Object.keys(response_data).length !== 0) {
					Notification('success', 'Successful matched!', 2000)
					setData((prev) => response_data)
					setSearched((prev) =>
						validCourses.validCourses.map((course) => course.toUpperCase())
					)
					setToggleCourseList(false)
				} else {
					Notification('info', 'No course data found', 2000)
					setData((prev) => null)
				}
			} else {
				Notification('error', 'Error! Unable to fetch data!', 2000)
			}
			setIsLoading(() => false)
		}, 1000)
	}

	const fetchData = async (value) => {
		return await fetch(`${process.env.REACT_APP_COURSE_CODE_API}${value}`)
			.then((response) => response.json())
			.then((json) => json.results)
			.then((results) => {
				return results.map((items) => ({
					code: items.code,
					name: items.name,
				}))
			})
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
	}, [searchValidRef.current])

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
					<button
						onClick={() => {
							GenerateTimetable('CZ3005').then((r) =>
								console.log('SearchCourse', r)
							)
						}}
					>
						{' '}
						TESTING API{' '}
					</button>
					<SearchBar
						handleSearch={handleSearch}
						fetchData={fetchData}
						setIsLoading={setIsLoading}
						setToggleCourseList={setToggleCourseList}
						toggleCourseList={toggleCourseList}
						searchValidRef={searchValidRef}
						setTimetablePreview={setTimetablePreview}
						isConflict={isConflict}
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
					{data ? (
						<>
							{Object.keys(data).map((key) => {
								const item = data[key]
								return (
									<div className="time-table-container" key={key}>
										<TimeTable
											key={key + key}
											timetable_data={timetablePreview}
											missed_course={[]}
											info={null}
											setIsConflict={setIsConflict}
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
							missed_course={[]}
							info={null}
							setIsConflict={setIsConflict}
						/>
					)}
				</div>
				{data ? (
					<ExamInfo
						exam_schedule={[
							'CZ1103: Not Applicable',
							'CZ1104: 02-May-2024 1300to1500 hrs',
						]}
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}
