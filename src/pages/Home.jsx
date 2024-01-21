import { useState, useEffect } from 'react'
import logo from '@images/logo.png'
import SearchBar from '@components/searchbar/SearchBar'
import TimeTable from '@components/timetable/TimeTable.tsx'
import apiRequest from '@components/apihandler/apiRequest'
import Loading from '@components/loading/Loading.tsx'
import Notification from '@components/notification/notification.tsx'
import ScrollButton from '@components/scrollbutton/scrollbutton.tsx'
import FilterLists from '@components/preference/preferencelists.tsx'
import '@styles/home.css'

export default function Home() {
	const [data, setData] = useState(null)
	const [searched, setSearched] = useState([])
	const [isLoading, setIsLoading] = useState(false)

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
				course_lists: search,
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
				} else {
					Notification('info', 'No course data found', 2000)
					setData((prev) => null)
				}
			} else {
				Notification('error', 'Error!', response_data, 2000)
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
				top: 400,
				behavior: 'smooth',
			})
		}
	}, [data])

	return (
		<div className="hp">
			{isLoading && <Loading />}
			<div className="upper-detail-wrapper">
				<div className="logo-container">
					<img className="logo" src={logo} alt="starlite" />
				</div>
				<SearchBar
					handleSearch={handleSearch}
					fetchData={fetchData}
				></SearchBar>
			</div>
			{data ? (
				<div className="lower-detail-wrapper">
					<FilterLists courses={searched}></FilterLists>
					<div className="time-table-wrapper">
						{Object.keys(data).map((key) => {
							const item = data[key]
							return (
								<div className="time-table-container" key={key}>
									<TimeTable
										key={key + key}
										timetable_data={item['Timetable']}
										missed_course={item['Conflict']}
										info={item['Info']}
										exam_schedule={item['Exam Schedule']}
									/>
								</div>
							)
						})}
					</div>
					<ScrollButton />
				</div>
			) : (
				<p></p>
			)}
			{/* <button className="btn" onClick={handleClick}>
				test
			</button> */}
		</div>
	)
}
