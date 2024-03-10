import React from 'react'

export function TimetableTab({ activeTab, setActiveTab, isDisabled }) {
	const openTab = (tabName) => {
		if (isDisabled) {
			setActiveTab(tabName)
		}
	}

	return (
		<div className="time-table-tab">
			<div
				className={`time-table-tab-option ${
					activeTab === 'timetable' ? 'active' : ''
				}`}
				style={{ borderTopLeftRadius: '15px' }}
				onClick={() => openTab('timetable')}
			>
				Fixed Slot
			</div>
			<div
				className={`time-table-tab-option ${
					activeTab === 'combinations' ? 'active' : ''
				} ${isDisabled ? '' : 'disabled'}`}
				style={{ borderTopRightRadius: '15px' }}
				onClick={() => openTab('combinations')}
			>
				Timetables
			</div>
		</div>
	)
}
