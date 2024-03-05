import React, { useEffect, useRef } from 'react'
import 'toolcool-range-slider'
import '../preferencelists.css'
import {
	ToolTip,
	tooltipHelperText,
} from '@components/preference/preferenceUtils.tsx'

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'toolcool-range-slider': any
		}
	}
}

export default function MinCourseFilter({
	minCourseFilter,
	dispatchPreference,
	handleReset,
	courses,
}) {
	const nfcRef = useRef(null)

	useEffect(() => {
		const slider = nfcRef.current
		let value = minCourseFilter
		const onChange = (e) => {
			value = e.detail.value
		}
		const blurIt = () => {
			if (nfcRef.current) {
				nfcRef.current.blur()
			}
			dispatchPreference({ type: 'minCourseFilter', value: Math.round(value) })
		}
		slider?.addEventListener('change', onChange)
		document.addEventListener('mouseup', blurIt)
		return () => {
			slider?.removeEventListener('change', onChange)
			document.removeEventListener('mouseup', blurIt)
		}
	}, [courses])

	return (
		<div className="preference-options mincoursefilter">
			<div className="preference-option-title-container">
				<div className="preference-option-title">
					Minimum Course Shown
					<ToolTip text={tooltipHelperText.minCourseFilter} />
				</div>
				<span
					className="clear-filter-btn"
					onClick={() => handleReset('minCourseFilter')}
				>
					Reset filter
				</span>
			</div>
			<div className="preference-option-mincoursefilter">
				<p className="preference-option-mincoursefilter lower">1</p>
				<toolcool-range-slider
					min="1"
					max={`${courses.length}`}
					value={minCourseFilter}
					step="1"
					theme="circle"
					slider-width="160px"
					ref={nfcRef}
					generate-labels="true"
					style={{ margin: '0 10px' }}
					disabled={minCourseFilter < 2}
				></toolcool-range-slider>
				<p className="preference-option-mincoursefilter upper">
					{courses.length}
				</p>
			</div>
		</div>
	)
}
