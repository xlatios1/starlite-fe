import React from 'react'

export function TimetableTab({ activeTab, openTab, isDisabled }) {
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
				Combinations
			</div>
		</div>
	)
}
