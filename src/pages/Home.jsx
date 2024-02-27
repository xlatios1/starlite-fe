/* eslint-disable default-case */
import { useState, useEffect, useRef } from 'react'
import SearchBar from '@components/searchbar/SearchBar'
import TimeTable from '@components/timetable/TimeTable.tsx'
import Loading from '@components/loading/Loading.tsx'
import Notification from '@components/notification/notification.tsx'
import ScrollButton from '@components/scrollbutton/scrollbutton.tsx'
import PreferenceLists from '@components/preference/preferencelists.tsx'
import ExamInfo from '@components/examinfo/examinfo.tsx'
import { Box } from '@mui/material'
import TutorialButton, { helperText } from '@components/tutorial/tutorial.tsx'
import { convertExamSchedule } from '@utils/parsers.ts'
import { GenerateTimetable } from '@utils/generatetimetable.tsx'
import { GenerateTimetableFormat } from '@utils/generatecommoninfo.ts'
import { handlePreferences } from '@components/timetable/TimeTableCalc.tsx'
import '@styles/home.css'
const _ = require('lodash')

export default function Home() {
	const initializedTimetable = Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	)
	const [originalData, setOriginalData] = useState(null) //timetable option datas
	const [preferedData, setPreferedData] = useState(null) //timetable option datas
	const [searched, setSearched] = useState([]) //searched courses
	const [isLoading, setIsLoading] = useState(false)
	const [toggleCourseList, setToggleCourseList] = useState(true)
	const [transformYValue, setTransformYValue] = useState(0)
	const searchValidRef = useRef(null)
	const [timetablePreview, setTimetablePreview] = useState(initializedTimetable)
	const [activeTab, setActiveTab] = useState('timetable')
	const [isWalkThrough, setisWalkThrough] = useState(0)

	const handleSearch = (search) => {
		const initialPreferences = {
			minCourseFilter: search.length,
			freeDay: [],
			timeslot: [],
			finalExam: 'Any Exams',
		}

		setIsLoading(true)
		setTimeout(async () => {
			if (document.getElementsByClassName('conflict-message').length !== 0) {
				const errorMessage =
					'Error! Please resolve course conflict before search!'
				Notification('error', errorMessage, 2000)
			} else {
				setSearched(search)
				const compatibleTimetable = GenerateTimetable(search)
				const data = compatibleTimetable.map(({ timetable_data, info }) =>
					GenerateTimetableFormat(timetable_data, info)
				)
				setOriginalData(data)
				setPreferedData(
					handlePreferences(
						data,
						initialPreferences,
						convertExamSchedule(search)
					)
				)
				setToggleCourseList(false)
				setActiveTab('combinations')
				Notification('success', 'Search successful', 1000)
				if (isWalkThrough) {
					setisWalkThrough(3)
				}
			}
			setIsLoading(false)
		}, 1000)
	}

	useEffect(() => {
		// Scroll only when there is data
		if (preferedData) {
			window.scrollTo({
				left: 0,
				top: 40,
				behavior: 'smooth',
			})
		}
	}, [preferedData])

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
			setPreferedData(
				handlePreferences(
					originalData,
					preference,
					convertExamSchedule(searched)
				)
			)
			Notification('success', 'Successfully set preferences!', 1000)
			setIsLoading(false)
			setisWalkThrough(4)
		}, 1000)
	}

	const openTab = (tabName) => {
		if (preferedData) {
			setActiveTab(tabName)
		}
	}

	const helperMessage = (tabName) => {
		switch (tabName) {
			case 'timetable':
				return 'This tab shows the fixed timetable classes within a course.'
			case 'combinations':
				return `This tab shows all the possible course combinations. Navigate to 'Timetable Preview' for a better understanding of using preferences!`
		}
	}

	return (
		<div className="homepage">
			{isLoading && <Loading />}
			<div className="upper-detail-wrapper"></div>
			<div className="lower-detail-wrapper">
				<div
					className={`search-wrapper${
						0 < isWalkThrough && isWalkThrough < 3 ? ' highlight-element' : ''
					}`}
				>
					{isWalkThrough === 1 && helperText('searchTip')}
					{isWalkThrough === 2 && helperText('dragNDropTip')}
					<SearchBar
						handleSearch={handleSearch}
						setIsLoading={setIsLoading}
						setToggleCourseList={setToggleCourseList}
						toggleCourseList={toggleCourseList}
						searchValidRef={searchValidRef}
						setTimetablePreview={setTimetablePreview}
						isWalkThrough={isWalkThrough}
						setisWalkThrough={setisWalkThrough}
					></SearchBar>
					{searched.length > 0 ? (
						<div
							className={`preference-wrap ${
								toggleCourseList ? '' : ' hidden '
							}${isWalkThrough > 2 ? ' highlight-element' : ''}
							`}
							style={{
								transform: toggleCourseList
									? ''
									: `translateY(-${transformYValue - 15}px)`,
								marginBottom: toggleCourseList ? '100px' : '',
							}}
						>
							<PreferenceLists
								courses={searched.map((obj) => Object.keys(obj)[0])}
								handleApplyPreference={handleApplyPreference}
								isWalkThrough={isWalkThrough}
							></PreferenceLists>
							{isWalkThrough === 3 && helperText('showPreferenceTip')}
							{isWalkThrough === 3 &&
								helperText('showPreferenceButtonLocationTip')}
						</div>
					) : (
						<></>
					)}
				</div>
				<div
					className={`time-table-body ${
						isWalkThrough > 1 ? ' highlight-element ' : ''
					}`}
				>
					{isWalkThrough === 2 && helperText('searchPreviewTip')}
					{isWalkThrough === 2 && helperText('showUnableToToggleTabTip')}
					{isWalkThrough === 3 && helperText('showTimetableToggleTip')}
					{isWalkThrough === 3 && helperText('showCombinationNoChangeTip')}
					{isWalkThrough === 4 && helperText('showAfterPreferenceChangeTip')}
					<div className="time-table-tab">
						<div
							className={`time-table-tab-option ${
								activeTab === 'timetable' ? 'active' : ''
							}`}
							style={{ borderTopLeftRadius: '15px' }}
							onClick={() => openTab('timetable')}
						>
							Timetable Preview
						</div>
						<div
							className={`time-table-tab-option ${
								activeTab === 'combinations' ? 'active' : ''
							} ${preferedData ? '' : 'disabled'}`}
							style={{ borderTopRightRadius: '15px' }}
							onClick={() => openTab('combinations')}
						>
							Combinations
						</div>
					</div>
					<div className="time-table-helper">
						<i
							className="fa fa-info-circle"
							style={{ color: 'lightblue', margin: '0 10px' }}
						></i>
						{helperMessage(activeTab)}
					</div>
					<div className="time-table-wrapper">
						{activeTab === 'combinations' ? (
							<>
								{isWalkThrough === 3 && helperText('showCourseIndexTip')}
								{preferedData.map(({ timetable, info }, key) => {
									return (
										<div className="time-table-container" key={key}>
											<TimeTable
												key={key + key}
												timetable_data={timetable}
												info={info} //add in the course indexes informations {code: index}
											/>
										</div>
									)
								})}
							</>
						) : (
							<TimeTable
								key={'default_table'}
								timetable_data={timetablePreview}
								info={null}
							/>
						)}
					</div>
				</div>
				{preferedData ? (
					<div
						className={`exam-wrapper ${
							isWalkThrough === 3 ? ' highlight-element ' : ''
						}`}
					>
						<ExamInfo exam_schedule={convertExamSchedule(searched)} />
						{isWalkThrough === 3 && helperText('showExamScheduleTip')}
					</div>
				) : (
					<div className="placeholder"></div>
				)}
			</div>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'end',
					position: 'sticky',
					bottom: '30px',
				}}
			>
				<ScrollButton display={Boolean(preferedData)} />
				<TutorialButton
					isWalkThrough={isWalkThrough}
					setisWalkThrough={setisWalkThrough}
					stepTwo={!_.isEqual(timetablePreview, initializedTimetable)}
					stepThree={Boolean(preferedData)}
				/>
			</Box>
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
