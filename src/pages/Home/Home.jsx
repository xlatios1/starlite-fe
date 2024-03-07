/* eslint-disable default-case */
import { useState, useEffect, useRef } from 'react'
import SearchBar from '@components/searchbar/SearchBar'
import TimeTable from '@components/timetable/TimeTable.tsx'
import Notification from '@components/notification/notification.tsx'
import ScrollButton from '@components/scrollbutton/scrollbutton.tsx'
import PreferenceLists from '@components/preference/preferencelists.tsx'
import { UserAuth } from '@authentications/AuthContext.js'
import { Box } from '@mui/material'
import TutorialButton, { helperText } from '@components/tutorial/tutorial.tsx'
import { GenerateTimetable } from '@components/timetable/generatetimetable.tsx'
import { handlePreferences } from '@components/timetable/timetableUtils/TimeTableCalc.tsx'
import { TimetableHelper } from '@components/timetable/timetableUtils/TimetableHelper.tsx'
import { TimetableTab } from '@components/timetable/timetableUtils/TimetableTab.tsx'
import { GenerateCommonTimetable } from '@components/timetable/generatetimetable.tsx'
import './home.css'

import { setCourse } from '@store/course/courseSlice.ts'
import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'
import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'
import { useDispatch, useSelector } from 'react-redux'
const _ = require('lodash')

export default function Home({ user }) {
	const initializedTimetable = Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	)
	const { getFirebaseData, setFirebaseData } = UserAuth()
	const [plan, setPlan] = useState(1)
	const [timetableData, setTimetableData] = useState([]) //timetable option datas
	const searchValidRef = useRef(null)
	const [timetablePreview, setTimetablePreview] = useState(initializedTimetable)
	const [activeTab, setActiveTab] = useState('timetable')
	const [isInitialRender, setIsInitialRender] = useState(true)

	const dispatch = useDispatch()
	const walkthrough = useSelector((state) => state.walkthrough.walkthrough)
	const courses = useSelector((state) => state.course.courses)

	useEffect(() => {
		dispatch(openLoading())
		getFirebaseData(user)
			.then((data) => {
				if (data.hasOwnProperty(`plan ${plan}`)) {
					dispatch(setCourse(data[`plan ${plan}`]))
				} else {
					dispatch(setCourse([]))
				}
				dispatch(closeLoading())
			})
			.then(() => setIsInitialRender(false))
	}, [plan])

	//TODO BBUG THAT WILL RESET THE FIRST INITIAL RENDER.
	useEffect(() => {
		if (!isInitialRender) {
			setFirebaseData(user, { [`plan ${plan}`]: courses })
		}
		setTimetablePreview(GenerateCommonTimetable(courses))
	}, [courses])

	const handleSearch = (search) => {
		const initialPreferences = {
			minCourseFilter: search.length,
			freeDay: [],
			timeslot: [],
		}

		dispatch(openLoading())
		setTimeout(async () => {
			if (search.length > 0) {
				if (document.getElementsByClassName('conflict-message').length !== 0) {
					const errorMessage =
						'Error! Please resolve course conflict before search!'
					Notification('error', errorMessage, 2000)
				} else {
					const data = GenerateTimetable(search)
					setTimetableData(handlePreferences(data, initialPreferences))
					setActiveTab('combinations')
					Notification('success', 'Search successful', 1000)
					if (walkthrough > 0) {
						dispatch(setWalkthough(3))
					}
				}
			} else {
				Notification('info', 'Please add courses first!', 1000)
			}
			dispatch(closeLoading())
		}, 1000)
	}

	useEffect(() => {
		// Scroll only when there is data
		if (timetableData) {
			window.scrollTo({
				left: 0,
				top: 40,
				behavior: 'smooth',
			})
		}
	}, [timetableData])

	const handleApplyPreference = (preference) => {
		dispatch(openLoading())
		setTimeout(async () => {
			setTimetableData(handlePreferences(timetableData, preference))
			Notification('success', 'Successfully set preferences!', 1000)
			dispatch(closeLoading())
			if (walkthrough > 0) {
				dispatch(setWalkthough(4))
			}
		}, 1000)
	}

	const openTab = (tabName) => {
		if (timetableData) {
			setActiveTab(tabName)
		}
	}

	return (
		<div className="homepage">
			<div className="upper-detail-wrapper"></div>
			<div className="lower-detail-wrapper">
				{timetableData.length > 0 ? (
					<div
						className={`preference-wrap ${
							walkthrough > 2 ? ' highlight-element' : ''
						}`}
					>
						<PreferenceLists
							courses={courses}
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
						isDisabled={timetableData.length > 0}
					/>
					<TimetableHelper activeTab={activeTab} />
					<div className="time-table-wrapper">
						{activeTab === 'combinations' ? (
							<>
								{walkthrough === 3 && helperText('showCourseIndexTip')}
								{timetableData.map(({ timetable_data, info }, key) => {
									return (
										<div className="time-table-container" key={key}>
											<TimeTable
												key={key + key}
												timetable_data={timetable_data}
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
					{walkthrough === 1 && helperText('searchTip')}
					{walkthrough === 2 && helperText('dragNDropTip')}
					<SearchBar
						courses={courses}
						handleSearch={handleSearch}
						searchValidRef={searchValidRef}
						walkthrough={walkthrough}
						plan={plan}
						setPlan={setPlan}
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
				<ScrollButton display={Boolean(timetableData)} />
				<TutorialButton
					walkthrough={walkthrough}
					stepTwo={!_.isEqual(timetablePreview, initializedTimetable)}
					stepThree={Boolean(timetableData)}
				/>
			</Box>
		</div>
	)
}