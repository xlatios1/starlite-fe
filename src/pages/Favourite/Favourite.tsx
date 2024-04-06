import { closeLoading, openLoading } from '@store/loading/loadingSlice.ts'
import React from 'react'
import { useDispatch } from 'react-redux'
import styles from './Favourite.module.css'
import { Box, Paper, Typography } from '@mui/material'
import TimetableCart from './TimetableCart.tsx'

const Favourite = () => {
	// const dispatch = useDispatch()
	// dispatch(openLoading())
	// setTimeout(async () => {
	// 	dispatch(closeLoading())
	// }, 1000)

	const courses = [
		{ course: 'cz3004', index: 12414 },
		{ course: 'cz3005', index: 12411 },
		{ course: 'cz3004', index: 12414 },
		{ course: 'cz3005', index: 12411 },
		{ course: 'cz3004', index: 12414 },
		{ course: 'cz3005', index: 12411 },
		{ course: 'cz3004', index: 12414 },
		{ course: 'cz3005', index: 12411 },
	]

	return (
		<section className={styles.favouritePage}>
			<div className={styles.upperDetail}>Your Saved timetables</div>
			<div className={styles.lowerDetail}>
				<div className={styles.timetableList}> testing </div>
				<Paper elevation={1} className={styles.timetableDetails}>
					{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
						<TimetableCart key={i} courses={courses}></TimetableCart>
					))}
				</Paper>
			</div>
		</section>
	)
}

export default Favourite
