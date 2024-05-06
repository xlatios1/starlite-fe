import { Paper } from '@mui/material'
import { setActiveTab } from '@store/timetable/timetableSlice.ts'
import React from 'react'
import { useDispatch } from 'react-redux'

type TimetableTabProps = {
	activeTab: string
	isDisabled: boolean
}

export function TimetableTab({ activeTab, isDisabled }: TimetableTabProps) {
	const dispatch = useDispatch()
	const openTab = (tabName: 'fixed slot' | 'timetables') => {
		if (isDisabled) {
			dispatch(setActiveTab(tabName))
		}
	}

	return (
		<Paper
			elevation={0}
			sx={{ flexDirection: 'row', display: 'flex', mb: '10px' }}
		>
			<div
				className={`time-table-tab-option ${
					activeTab === 'fixed slot' ? 'active' : ''
				}`}
				style={{ borderRadius: '5px 0 0 5px' }}
				onClick={() => openTab('fixed slot')}
			>
				Fixed Slot
			</div>
			<div
				className={`time-table-tab-option ${
					activeTab === 'timetables' ? 'active' : ''
				} ${isDisabled ? '' : 'disabled'}`}
				style={{ borderRadius: '0 5px 5px 0' }}
				onClick={() => openTab('timetables')}
			>
				Timetables
			</div>
		</Paper>
	)
}
