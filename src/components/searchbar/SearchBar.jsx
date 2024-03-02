import { useState, useRef } from 'react'
import { SearchBarComponent } from './searchbarcomponents/SearchBarComponent'
import { SearchResultList } from './searchbarcomponents/SearchResultList'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import Notification from '@components/notification/notification.tsx'
import {
	FetchCourseDetails,
	generateCommonInfomationDetails,
	GenerateTimetableFormat,
} from '@utils/generatecommoninfo.ts'
import IconButton from '@mui/material/IconButton'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

import './searchbar.css'
import './searchbarcomponents/searchbarcomponent.css'

import { loadingActions } from '@store/loading/loadingSlice.ts'
import { useDispatch } from 'react-redux'

export default function SearchBar({
	handleSearch,
	toggleCourseList,
	setToggleCourseList,
	searchValidRef,
	setTimetablePreview,
	isWalkThrough,
	setisWalkThrough,
}) {
	const [results, setResults] = useState([])
	const [input, setInput] = useState('')
	const [courses, setCourses] = useState([])
	const searchBoxRef = useRef(null)
	const [isFocused, setIsFocused] = useState(false)
	const [shouldHandleBlur, setShouldHandleBlur] = useState(true)
	const searchResultRef = useRef(null)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [draggedItem, setDraggedItem] = useState(null)

	const dispatch = useDispatch()
	const { openLoading, closeLoading } = loadingActions

	const handleSelect = (value) => {
		const words = input.trim().split(' ')
		words[words.length - 1] = value
		const modifiedSentence = words.join(' ') + ' '

		setInput(modifiedSentence)
		setResults([])
		setSelectedIndex(-1)
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
		dispatch(openLoading())
		setInput('')
		setResults([])
		setTimeout(async () => {
			const results = await FetchCourseDetails(courses, input)
			if (results && results.length > 0) {
				const newCourses = [...courses, ...results]
				const customCourses = generateCommonInfomationDetails(newCourses)
				setTimetablePreview(GenerateTimetableFormat(customCourses).timetable)
				setCourses(newCourses)
				Notification(
					'success',
					`Successfully mapped course: ${results
						.map((c) => Object.keys(c)[0])
						.join(', ')}`,
					1000
				)
				if (isWalkThrough) {
					setisWalkThrough(2)
				}
			} else {
				Notification('info', 'No unique valid course found!', 1000)
			}
			dispatch(closeLoading())
		}, 1000)
	}

	const handleOnDelete = async (code) => {
		const prevCourses = [...courses].filter(
			(value) => Object.keys(value)[0] !== code
		)
		const customCourses = generateCommonInfomationDetails(prevCourses)
		setTimetablePreview(GenerateTimetableFormat(customCourses).timetable)
		setCourses(prevCourses)
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
		setCourses(updatedCourseList)
		setDraggedItem(null)
	}

	const handleDragEnd = () => {
		setDraggedItem(null)
	}

	const handleKeyDown = (event) => {
		if (event.key === 'ArrowDown') {
			setSelectedIndex((prevIndex) =>
				Math.min(prevIndex + 1, results.length - 1)
			)
		} else if (event.key === 'ArrowUp') {
			setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0))
		} else if (event.key === 'Enter') {
			if (selectedIndex !== -1) {
				handleSelect(results[selectedIndex].code)
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
			{isFocused && (
				<div className="search-bar-wrapper" ref={searchResultRef}>
					<SearchResultList
						results={results}
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
										</ol>
										<div className="remove-course-name">
											<IconButton
												onClick={() => handleOnDelete(course_code)}
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
						<button
							className="fetch-btn"
							role="button"
							onClick={() => handleSearch(courses)}
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
			) : (
				<></>
			)}
		</div>
	)
}
