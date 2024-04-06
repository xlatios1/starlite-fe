import { Box, Paper, Typography } from '@mui/material'
import React from 'react'
import styles from './Favourite.module.css'

const TimetableCart = ({ courses }) => {
	return (
		<Paper elevation={1} className={styles.timetableCart}>
			<Box className={styles.timetableCartTitle}>
				<Box className={styles.textTitle}>Courses</Box>
			</Box>
			<Box className={styles.timetableCartBody}>
				{courses.map(({ course, index }) => {
					return (
						<Typography
							className={styles.textBody}
						>{`${course} - ${index}`}</Typography>
					)
				})}
			</Box>
		</Paper>
	)
}

export default TimetableCart
