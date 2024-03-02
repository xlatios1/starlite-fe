import React from 'react'
import Button from '@mui/material/Button'
import './tutorial.css'

export default function TutorialButton({
	isWalkThrough,
	setisWalkThrough,
	stepTwo,
	stepThree,
}) {
	const handleTutorial = () => {
		if (!isWalkThrough) {
			if (stepThree) {
				setisWalkThrough(3)
			} else if (stepTwo) {
				setisWalkThrough(2)
			} else {
				setisWalkThrough(1)
			}
		} else {
			setisWalkThrough(0)
		}
	}

	return (
		<>
			{isWalkThrough ? <div className="overlay"></div> : <></>}
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
				{isWalkThrough ? 'Skip walkthrough' : 'help'}
			</Button>
		</>
	)
}

export const helperText = (text: string) => {
	switch (text) {
		case 'searchTip':
			return (
				<div className="highlight-helper primary" style={{ top: '-92px' }}>
					1) Type in your course code/name below! Suggestions will be shown
					below and able to be selected. Hit [Enter] to register search course.
				</div>
			)
		case 'dragNDropTip':
			return (
				<>
					<div className="highlight-helper primary" style={{ top: '-90px' }}>
						2) Over here you may reposition your courses by drag-n-drop, courses
						are ranked priority from top to bottom, meaning it will attempt to
						map the highest priority first!
					</div>
					<div className="highlight-helper primary" style={{ bottom: '-70px' }}>
						3) Once ready, click on [Search].
						<br />
						Condition: Only able to search if there are no conflicts so do
						remove any conflicting courses!
					</div>
				</>
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
					You may only proceed to [Combinations] after [Search]!
				</div>
			)
		case 'showCourseIndexTip':
			return (
				<div
					className="highlight-helper secondary"
					style={{
						top: '200px',
						left: '565px',
						width: '150px',
					}}
				>
					{`<- Click anywhere on the timetable under [Combinations] tab to show the course indexes selected here!`}{' '}
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
					*Note that the Combinations will not update when removing a course
					from the searched list, it will only reflect changes when a [Search]
					is performed.
				</div>
			)
		case 'showTimetableToggleTip':
			return (
				<div
					className="highlight-helper secondary"
					style={{
						top: '-30px',
						left: '100px',
					}}
				>
					You may toggle to [Timetable Preview] or [Combinations] here!
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
						top: '-60px',
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
						top: '880px',
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
						top: '150px',
						left: '565px',
						width: '200px',
					}}
				>
					5) After setting preferences, the timetable are ranked accordingly to
					the preferences set!
				</div>
			)
	}
}
