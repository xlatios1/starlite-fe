import { useState, useRef, useEffect } from 'react'
import { SearchBarComponent } from './searchbarcomponents/SearchBarComponent'
import { SearchResultList } from './searchbarcomponents/SearchResultList'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import {
	FetchCourseDetails,
	generateCommonInfomationDetails,
	GenerateTimetableFormat,
} from '@utils/generatecommoninfo.ts'
import IconButton from '@mui/material/IconButton'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { convertExamSchedule } from '@utils/parsers.ts'
import './searchbar.css'
import './searchbarcomponents/searchbarcomponent.css'

import { useDispatch, useSelector } from 'react-redux'
import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'
import {
	useLazyFindCourseContainQuery,
	useLazyGetCourseDetailsQuery,
} from '@store/timetable/timetableApi.ts'
import { setWalkthough } from '@store/walkthrough/walkthroughSlice.ts'
import {
	removeCourse,
	reorderCourses,
} from '@store/timetable/timetableSlice.ts'

export default function SearchBar({
	handleSearch,
	toggleCourseList,
	setToggleCourseList,
	searchValidRef,
	setTimetablePreview,
	walkthrough,
}) {
	const [suggestions, setSuggestions] = useState([])
	const [input, setInput] = useState('')
	const searchBoxRef = useRef(null)
	const [isFocused, setIsFocused] = useState(false)
	const [shouldHandleBlur, setShouldHandleBlur] = useState(true)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [draggedItem, setDraggedItem] = useState(null)

	const dispatch = useDispatch()
	const courses = useSelector((state) => state.timetable.courses)
	const [findCourse] = useLazyFindCourseContainQuery()
	const [getCourseDetails] = useLazyGetCourseDetailsQuery()

	const handleSelect = (value) => {
		const words = input.trim().split(' ')
		words[words.length - 1] = value
		const modifiedSentence = words.join(' ') + ' '

		setInput(modifiedSentence)
		setSuggestions([])
		setSelectedIndex(-1)
		FocusTextBox({ ref: searchBoxRef })
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
		} else {
			setSuggestions([])
		}
	}

	useEffect(() => {
		const customCourses = generateCommonInfomationDetails(courses)
		setTimetablePreview(GenerateTimetableFormat(customCourses).timetable)
	}, [courses])

	const handleOnSearchValid = () => {
		dispatch(openLoading())
		setInput('')
		setSuggestions([])
		setTimeout(async () => {
			await FetchCourseDetails(input, courses, dispatch, getCourseDetails)
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

	const handleDragStart = (e, course_code) => {
		setDraggedItem(course_code)
	}

	const handleDragOver = (e) => {
		e.preventDefault()
	}

	const handleDrop = (e, droppedCourse) => {
		const updatedCourseList = [...courses]
		const draggedCourseIndex = updatedCourseList.findIndex(
			(course) => course === draggedItem
		)
		const droppedCourseIndex = updatedCourseList.findIndex(
			(course) => course === droppedCourse
		)
		updatedCourseList.splice(draggedCourseIndex, 1)
		updatedCourseList.splice(droppedCourseIndex, 0, draggedItem)
		dispatch(reorderCourses(updatedCourseList))
		setDraggedItem(null)
	}

	const handleDragEnd = () => {
		setDraggedItem(null)
	}

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
				handleOnSearchValid()
				searchBoxRef.current.blur()
			}
		} else if (event.key === 'Escape') {
			setSelectedIndex(-1)
		}
	}

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
				<div className="search-bar-wrapper">
					<SearchResultList
						suggestions={suggestions}
						handleSelect={handleSelect}
						setShouldHandleBlur={setShouldHandleBlur}
						selectedIndex={selectedIndex}
					/>
				</div>
			)}
			{!!courses.length ? (
				<div className="search-valid-wrapper">
					<div
						className={`search-valid-container ${
							toggleCourseList ? '' : 'hidden'
						}`}
						ref={searchValidRef}
					>
						<p className="search-valid-helper">
							<i
								className="fa fa-info-circle"
								style={{ color: 'lightblue', margin: '0 5px' }}
							></i>
							Course priority based on top to bottom.
						</p>
						{courses.map((c, i) => {
							const course_code = Object.keys(c)[0]
							return (
								<li
									draggable
									className={`valid-course-container ${
										draggedItem === c ? 'dragging' : ''
									}`}
									key={i}
									onDragStart={(e) => handleDragStart(e, c)}
									onDragOver={(e) => handleDragOver(e)}
									onDrop={(e) => handleDrop(e, c)}
									onDragEnd={handleDragEnd}
								>
									<div className="details">
										<div className="draggable-container">
											<div className="uil--draggabledots"></div>
										</div>
										<ol className="valid-course-name">
											{c[course_code].initialism +
												course_code +
												': ' +
												c[course_code].name}
											<br />
											<p
												style={{
													width: '100%',
													fontSize: '10px',
												}}
											>
												{convertExamSchedule([c])}
											</p>
										</ol>
										<div className="remove-course-name">
											<IconButton
												onClick={() => dispatch(removeCourse(course_code))}
												sx={{
													height: '40px',
													width: '40px',
													color: 'black',
												}}
											>
												<DeleteOutlinedIcon />
											</IconButton>
										</div>
									</div>
								</li>
							)
						})}
						<button className="fetch-btn" onClick={() => handleSearch(courses)}>
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
			) : (
				<></>
			)}
		</div>
	)
}
