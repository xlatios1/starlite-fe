// import { GenerateTimetable } from '@components/timetable/generatetimetable.tsx'
// import Notification from '@components/notification/notification.tsx'
// import { handlePreferences } from '@components/timetable/timetableUtils/TimeTableCalc.tsx'

// import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'
// import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'

// export const handleSearch = (
// 	search,
// 	setOriginalData,
// 	setPreferedData,
// 	setActiveTab,
// 	walkthrough,
// 	dispatch
// ) => {
// 	const initialPreferences = {
// 		minCourseFilter: search.length,
// 		freeDay: [],
// 		timeslot: [],
// 	}

// 	dispatch(openLoading())
// 	setTimeout(async () => {
// 		if (search.length > 0) {
// 			if (document.getElementsByClassName('conflict-message').length !== 0) {
// 				const errorMessage =
// 					'Error! Please resolve course conflict before search!'
// 				Notification('error', errorMessage, 2000)
// 			} else {
// 				const data = GenerateTimetable(search)
// 				setOriginalData(data)
// 				setPreferedData(handlePreferences(data, initialPreferences))
// 				setActiveTab('combinations')
// 				Notification('success', 'Search successful', 1000)
// 				if (walkthrough > 0) {
// 					dispatch(setWalkthough(3))
// 				}
// 			}
// 		} else {
// 			Notification('info', 'Please add courses first!', 1000)
// 		}
// 		dispatch(closeLoading())
// 	}, 1000)
// }
