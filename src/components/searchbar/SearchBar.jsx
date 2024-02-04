import { useState, useRef, useEffect } from 'react'
import { SearchBarComponent } from './searchbarcomponents/SearchBarComponent'
import { SearchResultList } from './searchbarcomponents/SearchResultList'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import Notification from '@components/notification/notification.tsx'
import {
	GenerateCommonInfo,
	GenerateCommonTimetable,
} from '@utils/generatecommoninfo.ts'

import './searchbar.css'
import './searchbarcomponents/searchbarcomponent.css'

export default function SearchBar({
	handleSearch,
	setIsLoading,
	toggleCourseList,
	setToggleCourseList,
	searchValidRef,
	setTimetablePreview,
}) {
	const [results, setResults] = useState([])
	const [input, setInput] = useState('')
	const [hint, setHint] = useState([])
	const searchBoxRef = useRef(null)
	const [isFocused, setIsFocused] = useState(false)
	const [shouldHandleBlur, setShouldHandleBlur] = useState(false)
	const searchResultRef = useRef(null)
	const [isConflict, setIsConflict] = useState(false)

	const handleSelect = (value) => {
		const words = input.trim().split(' ')
		words[words.length - 1] = value
		const modifiedSentence = words.join(' ') + ' '

		setInput(modifiedSentence)
		setResults([])
		FocusTextBox({ ref: searchBoxRef })
	}

	const handleInput = (value = '') => {
		const words = value.split(' ')
		setInput(value)
		if (words[words.length - 1] !== '') {
			fetchData(words[words.length - 1]).then((data) => setResults(data))
		}
	}

	const fetchData = async (value) => {
		return await fetch(`${process.env.REACT_APP_COURSE_CODE_API}${value}`)
			.then((response) => response.json())
			.then((json) => json.results)
			.then((results) => {
				return results.map((items) => ({
					code: items.code,
					name: items.name,
				}))
			})
	}

	const handleOnSearchValid = () => {
		setIsLoading(true)
		setInput('')
		setResults([])
		setTimeout(async () => {
			const results = await GenerateCommonInfo(hint, input)
			if (results && results.length > 0) {
				const newHint = [...hint, ...results]
				const { timetable, gotConflict } = await GenerateCommonTimetable(
					newHint
				)
				setTimetablePreview(timetable)
				setIsConflict(gotConflict)
				setHint(newHint)
			}
			setIsLoading(false)
		}, 1000)
	}

	const handleOnDelete = async (code) => {
		const prevHints = [...hint].filter(
			(value) => Object.keys(value)[0] !== code
		)
		const { timetable, gotConflict } = await GenerateCommonTimetable(prevHints)
		setTimetablePreview(timetable)
		setIsConflict(gotConflict)
		setHint(prevHints)
	}

	const handleFetchTimetable = () => {
		if (!isConflict) {
			setInput('')
			handleSearch(hint.map((c) => Object.keys(c)[0]))
		} else {
			const errorMessage =
				'Error! Please resolve course conflict before search!'
			Notification('error', errorMessage, 2000)
		}
	}

	//handle adaptive movement result list
	// useEffect(() => {
	// 	// Use the ref to get input position and dimensions
	// 	const inputElement = searchBoxRef.current
	// 	const searchBoxElement = searchResultRef.current

	// 	if (inputElement && searchBoxElement) {
	// 		// Calculate the position of the search box based on input
	// 		const inputRect = inputElement.getBoundingClientRect()

	// 		const canvas = document.createElement('canvas')
	// 		const context = canvas.getContext('2d')
	// 		context.font = `${16}px Arial, Helvetica, sans-serif`
	// 		const textWidth = context.measureText(input).width
	// 		searchBoxElement.style.left = `${Math.min(
	// 			textWidth,
	// 			1000 - searchBoxElement.getBoundingClientRect().width
	// 		)}px`
	// 	}
	// }, [isFocused, input])

	return (
		<div className="search-bar-container">
			<SearchBarComponent
				handleOnSearchValid={handleOnSearchValid}
				handleInput={handleInput}
				input={input}
				searchBoxRef={searchBoxRef}
				setIsFocused={setIsFocused}
				shouldHandleBlur={shouldHandleBlur}
			/>
			{isFocused && (
				<div className="search-bar-wrapper" ref={searchResultRef}>
					<SearchResultList
						results={results}
						handleSelect={handleSelect}
						setShouldHandleBlur={setShouldHandleBlur}
					/>
				</div>
			)}
			{!!hint.length ? (
				<div className="search-valid-wrapper">
					<div
						className={`search-valid-container ${
							toggleCourseList ? '' : 'hidden'
						}`}
						ref={searchValidRef}
					>
						{hint.map((c, i) => {
							const course_code = Object.keys(c)[0]
							return (
								<div className="valid-course-container" key={i}>
									<ol className="valid-course-name">
										{c[course_code].initialism +
											course_code +
											': ' +
											c[course_code].name}
									</ol>
									<a
										style={{ cursor: 'pointer' }}
										className="remove-course-name"
										onClick={() => handleOnDelete(course_code)}
									>
										x
									</a>
								</div>
							)
						})}
						<button
							className="fetch-btn"
							role="button"
							onClick={handleFetchTimetable}
						>
							<span className="text">Search</span>
						</button>
						<span
							className={`fa fa-angle-${toggleCourseList ? 'up' : 'down'}`}
							onClick={() => {
								setToggleCourseList((prev) => !prev)
							}}
							style={{}}
						></span>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	)
}
