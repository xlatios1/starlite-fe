/* eslint-disable default-case */
import { useState, useEffect, useRef } from 'react'
import SearchBar from '@components/searchbar/SearchBar'
import TimeTable from '@components/timetable/TimeTable.tsx'
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
import { TimetableHelper } from './TimetableHelper.tsx'
import { TimetableTab } from './TimetableTab.tsx'
import './home.css'

import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'
import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'
import { useDispatch, useSelector } from 'react-redux'
const _ = require('lodash')

export default function Home() {
	const initializedTimetable = Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	)
	const [originalData, setOriginalData] = useState(null) //timetable option datas
	const [preferedData, setPreferedData] = useState(null) //timetable option datas
	const [searched, setSearched] = useState([]) //searched courses
	const [toggleCourseList, setToggleCourseList] = useState(true)
	const searchValidRef = useRef(null)
	const [timetablePreview, setTimetablePreview] = useState(initializedTimetable)
	const [activeTab, setActiveTab] = useState('timetable')

	const dispatch = useDispatch()
	const walkthrough = useSelector((state) => state.walkthrough.walkthrough)

	const handleSearch = (search) => {
		const initialPreferences = {
			minCourseFilter: search.length,
			freeDay: [],
			timeslot: [],
			finalExam: 'Any Exams',
		}

		dispatch(openLoading())
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
				if (walkthrough > 0) {
					dispatch(setWalkthough(3))
				}
			}
			dispatch(closeLoading())
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

	const handleApplyPreference = (preference) => {
		dispatch(openLoading())
		setTimeout(async () => {
			setPreferedData(
				handlePreferences(
					originalData,
					preference,
					convertExamSchedule(searched)
				)
			)
			Notification('success', 'Successfully set preferences!', 1000)
			dispatch(closeLoading())
			if (walkthrough > 0) {
				dispatch(setWalkthough(4))
			}
		}, 1000)
	}

	const openTab = (tabName) => {
		if (preferedData) {
			setActiveTab(tabName)
		}
	}

	return (
		<div className="homepage">
			<div className="upper-detail-wrapper"></div>
			<div className="lower-detail-wrapper">
				{searched.length > 0 ? (
					<div
						className={`preference-wrap ${toggleCourseList ? '' : ' hidden '}${
							walkthrough > 2 ? ' highlight-element' : ''
						}`}
					>
						<PreferenceLists
							courses={searched.map((obj) => Object.keys(obj)[0])}
							handleApplyPreference={handleApplyPreference}
						></PreferenceLists>
						{walkthrough === 3 && helperText('showPreferenceTip')}
						{walkthrough === 3 && helperText('showPreferenceButtonLocationTip')}
					</div>
				) : (
					<div className="placeholder"></div>
				)}
				<div
					className={`time-table-body ${
						walkthrough > 1 ? ' highlight-element ' : ''
					}`}
				>
					{walkthrough === 2 && helperText('searchPreviewTip')}
					{walkthrough === 2 && helperText('showUnableToToggleTabTip')}
					{walkthrough === 3 && helperText('showTimetableToggleTip')}
					{walkthrough === 3 && helperText('showCombinationNoChangeTip')}
					{walkthrough === 4 && helperText('showAfterPreferenceChangeTip')}
					<TimetableTab
						activeTab={activeTab}
						openTab={openTab}
						isDisabled={Boolean(preferedData)}
					/>
					<TimetableHelper activeTab={activeTab} />
					<div className="time-table-wrapper">
						{activeTab === 'combinations' ? (
							<>
								{walkthrough === 3 && helperText('showCourseIndexTip')}
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
				<div
					className={`search-wrapper${
						0 < walkthrough && walkthrough < 3 ? ' highlight-element' : ''
					}`}
				>
					{/* {preferedData ? (
						<div
							className={`exam-wrapper ${
								walkthrough === 3 ? ' highlight-element ' : ''
							}`}
							// style={{
							// 	transform: toggleCourseList
							// 		? ''
							// 		: `translateY(-${transformYValue - 15}px)`,
							// 	marginBottom: toggleCourseList ? '100px' : '',
							// }}
						>
							<ExamInfo exam_schedule={convertExamSchedule(searched)} />
							{walkthrough === 3 && helperText('showExamScheduleTip')}
						</div>
					) : (
						<></>
					)} */}
					{walkthrough === 1 && helperText('searchTip')}
					{walkthrough === 2 && helperText('dragNDropTip')}
					<SearchBar
						handleSearch={handleSearch}
						setToggleCourseList={setToggleCourseList}
						toggleCourseList={toggleCourseList}
						searchValidRef={searchValidRef}
						setTimetablePreview={setTimetablePreview}
						walkthrough={walkthrough}
					></SearchBar>
				</div>
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
					walkthrough={walkthrough}
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
