import { useState, useRef, useEffect } from 'react'
import { SearchBarComponent } from './searchbarcomponents/SearchBarComponent.jsx'
import { SearchResultList } from './searchbarcomponents/SearchResultList.jsx'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import SavedPlan from './searchbarcomponents/SavedPlan.tsx'
import { FetchCourseDetails } from '@components/searchbar/SearchBar.actions.ts'
import './searchbar.css'
import './searchbarcomponents/searchbarcomponent.css'
import { useDispatch } from 'react-redux'
import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'
import {
	useLazyFindCourseContainQuery,
	useLazyGetCourseDetailsQuery,
} from '@store/course/courseApi.ts'
import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'
import { setCourse } from '@store/course/courseSlice.ts'
import SearchCourseList from '@components/searchbar/SearchCourseList.tsx'
import React from 'react'

export default function SearchBar({
	courseData,
	handleSearch,
	searchValidRef,
	walkthrough,
	setTimetablePreview,
}) {
	const [suggestions, setSuggestions] = useState([])
	const [input, setInput] = useState('')
	const [ordered, setOrdered] = useState({
		bestChance: false,
		noExams: 0,
	})
	const searchBoxRef = useRef(null)
	const [toggleCourseList, setToggleCourseList] = useState(true)
	const [isFocused, setIsFocused] = useState(false)
	const [shouldHandleBlur, setShouldHandleBlur] = useState(true)
	const [selectedIndex, setSelectedIndex] = useState(-1)

	const dispatch = useDispatch()
	const [findCourse] = useLazyFindCourseContainQuery()
	const [getCourseDetails] = useLazyGetCourseDetailsQuery()

	const handleSelect = (value) => {
		// const words = input.trim().split(' ')
		// words[words.length - 1] = value
		// const modifiedSentence = words.join(' ') + ' '

		// setInput(modifiedSentence)
		// setSuggestions([])
		// setSelectedIndex(-1)
		// FocusTextBox({ ref: searchBoxRef })
		setIsFocused(false)
		handleOnSearchValidCourses(value)
	}

	const handleInput = async (value = '') => {
		setInput(value)
		const words = value.split(' ')
		if (words[words.length - 1] !== '') {
			await findCourse(words[words.length - 1])
				.unwrap()
				.then((data) => {
					return data.results.map((course) => ({
						code: course.code,
						name: course.name,
					}))
				})
				.then((data) => setSuggestions(data))
				.catch((error) => console.log(error))
		} else {
			setSuggestions([])
		}
	}

	const handleOnSearchValidCourses = (value?: string) => {
		dispatch(openLoading())
		setInput('')
		setSuggestions([])
		searchBoxRef.current.blur()
		setTimeout(async () => {
			await FetchCourseDetails(
				value || input,
				courseData,
				dispatch,
				getCourseDetails
			)
			if (walkthrough) {
				dispatch(setWalkthough(2))
			}
			dispatch(closeLoading())
		}, 1000)
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

	const handleKeyDown = (event) => {
		if (event.key === 'ArrowDown') {
			setSelectedIndex((prevIndex) =>
				Math.min(prevIndex + 1, suggestions.length - 1)
			)
		} else if (event.key === 'ArrowUp') {
			setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, -1))
		} else if (event.key === 'Enter') {
			if (selectedIndex !== -1) {
				handleSelect(suggestions[selectedIndex].code)
			} else {
				handleOnSearchValidCourses()
			}
		} else if (event.key === 'Escape') {
			setSelectedIndex(-1)
			searchBoxRef.current.blur()
		}
	}

	useEffect(() => {
		if (!isFocused) {
			setSelectedIndex(-1)
		}
	}, [isFocused])

	useEffect(() => {
		if (ordered.bestChance) {
			const sortedCourse = [...courseData.courses].sort((a, b) => {
				return (
					a[Object.keys(a)[0]].indexes.length -
					b[Object.keys(b)[0]].indexes.length
				)
			})
			console.log('sortedCourse', sortedCourse)
			dispatch(setCourse(sortedCourse))
		}
	}, [ordered])

	return (
		<div className="search-bar-container" onKeyDown={handleKeyDown}>
			<SearchBarComponent
				handleInput={handleInput}
				input={input}
				searchBoxRef={searchBoxRef}
				setIsFocused={setIsFocused}
				shouldHandleBlur={shouldHandleBlur}
			/>
			{isFocused && input.split('')[input.split('').length - 1] !== ' ' && (
				<SearchResultList
					suggestions={suggestions}
					handleSelect={handleSelect}
					setShouldHandleBlur={setShouldHandleBlur}
					selectedIndex={selectedIndex}
				/>
			)}
			<div className="search-valid-wrapper">
				<div
					className={`search-valid-container ${
						toggleCourseList ? '' : 'hidden'
					}`}
					ref={searchValidRef}
				>
					<SavedPlan
						courses={courseData.courses}
						setOrdered={setOrdered}
						setTimetablePreview={setTimetablePreview}
					/>
					{courseData.courses.length > 0 && (
						<>
							<div className="search-bottom-wrappper">
								<div className="search-bottom-checkbox">
									<input
										type="checkbox"
										id={'sort'}
										onChange={() =>
											setOrdered((prev) => {
												const previous = { ...prev }
												previous.bestChance = !previous.bestChance
												return previous
											})
										}
										checked={ordered.bestChance}
									/>
									<label id={'sort'} htmlFor={'sort'}>
										Recommended Sort
									</label>
								</div>
							</div>
							<p className="search-valid-helper">
								<i
									className="fa fa-info-circle"
									style={{ color: 'lightblue', margin: '0 5px' }}
								></i>
								Matching order from top to bottom.
							</p>
						</>
					)}
					<SearchCourseList
						courses={courseData.courses}
						setOrdered={setOrdered}
						dispatch={dispatch}
					/>
					<button
						className="fetch-btn"
						onClick={() => handleSearch(courseData.courses)}
					>
						<span className="text">Search</span>
					</button>
					<span
						className={`fa fa-angle-${toggleCourseList ? 'up' : 'down'}`}
						onClick={() => {
							setToggleCourseList((prev) => !prev)
						}}
					></span>
				</div>
			</div>
		</div>
	)
}
