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

	const handleSearch = async (
		search,
		username = null,
		password = null,
		topn = null
	) => {
		setIsLoading(true)
		const API_URL = `http://localhost:5000/get_timetable_plan`
		const bodyParam = {
			course_lists: search,
			fernet_key: 'admin',
			...(username !== null ? { username } : {}),
			...(password !== null ? { password } : {}),
			...(topn !== null ? { topn } : {}),
		}
		const [response_status, response_data] = await apiRequest(
			API_URL,
			bodyParam
		)

		setTimeout(() => {
			if (response_status === true && Object.keys(response_data).length > 0) {
				Notification('success', 'Successful matched!', 2000)
				setData((prev) => response_data)
			} else if (
				response_status === true &&
				Object.keys(response_data).length === 0
			) {
				Notification('info', 'No course data found', 2000)
				setData((prev) => null)
			} else {
				Notification('error', 'Error!', 2000)
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
