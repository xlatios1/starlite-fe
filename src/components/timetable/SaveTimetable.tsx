import { Box, Button, Dialog, Grid, Typography } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { addNewFavorite } from '@store/favourite/favouriteSlice.ts'
import Notification from '@components/notification/notification.tsx'

const SaveTimetable = ({ open, setClose, data }) => {
	const dispatch = useDispatch()
	const handleSave = () => {
		dispatch(addNewFavorite({ name: 'testing', ...data }))
		setClose()
		Notification('success', 'Successfully saved timetable!')
	}

	return (
		<Dialog open={open} onClose={setClose}>
			<Box sx={{ padding: 2 }}>
				<Grid container alignItems={'center'}>
					<Grid item lg md sm xs>
						<Typography
							sx={{
								textAlign: 'center',
								textDecoration: 'underline',
								fontWeight: 700,
							}}
							variant="h6"
						>
							Save Timetable?
						</Typography>
					</Grid>
				</Grid>
				<Box>
					<Typography component="div">
						<Box
							sx={{
								fontStyle: 'italic',
								my: '20px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							Like this timetable? You can save this to view it later!
						</Box>
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
					<Button
						sx={{
							fontSize: '10px',
							mx: '10px',
						}}
						variant="contained"
						onClick={handleSave}
					>
						Save
					</Button>
					<Button
						sx={{
							fontSize: '10px',
							mx: '10px',
						}}
						variant="outlined"
						onClick={setClose}
					>
						Close
					</Button>
				</Box>
			</Box>
		</Dialog>
	)
}

export default SaveTimetable
