import ScrollButton from '@components/buttons/scrollbutton/scrollbutton.tsx'
import Notification from '@components/notification/notification.tsx'
import Paginations from '@components/pagination/pagination.tsx'
import PreferenceLists from '@components/preference/preferencelists.tsx'
import SearchBar from '@components/searchbar/SearchBar.tsx'
import { MatchTimetable } from '@components/timetable/MatchTimetable.tsx'
import TimeTable from '@components/timetable/TimeTable.tsx'
import { applyPreferences } from '@components/timetable/utils/TimeTableCalc.tsx'
import { TimetableTab } from '@components/timetable/utils/TimetableTab.tsx'
import TutorialButton, { helperText } from '@components/tutorial/tutorial.tsx'
import { Box } from '@mui/material'
import { AllPlans, CourseDetails } from '@store/course/courseSlice'
import { closeLoading, openLoading } from '@store/loading/loadingSlice.ts'
import { RootState } from '@store/store'
import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './home.css'
const _ = require('lodash')

export default function Home() {
	const initializedTimetable: any[][] = Array.from({ length: 7 }, () =>
		Array.from({ length: 11 }, () => [])
	)

	const searchValidRef = useRef<HTMLDivElement>(null)
	const [timetablePreview, setTimetablePreview] = useState(initializedTimetable)
	const [timetableData, setTimetableData] = useState([]) //timetable option datas
	const [currentPage, setCurrentPage] = useState(1)
	const [activeTab, setActiveTab] = useState('timetable')

	const dispatch = useDispatch()
	const walkthrough = useSelector(
		(state: RootState) => state.walkthrough.walkthrough
	)
	const currentPlan = useSelector(
		(state: RootState) => state.course.currentPlan
	)
	const AllCourses = useSelector(
		(state: RootState) => state.course.planData
	) as AllPlans

	const handleSearch = (search: CourseDetails[]) => {
		const initialPreferences = {
			freeDay: [],
			timeslot: [],
		}

		dispatch(openLoading())
		setTimeout(async () => {
			if (search.length > 0) {
				if (document.getElementsByClassName('conflict-message').length !== 0) {
					Notification(
						'error',
						'Error! Please resolve course conflict before search!',
						2000
					)
				} else {
					const data = MatchTimetable(search)
					setTimetableData(applyPreferences(data, initialPreferences))
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
				top: 25,
				behavior: 'smooth',
			})
		}
	}, [timetableData])

	const handleApplyPreference = (preference) => {
		dispatch(openLoading())
		setTimeout(async () => {
			setTimetableData(applyPreferences(timetableData, preference))
			Notification('success', 'Successfully set preferences!', 1000)
			dispatch(closeLoading())
			if (walkthrough > 0) {
				dispatch(setWalkthough(4))
			}
		}, 1000)
	}

	const getPaginationPage = (_, page) => {
		setCurrentPage(page)
	}

	return (
		<div className="homepage">
			<div className="detail-wrapper">
				{timetableData.length > 0 ? (
					<div
						className={`preference-wrap ${
							walkthrough > 2 ? ' highlight-element' : ''
						}`}
					>
						<PreferenceLists
							courses={AllCourses[currentPlan].courses}
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
						setActiveTab={setActiveTab}
						isDisabled={timetableData.length > 0}
					/>
					<div className="time-table-wrapper">
						{activeTab === 'combinations' ? (
							<>
								{walkthrough === 3 && helperText('showCourseIndexTip')}
								<div className="time-table-container">
									<TimeTable
										timetable_data={
											timetableData[currentPage - 1].timetable_data
										}
										info={timetableData[currentPage - 1].info} //add in the course indexes informations {code: index}
										showDashboard={true}
									/>
								</div>
								<Paginations
									total={timetableData.length}
									getPaginationPage={getPaginationPage}
								/>
							</>
						) : (
							<TimeTable
								timetable_data={timetablePreview}
								info={AllCourses[currentPlan].courses.reduce((acc, cur) => {
									const course = Object.keys(cur)[0]
									return acc.concat([[course, '', cur[course].colorCode]])
								}, [])}
								showDashboard={false}
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
						courseData={AllCourses[currentPlan]}
						handleSearch={handleSearch}
						searchValidRef={searchValidRef}
						walkthrough={walkthrough}
						setTimetablePreview={setTimetablePreview}
					></SearchBar>
				</div>
			</div>
			<Box
				sx={{
					width: 'fit-content',
					display: 'flex',
					justifyContent: 'end',
					position: 'sticky',
					left: '100%',
					bottom: '30px',
					paddingBottom: '10px',
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
