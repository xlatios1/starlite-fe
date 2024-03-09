import { useState, useEffect, useRef } from 'react'
import SearchBar from '@components/searchbar/SearchBar'
import TimeTable from '@components/timetable/TimeTable.tsx'
import Notification from '@components/notification/notification.tsx'
import ScrollButton from '@components/scrollbutton/scrollbutton.tsx'
import PreferenceLists from '@components/preference/preferencelists.tsx'
import { Box } from '@mui/material'
import TutorialButton, { helperText } from '@components/tutorial/tutorial.tsx'
import { applyPreferences } from '@components/timetable/utils/TimeTableCalc.tsx'
import { TimetableHelper } from '@components/timetable/utils/TimetableHelper.tsx'
import { TimetableTab } from '@components/timetable/utils/TimetableTab.tsx'
import { MatchTimetable } from '@components/timetable/MatchTimetable.tsx'
import './home.css'
import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'
import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'
import { useDispatch, useSelector } from 'react-redux'
const _ = require('lodash')

export default function Home() {
	const initializedTimetable = Array.from({ length: 7 }, () =>
		Array.from({ length: 16 }, () => [])
	)

	const [timetableData, setTimetableData] = useState([]) //timetable option datas
	const searchValidRef = useRef(null)
	const [timetablePreview, setTimetablePreview] = useState(initializedTimetable)
	const [activeTab, setActiveTab] = useState('timetable')

	const dispatch = useDispatch()
	const walkthrough = useSelector((state) => state.walkthrough.walkthrough)
	const courses = useSelector((state) => state.course.courses)

	const handleSearch = (search) => {
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
				top: 40,
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
						setActiveTab={setActiveTab}
						isDisabled={timetableData.length > 0}
					/>
					<TimetableHelper activeTab={activeTab} />
					<div className="time-table-wrapper">
						{activeTab === 'combinations' ? (
							<>
								{walkthrough === 3 && helperText('showCourseIndexTip')}
								{timetableData.map(({ timetable_data, info }, index) => {
									return (
										<div className="time-table-container" key={index}>
											<TimeTable
												timetable_data={timetable_data}
												info={info} //add in the course indexes informations {code: index}
											/>
										</div>
									)
								})}
							</>
						) : (
							<TimeTable timetable_data={timetablePreview} info={null} />
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
