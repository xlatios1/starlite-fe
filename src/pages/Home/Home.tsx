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
import {
	setTimetableData,
	setCurrentPage,
	setActiveTab,
	resetTimetable,
} from '@store/timetable/timetableSlice.ts'
import { RootState } from '@store/store'
import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './home.css'

export default function Home() {
	const searchValidRef = useRef<HTMLDivElement>(null)

	const dispatch = useDispatch()

	const { activeTab, timetableData, currentPage, timetablePreview, totalPage } =
		useSelector((state: RootState) => state.timetable)

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
					dispatch(setTimetableData(applyPreferences(data, initialPreferences)))
					dispatch(setActiveTab('timetables'))
					Notification('success', 'Search successful', 1000)
					if (walkthrough > 0) {
						dispatch(setWalkthough(4))
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

	useEffect(() => {
		// Scroll only when there is data
		if (AllCourses[currentPlan].courses.length === 0) {
			dispatch(resetTimetable())
		}
	}, [AllCourses, currentPlan, dispatch])

	const handleApplyPreference = (preference) => {
		dispatch(openLoading())
		setTimeout(async () => {
			dispatch(setTimetableData(applyPreferences(timetableData, preference)))
			Notification('success', 'Successfully set preferences!', 1000)
			dispatch(closeLoading())
			if (walkthrough > 0) {
				dispatch(setWalkthough(5))
			}
		}, 1000)
	}

	const getPaginationPage = (_, page) => {
		dispatch(setCurrentPage(page))
	}

	return (
		<div className="homepage">
			{/* {walkthrough === 7 && helperText('navigate-to-favorites', dispatch)} */}
			{walkthrough === 1 && helperText('welcome-intro', dispatch)}
			{walkthrough === 6 && helperText('welcome-outro', dispatch)}
			<div className="detail-wrapper">
				{totalPage > 0 ? (
					<div
						className={`preference-wrap ${
							5 > walkthrough && walkthrough > 3 ? ' highlight-element' : ''
						}`}
					>
						<PreferenceLists
							courses={AllCourses[currentPlan].courses}
							handleApplyPreference={handleApplyPreference}
						></PreferenceLists>
						{walkthrough === 4 && helperText('showPreferenceTip')}
						{walkthrough === 4 && helperText('showPreferenceButtonLocationTip')}
					</div>
				) : (
					<div className="placeholder"></div>
				)}
				<div
					className={`time-table-body ${
						walkthrough === 3 || walkthrough === 5 ? ' highlight-element ' : ''
					}`}
				>
					{walkthrough === 3 && helperText('searchPreviewTip')}
					{walkthrough === 3 && helperText('showUnableToToggleTabTip')}
					{walkthrough === 5 && helperText('showTimetableToggleTip')}
					{walkthrough === 5 && helperText('showCombinationNoChangeTip')}
					{walkthrough === 5 && helperText('showAfterPreferenceChangeTip')}
					<TimetableTab activeTab={activeTab} isDisabled={totalPage > 0} />
					<div className="time-table-wrapper">
						{activeTab === 'timetables' ? (
							<>
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
									walkthrough={walkthrough}
									total={totalPage}
									getPaginationPage={getPaginationPage}
								/>
								{walkthrough === 5 && helperText('showPaginationTip')}
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
				{walkthrough === 2 && helperText('searchTip')}
				{walkthrough === 3 && helperText('dragNDropTip')}
				<div
					className={`search-wrapper${
						1 < walkthrough && walkthrough < 4 ? ' highlight-element' : ''
					}`}
				>
					<SearchBar
						courseData={AllCourses[currentPlan]}
						handleSearch={handleSearch}
						searchValidRef={searchValidRef}
						walkthrough={walkthrough}
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
					stepTwo={AllCourses[currentPlan].courses.length > 0}
					stepThree={timetableData.length > 0}
				/>
			</Box>
		</div>
	)
}
