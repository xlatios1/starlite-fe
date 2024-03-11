import { Box, Chip, Paper, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { Info } from './types/timetableTypes'

type TimetableDashboardProp = {
	dashboardInfo: Info
	showDashboard: boolean
}

const tooltipStyle = {
	popper: {
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, -9],
				},
			},
		],
	},
}

const TimetableDashboard = ({
	dashboardInfo,
	showDashboard,
}: TimetableDashboardProp) => {
	return (
		<>
			{showDashboard && (
				<Paper
					elevation={0}
					sx={{
						mb: '10px',
						padding: '10px',
						backgroundColor: 'rgb(149, 217, 240)',
						border: '1px solid black',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography
							style={{
								paddingRight: '10px',
								fontWeight: 'bold',
								fontSize: '14px',
							}}
						>
							Course Indexes:
						</Typography>
						{dashboardInfo.map(([course, index, colorCode]) => {
							return (
								<Tooltip
									title={course}
									placement="top"
									arrow
									slotProps={tooltipStyle}
								>
									<Chip
										label={`${index}`}
										sx={{
											margin: '1px',
											background: 'white',
											fontWeight: 'bold',
											marginRight: '5px',
											color: 'black',
											backgroundColor: `var(${colorCode})`,
										}}
									/>
								</Tooltip>
							)
						})}
					</Box>
				</Paper>
			)}
		</>
	)
}

export default TimetableDashboard
