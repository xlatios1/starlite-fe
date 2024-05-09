import React from 'react'
import Button from '@mui/material/Button'
import './tutorial.css'
import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'
import { useDispatch } from 'react-redux'
import { Dialog } from '@mui/material'

export default function TutorialButton({ walkthrough, stepTwo, stepThree }) {
	const dispatch = useDispatch()
	const handleTutorial = () => {
		console.log(walkthrough)
		if (!walkthrough) {
			if (stepThree) {
				dispatch(setWalkthough(4))
			} else if (stepTwo) {
				dispatch(setWalkthough(3))
			} else {
				dispatch(setWalkthough(1))
			}
		} else {
			dispatch(setWalkthough(0))
		}
	}

	return (
		<>
			{walkthrough > 0 ? (
				<div className="overlay">
					{walkthrough === 6 ? (
						<div className="outro">
							<div className="firework"></div>
							<div className="firework"></div>
							<div className="firework"></div>
						</div>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}
			<Button
				variant="outlined"
				sx={{
					backgroundColor: 'white',
					fontSize: '10px',
					marginRight: '20px',
					zIndex: '9999',
				}}
				onClick={handleTutorial}
			>
				{walkthrough > 0 ? 'Skip walkthrough' : 'help'}
			</Button>
		</>
	)
}

export const helperText = (text: string, dispatch?) => {
	switch (text) {
		case 'welcome-intro':
			return (
				<Dialog
					open={true}
					onClose={() => dispatch(setWalkthough(0))}
					className="introduction-helper"
				>
					<div className="introduction-title">
						Welcome to Starlite user guide! ✨
					</div>
					<div className="introduction-body">
						Hopefully you will find this guide useful and how to utilise fully
						on what Starlite has to offer! 😊
					</div>
					<div className="introduction-action">
						<Button
							variant="contained"
							onClick={() => dispatch(setWalkthough(2))}
						>
							Show Me!
						</Button>
					</div>
				</Dialog>
			)
		case 'searchTip':
			return (
				<div
					className="highlight-helper primary"
					style={{ right: '300px', width: '300px' }}
				>
					1) Type in your course code/name here! Suggestions will be shown below
					and able to be selected. Select by clicking or [Enter] to register
					search course.
				</div>
			)
		case 'dragNDropTip':
			return (
				<div
					className="highlight-helper primary"
					style={{ top: '150px', right: '300px', width: '300px' }}
				>
					2) Over here you may reposition your courses by drag-n-drop, courses
					are ranked priority from top to bottom, meaning it will attempt to map
					the highest priority first!
					<br />
					<br />
					3) Once ready, click on [Search].
					<br />
					**Condition: Only able to search if there are no conflicts so do
					remove any conflicting courses!
				</div>
			)
		case 'searchPreviewTip':
			return (
				<div
					className="highlight-helper secondary"
					style={{
						top: '50px',
						right: '465px',
						width: '300px',
						opacity: '0.95',
					}}
				>
					{'^'}
					<br />
					{`The common classes within indexes of a course are shown here under
					[Timetable Preview] tab. Use this information to plan around using the
					preferences options!`}
				</div>
			)
		case 'showUnableToToggleTabTip':
			return (
				<div
					className="highlight-helper secondary"
					style={{
						top: '-30px',
						left: '140px',
					}}
				>
					You may only proceed to [Timetables] after [Search]!
				</div>
			)
		case 'showCombinationNoChangeTip':
			return (
				<div
					className="highlight-helper secondary"
					style={{
						top: '150px',
						left: '565px',
						width: '300px',
					}}
				>
					*Note that the Timetables will not update when adding/removing a
					course from the searched list, it will only reflect changes when a
					[Search] is performed.
				</div>
			)
		case 'showTimetableToggleTip':
			return (
				<div
					className="highlight-helper secondary"
					style={{
						top: '-30px',
						left: '150px',
					}}
				>
					You may toggle between [Fixed Slot] and [Timetables] here!
				</div>
			)
		case 'showExamScheduleTip':
			return (
				<div
					className="highlight-helper secondary"
					style={{
						top: '-55px',
						right: '50px',
						width: '200px',
					}}
				>
					Exam Schedules of mapped courses are shown here!
				</div>
			)
		case 'showPreferenceTip':
			return (
				<div
					className="highlight-helper primary"
					style={{
						top: '-80px',
						left: '-20px',
						width: '350px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					4) Set preferences to find your most suited timetable! After selection
					click [Apply Preference] below!
					<div
						className="walk-through-scroll-btn"
						onClick={() => {
							window.scrollTo({
								left: 0,
								top: 400,
								behavior: 'smooth',
							})
						}}
					>
						{'<scroll to preference btn>'}
					</div>
				</div>
			)
		case 'showPreferenceButtonLocationTip':
			return (
				<div
					className="highlight-helper secondary"
					style={{
						top: '750px',
						left: '70px',
						width: '150px',
					}}
				>
					{'[Preference button] can be found here!'}
				</div>
			)
		case 'showAfterPreferenceChangeTip':
			return (
				<div
					className="highlight-helper primary"
					style={{
						top: '300px',
						left: '565px',
						width: '200px',
					}}
				>
					5) After setting preferences, the timetable are ranked accordingly to
					the preferences set!
				</div>
			)
		case 'showPaginationTip':
			return (
				<div
					className="highlight-helper primary"
					style={{
						top: '520px',
						left: '490px',
						width: '200px',
					}}
				>
					Navigate through all the possible generated timetable to find the one
					you like! Once you found your liking, save it by clicking on the
					timetable!
				</div>
			)
		case 'navigate-to-favorites':
			return (
				<div
					className="highlight-helper primary"
					style={{
						position: 'fixed',
						top: '40px',
						right: '200px',
						width: '200px',
					}}
				>
					<div> ^ </div>
					You can find all of your saved favorites here!
				</div>
			)
		case 'welcome-outro':
			return (
				<Dialog
					open={true}
					onClose={() => dispatch(setWalkthough(0))}
					className="introduction-helper"
				>
					<div className="introduction-title">
						🎉 You have completed the tutorial! 🎉
					</div>
					<div className="introduction-body">
						Thank you for patiently going through this long winded tutorial,
						hope you will be able to find your ideal timetable!! 😊
						<br />
						<br />
						<p>
							If there is something unclear, please reach out to me by filling
							up the feedback form at [About]!
						</p>
					</div>
					<div className="introduction-action">
						<Button
							variant="contained"
							onClick={() => dispatch(setWalkthough(0))}
						>
							Embark your journey!
						</Button>
					</div>
				</Dialog>
			)
	}
}
