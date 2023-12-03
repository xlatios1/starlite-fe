import { useState } from 'react'
import logo from '@images/logo.png'
import SearchBar from '@components/searchbar/SearchBar'
import TimeTable from '@components/timetable/TimeTable.tsx'
import apiRequest from '@components/apihandler/apiRequest'
import Loading from '@components/loading/Loading.tsx'
import Notification from '@components/notification/notification.tsx'

export default function Home() {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	function popObject(obj) {
		const keys = Object.keys(obj)
		const lastKey = keys[keys.length - 1]
		const popValue = obj[lastKey]
		delete obj[lastKey]
		return { [lastKey]: popValue }
	}

	const handleSearch = async (search, topn = null) => {
		setIsLoading(true)
		const API_URL = `http://localhost:5000/get_timetable_plan`
		const bodyParam = {
			course_lists: search,
			...(topn !== null ? { topn } : {}),
			debugged: true,
		}
		const [response_status, response_data] = await apiRequest(
			API_URL,
			bodyParam
		)
		console.log('response_data', response_data)
		setTimeout(() => {
			if (response_status) {
				const notFound = popObject(response_data)
				if (notFound['Not Found'].length !== 0) {
					//TODO: handle not found, have a pop up.
				}
				if (Object.keys(response_data).length !== 0) {
					Notification('success', 'Successful matched!', 2000)
					setData((prev) => response_data)
				} else {
					Notification('info', 'No course data found', 2000)
					setData((prev) => null)
				}
			} else {
				Notification('error', 'Error!', response_data, 2000)
			}
			setIsLoading(false)
		}, 1000)
	}

	const onTestHandler = async () => {
		setIsLoading(true)
		const testdata = ['THIS IS TRUE']
		const API_URL = `http://localhost:5000/test1?check_param=a&check_param3=${testdata}`
		const response = await apiRequest(API_URL)
		setTimeout(() => {
			alert(`${response}`)
			setIsLoading(false)
		}, 3000)
	}

	const handleClick = () => {
		// Hide the notification after 5 seconds (adjust as needed)
		setTimeout(() => {}, 5000)
	}

	return (
		<div className="hp">
			{isLoading && <Loading />}
			<div className="logo-container">
				<img className="logo" src={logo} />
			</div>
			<SearchBar handleSearch={handleSearch}></SearchBar>
			{data ? (
				Object.keys(data).map((key) => {
					const item = data[key]
					return (
						<div key={key}>
							<TimeTable
								timetable_data={item['Timetable']}
								missed_course={item['Conflict']}
								info={item['Info']}
								exam_schedule={item['Exam Schedule']}
							/>
						</div>
					)
				})
			) : (
				<p></p>
			)}
			{/* <button className="btn" onClick={handleClick}>
				test
			</button> */}
		</div>
	)
}
