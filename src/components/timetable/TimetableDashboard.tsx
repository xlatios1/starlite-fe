import { Box, Chip, Paper, Typography } from '@mui/material'
import React from 'react'

type TimetableDashboardProp = {
	info: [string, string][]
}

const TimetableDashboard = ({ info }: TimetableDashboardProp) => {
	return (
		<Paper
			elevation={0}
			sx={{
				mt: '10px',
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
					style={{ paddingRight: '10px', fontWeight: 'bold', fontSize: '14px' }}
				>
					Course Indexes:
				</Typography>
				{info.map(([course, index]) => {
					return (
						<Chip
							label={`${index}`}
							sx={{
								margin: '1px',
								color: 'black',
								background: 'white',
								fontWeight: 'bold',
								marginRight: '5px',
								// border: '1px solid black',
							}}
						/>
					)
				})}
			</Box>
		</Paper>
	)
}

export default TimetableDashboard
