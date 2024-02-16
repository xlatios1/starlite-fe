import React, { useEffect, useRef } from 'react'
import 'toolcool-range-slider'

import '../preferencelists.css'
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'toolcool-range-slider': any
		}
	}
}

export default function NCourseFilter({
	nCourseFilter,
	handlePreference,
	handleReset,
	courses,
}) {
	const nfcRef = useRef(null)

	useEffect(() => {
		const slider = nfcRef.current
		let value = 0
		const onChange = (e) => {
			value = e.detail.value
		}
		const blurIt = () => {
			if (nfcRef.current) {
				nfcRef.current.blur()
			}
			handlePreference('nCourseFilter', Math.round(value))
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
			<div className="preference-option-title-container">
				<p className="preference-option-title">N-Course Filter</p>
				<span
					className="clear-filter-btn"
					onClick={() => handleReset('nCourseFilter')}
				>
					Reset filter
				</span>
			</div>
			<div className="preference-option-ncoursefilter">
				<p className="preference-option-ncoursefilter lower">0</p>
				<toolcool-range-slider
					min="0"
					max={`${courses.length}`}
					value={nCourseFilter}
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
