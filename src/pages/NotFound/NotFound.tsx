import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'
import { UserAuth } from '@authentications/AuthContext'
export default function NotFound() {
	const Navigate = useNavigate()
	const { fetchUserInCache } = UserAuth()
	const curUser = fetchUserInCache()

	return (
		<div className={styles.errorPage}>
			<div className={styles.errorContainer}>
				<div className={styles.errorCode}>
					<p>4</p>
					<p>0</p>
					<p>4</p>
				</div>
				<div className={styles.errorTitle}>Page not found</div>
				<div className={styles.errorDescription}>
					We can't seem to find that page. It might have been removed or doesn't
					exist anymore.
				</div>
				<button
					className={styles.action}
					onClick={() => Navigate(curUser ? '/home' : '/')}
				>
					{'Lets Get You Home'}
				</button>
			</div>
		</div>
	)
}
