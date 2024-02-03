import { useState, useRef, useEffect } from 'react'
import { SearchBarComponent } from './searchbarcomponents/SearchBarComponent'
import { SearchResultList } from './searchbarcomponents/SearchResultList'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import { GenerateCommonInfo } from '@utils/generatecommoninfo.ts'
// import GenerateCommonInfo from '@utils/generatecommoninfo.ts'

import './searchbar.css'
import './searchbarcomponents/searchbarcomponent.css'

export default function SearchBar({
	handleSearch,
	fetchData,
	setIsLoading,
	toggleCourseList,
	setToggleCourseList,
	searchValidRef,
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
			const results = await GenerateCommonInfo(hint, input)
			console.log('results', results)
			if (results && results.length > 0) {
				setHint((prev) => {
					return [...prev, ...results]
				})
			}
			setInput('')
			setIsLoading(false)
		}, 2000)
	}

	const handleFetchTimetable = () => {
		handleSearch(hint.map((c) => Object.keys(c)[0]))
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
			return prevHints.filter((value) => Object.keys(value)[0] !== code)
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
						ref={searchValidRef}
					>
						{hint.map((c, i) => {
							const course_code = Object.keys(c)[0]
							return (
								<div className="valid-course-container" key={i}>
									<ol className="valid-course-name">
										{course_code +
											c[course_code].initialism +
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
