import React, { useState, useEffect } from 'react'
import Checkbox from '@components/checkbox/checkbox.tsx'
import './filterbutton.css'

export default function FilterButton() {
	const [isFilterShown, setIsFilterShown] = useState(false)
	const [activeFilter, setActiveFilter] = useState('')
	const [filters, setFilters] = useState({
		'Free days': [],
		'Priority of Course': [],
		Timeslots: [],
		'No Final Exam': [],
	})

	const choices = [
		'Free days',
		'Priority of Course',
		'Timeslots',
		'No Final Exam',
	]

	const handleActiveFilter = (option) => {
		console.log(option)
		if (option === activeFilter) {
			setActiveFilter('')
		} else {
			setActiveFilter((prev) => option)
		}
	}

	const handleFilters = (filterType, option) => {
		setFilters((prevFilters) => {
			const updatedFilters = { ...prevFilters }
			const filterArray = updatedFilters[filterType]

			if (filterArray.includes(option)) {
				// Remove option if it's already in the array
				updatedFilters[filterType] = filterArray.filter(
					(item) => item !== option
				)
			} else {
				// Add option if it's not in the array
				updatedFilters[filterType] = [...filterArray, option]
			}
			return updatedFilters
		})
	}

	const renderFilterOptions = (options) => {
		return options.map((option: string) => (
			<>
				<div
					key={option}
					className={`filter-fields-option ${
						activeFilter === option ? 'active' : ''
					}`}
					onClick={() => handleActiveFilter(option)}
				>
					<a>{option}</a>
				</div>
			</>
		))
	}

	useEffect(() => {
		console.log(filters)
	}, [filters])

	return (
		<>
			<button
				className="filter-button"
				onClick={() => setIsFilterShown((prev) => !prev)}
			>
				<i className="fa fa-filter" style={{ marginRight: '3px' }}></i>
				Filter
			</button>
			{isFilterShown ? (
				<div className={'filter-fields-container'}>
					<div className={'filter-fields-options'}>
						{renderFilterOptions(choices)}
					</div>
					<div className="filter-fields-choices">
						{activeFilter === 'Free days' &&
							[
								'Monday',
								'Tuesday',
								'Wednesday',
								'Thursday',
								'Friday',
								'Saturday',
								'Sunday',
							].map((option) => {
								return (
									<Checkbox
										key={option}
										text={option}
										handleCheckbox={(e) =>
											handleFilters('Free days', e.target.id)
										}
									/>
								)
							})}
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	)

	// (
	// 	<>
	// 		<div
	// 			className={
	// 				isShown
	// 					? 'filter-fields-container active'
	// 					: 'filter-fields-container inactive'
	// 			}
	// 		>
	//
	// 		</div>
	// 		<div
	// 			className={`filter-fields-option-container ${
	// 				activeFilter ? `show ${activeFilter}` : 'hidden'
	// 			}`}
	// 		>
	// 			{activeFilter === 'Free days' &&
	// 				[
	// 					'Monday',
	// 					'Tuesday',
	// 					'Wednesday',
	// 					'Thursday',
	// 					'Friday',
	// 					'Saturday',
	// 					'Sunday',
	// 				].map((option) => {
	// 					return (
	// 						<Checkbox
	// 							key={option}
	// 							text={option}
	// 							handleCheckbox={(e) => handleFilters('Free days', e.target.id)}
	// 						/>
	// 					)
	// 				})}
	// 			{}
	// 		</div>
	// 	</>
	// )
}
