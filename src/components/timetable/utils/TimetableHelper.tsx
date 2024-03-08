import React from 'react'

export function TimetableHelper({ activeTab }) {
	const helperMessage = (tabName: 'timetable' | 'combinations') => {
		switch (tabName) {
			case 'timetable':
				return 'This tab shows the preview of fixed classes within the courses, preventing guarenteed conflicts from happening. This does not prevent conflicts from happening within changable indexes.'
			case 'combinations':
				return `This tab shows all possible course combinations. If the timetable matched less than the searched course, it is likely due to all of that course indexes has conflicts within the combination.`
		}
	}
	return (
		<div className="time-table-helper">
			<i
				className="fa fa-info-circle"
				style={{ color: 'lightblue', margin: '0 10px' }}
			></i>
			{helperMessage(activeTab)}
		</div>
	)
}
