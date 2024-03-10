import { IconButton } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { removeCourse, setCourse } from '@store/course/courseSlice.ts'
import { convertExamSchedule } from '@components/timetable/utils/timetableUtils.ts'
import React, { useState } from 'react'

export default function SearchCourseList({ courses, setOrdered, dispatch }) {
	const [draggedItem, setDraggedItem] = useState(null)

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
		dispatch(setCourse(updatedCourseList))
		setOrdered((prev) => {
			const previous = { ...prev }
			previous.bestChance = false
			return previous
		})
		setDraggedItem(null)
	}

	const handleDragEnd = () => {
		setDraggedItem(null)
	}

	return (
		<>
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
								<hr style={{ width: '100%', border: '0.5px solid black' }} />
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
		</>
	)
}
