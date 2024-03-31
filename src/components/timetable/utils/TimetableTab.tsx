import { Paper } from '@mui/material'
import React from 'react'

type TimetableTabProps = {
	activeTab: string
	setActiveTab: React.Dispatch<React.SetStateAction<string>>
	isDisabled: boolean
}

export function TimetableTab({
	activeTab,
	setActiveTab,
	isDisabled,
}: TimetableTabProps) {
	const openTab = (tabName: string) => {
		if (isDisabled) {
			setActiveTab(tabName)
		}
	}

	return (
		<Paper
			elevation={0}
			sx={{ flexDirection: 'row', display: 'flex', mb: '10px' }}
		>
			<div
				className={`time-table-tab-option ${
					activeTab === 'timetable' ? 'active' : ''
				}`}
				style={{ borderRadius: '5px 0 0 5px' }}
				onClick={() => openTab('timetable')}
			>
				Fixed Slot
			</div>
			<div
				className={`time-table-tab-option ${
					activeTab === 'combinations' ? 'active' : ''
				} ${isDisabled ? '' : 'disabled'}`}
				style={{ borderRadius: '0 5px 5px 0' }}
				onClick={() => openTab('combinations')}
			>
				Timetables
			</div>
		</Paper>
	)
}
