import React from 'react'
import loading from '@images/loading.gif'

export default function Loading() {
	return (
		<div className="loading">
			<div className="loading-modal">
				<img src={loading} alt="Loading..." />
				<div className="loading-text">Loading...</div>
			</div>
		</div>
	)
}
