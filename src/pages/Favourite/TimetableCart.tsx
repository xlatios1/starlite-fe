import { Box, Paper, Typography } from '@mui/material'
import React from 'react'
import styles from './Favourite.module.css'

const TimetableCart = ({ courses, name }) => {
	return (
		<Box className={styles.timetableCartContainer}>
			<Paper elevation={1} className={styles.timetableCart} onClick={() => {}}>
				<Box className={styles.timetableCartTitle}>
					<Box className={styles.textTitle}>{name}</Box>
				</Box>
				<Box className={styles.timetableCartBody}>
					{courses.map(({ course, index }) => {
						return (
							<Typography
								className={styles.textBody}
								key={`${course} - ${index}`}
							>{`${course} - ${index}`}</Typography>
						)
					})}
				</Box>
			</Paper>
		</Box>
	)
}

export default TimetableCart
