import { useState, useRef, useEffect } from 'react'
import { SearchBarComponent } from './searchbarcomponents/SearchBarComponent'
import { SearchResultList } from './searchbarcomponents/SearchResultList'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import apiRequest from '@components/apihandler/apiRequest'

import './searchbar.css'
import './searchbarcomponents/searchbarcomponent.css'

export default function SearchBar({
	handleSearch,
	fetchData,
	setIsLoading,
	toggleCourseList,
	setToggleCourseList,
	setTransformYValue,
}) {
	const [results, setResults] = useState([])
	const [input, setInput] = useState('')
	const [hint, setHint] = useState([])
	const searchBoxRef = useRef(null)
	const [isFocused, setIsFocused] = useState(false)
	const [shouldHandleBlur, setShouldHandleBlur] = useState(false)
	const searchResultRef = useRef(null)

	const handleSelect = (value) => {
		const words = input.trim().split(' ')
		words[words.length - 1] = value
		const modifiedSentence = words.join(' ') + ' '

		setInput(modifiedSentence)
		setResults((prev) => [])
		FocusTextBox({ ref: searchBoxRef })
	}

	const handleInput = (value = '') => {
		const words = value.split(' ')
		setInput(value)
		if (words[words.length - 1] !== '') {
			fetchData(words[words.length - 1]).then((data) =>
				setResults((prev) => data)
			)
		}
	}

	const handleSearchValid = () => {
		setIsLoading(true)
		setTimeout(async () => {
			const API_URL = 'http://localhost:5000/validate_courses'
			const bodyParam = {
				course_lists: input,
			}
			const [response_status, response_data] = await apiRequest(
				API_URL,
				bodyParam
			)
			if (response_status) {
				setHint((prev) => {
					let newArr = prev.concat(...response_data)
					let uniqueObjects = new Set(newArr.map((obj) => JSON.stringify(obj)))
					let uniqueArray = Array.from(uniqueObjects).map((objString) =>
						JSON.parse(objString)
					)
					return uniqueArray
				})
				// let querySelectorHint = document.querySelector('.search-valid-wrapper')
				// if (querySelectorHint) {
				// 	setTransformYValue(+querySelectorHint.clientHeight)
				// 	console.log(querySelectorHint.clientHeight)
				// 	querySelectorHint = null
				// }
			}
			setInput('')
			setIsLoading(false)
		}, 2000)
	}

	const handleFetchTimetable = () => {
		handleSearch(hint.map((i) => i.code))
		// setTransformYValue(
		// 	+document.querySelector('.search-valid-container').clientHeight
		// )
		// console.log(+document.querySelector('.search-valid-container').clientHeight)
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

	const handleOnDelete = (code) => {
		setHint((prev) => {
			const prevHints = prev
			return prevHints.filter((value) => value.code !== code)
		})
	}

	return (
		<div className="search-bar-container">
			<SearchBarComponent
				handleSearchValid={handleSearchValid}
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
					>
						{hint.map((c, i) => {
							return (
								<div className="valid-course-container">
									<ol className="valid-course-name">
										{' ' + c.code.toUpperCase() + ': ' + c.name}
									</ol>
									<a
										style={{ cursor: 'pointer' }}
										className="remove-course-name"
										onClick={() => handleOnDelete(c.code)}
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
							<span className="text">Fetch</span>
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
