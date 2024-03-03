import './upload.css'
import { useState, useEffect } from 'react'
import Dropzone from '@components/dropzone/dropzone.tsx'

import { useDispatch } from 'react-redux'
import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'

export default function Upload() {
	const [currentTab, setCurrentTab] = useState('upload')
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(openLoading())
		setTimeout(() => {
			dispatch(closeLoading())
		}, 1000)
	}, [currentTab])

	return (
		<>
			<div className="upload-content">
				<h2 className="upload-title">Progression tracker</h2>
				<p className="upload-description">
					Find out which courses stands between you and graduation!
				</p>
			</div>
			<div className="tab-container">
				<a onClick={() => setCurrentTab('upload')}>
					<p className={currentTab === 'upload' ? 'active' : null}>
						Upload data
					</p>
				</a>
				<a onClick={() => setCurrentTab('progress')}>
					<p className={currentTab === 'progress' ? 'active' : null}>
						Fetch progression
					</p>
				</a>
			</div>
			{currentTab === 'upload' ? (
				<div className="section">
					<div className="section-container">
						<section className="upload-rules">
							<p
								style={{
									fontWeight: '700',
									textDecoration: 'underline',
									fontSize: '16px',
								}}
							>
								Upload your files below!
							</p>
							<p style={{ fontStyle: 'italic' }}>
								File sizes must be less than 10mb
							</p>
						</section>
						<div className="upload-container">
							<Dropzone identifier={'course curriculum'}></Dropzone>
							<Dropzone identifier={'degree audit'}></Dropzone>
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}
