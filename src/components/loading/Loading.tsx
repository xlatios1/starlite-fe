import React from 'react'
import loading from '@images/loading.gif'
import './loading.css'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store.ts'

export default function Loading() {
	const { isLoading } = useSelector((state: RootState) => state.loading)

	return (
		<>
			{isLoading && (
				<div className="loading">
					<div className="loading-modal">
						<img src={loading} alt="Loading..." />
						<div className="loading-text">Loading...</div>
					</div>
				</div>
			)}
		</>
	)
}
