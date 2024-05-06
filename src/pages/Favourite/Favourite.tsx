import { closeLoading, openLoading } from '@store/loading/loadingSlice.ts'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Favourite.module.css'
import { IconButton, Paper } from '@mui/material'
import TimetableCart from './TimetableCart.tsx'
import { RootState } from '@store/store.ts'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import {
	loadInitialFavourites,
	renameFavorite,
	removeFavorite,
	savedFavorite,
	revertFavorite,
} from '@store/favourite/favouriteSlice.ts'
import { UserAuth } from '@authentications/AuthContext.js'
import Notification from '@components/notification/notification.tsx'

const Favourite = () => {
	const dispatch = useDispatch()
	// dispatch(openLoading())
	// setTimeout(async () => {
	// 	dispatch(closeLoading())
	// }, 1000)
	const { getFirebaseData, setFirebaseData, fetchUserInCache } = UserAuth()
	const [hoveredIndex, setHoveredIndex] = useState(null)
	const [editingIndex, setEditingIndex] = useState(null)
	const {
		favouriteArray,
		isDirty,
		isInitialRendered: isFavouriteInitialRendered,
	} = useSelector((state: RootState) => state.favourite)
	const favouriteNames = favouriteArray.map((item) => item.name)
	const courses = favouriteArray.map((items) => {
		return items.info.map((data) => {
			return {
				course: data[0],
				index: data[1],
			}
		})
	})

	const handleHover = (index: number) => {
		if (!editingIndex && editingIndex !== 0) {
			setHoveredIndex(index)
		}
	}
	const handleEditing = (index: number) => {
		setEditingIndex(index)
		setHoveredIndex(index)
	}
	const handleSavedNameChange = (index: number, text: string) => {
		if (text.length < 13) {
			dispatch(renameFavorite({ target: index, value: text }))
		}
	}

	const handleUpdate = async () => {
		dispatch(openLoading())
		await setFirebaseData(fetchUserInCache(), {
			favourites: favouriteArray.map((f) => {
				return {
					[f.name]: {
						info: f.info.map((inf, i) => ({ [i]: inf })),
						timetable_data: f.timetable_data.map((week, i) => ({
							[i]: week.map((d, idx) => ({ [idx]: d })),
						})),
					},
				}
			}),
		})
			.then(() => {
				Notification('success', `Successfully saved!`, 1000)
			})
			.catch(() => {
				Notification('error', 'An unexpected error has occured (Save)', 2000)
			})
			.finally(() => {
				dispatch(savedFavorite())
				dispatch(closeLoading())
			})
	}

	const favouriteFirebaseParser = (text) => {
		try {
			return text.map((f) => ({
				name: Object.keys(f)[0],
				info: (Object.values(f)[0] as { info: [] }).info.map(
					(inf) => Object.values(inf)[0]
				),
				timetable_data: (
					Object.values(f)[0] as { timetable_data: [{ [name: number]: [] }] }
				).timetable_data.map((w) =>
					Object.values(w)[0].map((d) => Object.values(d)[0])
				),
			}))
		} catch {
			return []
		}
	}

	useEffect(() => {
		dispatch(openLoading())
		getFirebaseData(fetchUserInCache())
			.then(({ status, data, message }) => {
				switch (status) {
					case 200:
						const { favourites } = data
						if (!isFavouriteInitialRendered)
							dispatch(
								loadInitialFavourites(favouriteFirebaseParser(favourites))
							)
						break
					case 204:
						break
					case 500:
						Notification('error', message, 2000)
						break
					default:
						break
				}
			})
			.catch(() => {
				Notification(
					'error',
					'An unexpected error has occured (Load Favourite)',
					2000
				)
			})
			.finally(() => {
				dispatch(closeLoading())
			})
	}, [])

	return (
		<section className={styles.favouritePage}>
			<div className={styles.upperDetail}>
				<div className={styles.favouriteTitle}>Your Saved Timetables</div>
			</div>
			<div className={styles.lowerDetail}>
				<aside className={styles.timetableList}>
					<div className={styles.timetableListWrapper}>
						{favouriteNames.length > 0 ? (
							favouriteNames.map((name, i) => (
								<div
									key={`${i}-${name}`}
									className={styles.timetableListNamesContainer}
									onMouseEnter={() => handleHover(i)}
									onMouseLeave={() => handleHover(null)}
									style={{
										backgroundColor: hoveredIndex === i ? 'lightblue' : '',
									}}
								>
									<div className={styles.uilDraggableDots}></div>
									{editingIndex === i ? (
										<input
											className={styles.timetableListNames}
											type="text"
											value={name}
											onChange={(e) => handleSavedNameChange(i, e.target.value)}
											onBlur={() => handleEditing(null)}
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleEditing(null)
											}}
											autoFocus
										/>
									) : (
										<div
											className={styles.timetableListNames}
											onClick={() => handleEditing(i)}
										>
											{name}
										</div>
									)}
									{hoveredIndex === i ? (
										<IconButton
											onClick={() => dispatch(removeFavorite(i))}
											sx={{
												display: 'flex',
												justifyContent: 'flex-end',
												height: '40px',
												width: '40px',
												color: 'black',
											}}
										>
											<DeleteOutlinedIcon />
										</IconButton>
									) : (
										<></>
									)}
								</div>
							))
						) : (
							<div></div>
						)}
						{isDirty ? (
							<div className={styles.actionButtonWrapper}>
								<button
									className="fetch-btn"
									onClick={() => dispatch(revertFavorite())}
								>
									<span className="text">revertFavorite</span>
								</button>
								<button className="fetch-btn" onClick={() => handleUpdate()}>
									<span className="text">Sync Favourites</span>
								</button>
							</div>
						) : (
							<></>
						)}
					</div>
				</aside>
				<Paper elevation={1} className={styles.timetableDetails}>
					{courses.map((c, i) => (
						<TimetableCart key={i} courses={c}></TimetableCart>
					))}
				</Paper>
			</div>
		</section>
	)
}

export default Favourite
