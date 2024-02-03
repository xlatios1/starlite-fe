import React, { useState, useEffect, useRef } from 'react'
import 'toolcool-range-slider'

import '../preferencelists.css'
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'toolcool-range-slider': any
		}
	}
}

export default function NCourseFilter({ handlePreference, courses }) {
	const [ncourse, setNCourse] = useState(0)
	const nfcRef = useRef(null)

	useEffect(() => {
		const slider = nfcRef.current
		handlePreference('N Course Filter', ncourse)

		const onChange = (e) => {
			const value = e.detail.value
			setNCourse((prev) => {
				handlePreference('N Course Filter', value)
				return value
			})
		}
		const blurIt = () => {
			if (nfcRef.current) {
				nfcRef.current.blur()
			}
		}
		slider?.addEventListener('change', onChange)
		document.addEventListener('mouseup', blurIt)
		return () => {
			slider?.removeEventListener('change', onChange)
			document.removeEventListener('mouseup', blurIt)
		}
	}, [courses])

	return (
		<div className="preference-options ncoursefilter">
			<p className="preference-option-title">N-Course Filter</p>
			<div className="preference-option-ncoursefilter">
				<p className="preference-option-ncoursefilter lower">0</p>
				<toolcool-range-slider
					min="0"
					max={`${courses.length}`}
					value={ncourse}
					step="1"
					theme="circle"
					slider-width="160px"
					ref={nfcRef}
				></toolcool-range-slider>
				<p className="preference-option-ncoursefilter upper">
					{courses.length}
				</p>
			</div>
		</div>
	)
}
