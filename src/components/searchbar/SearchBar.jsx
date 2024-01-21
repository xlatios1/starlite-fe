import { useState, useRef, useEffect } from 'react'
import { SearchBarComponent } from './searchbarcomponents/SearchBarComponent'
import { SearchResultList } from './searchbarcomponents/SearchResultList'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import apiRequest from '@components/apihandler/apiRequest'

import './searchbar.css'
import './searchbarcomponents/searchbarcomponent.css'

export default function SearchBar({ handleSearch, fetchData }) {
	const [results, setResults] = useState([])
	const [input, setInput] = useState('')
	const [hint, setHint] = useState([])
	const searchBoxRef = useRef(null)
	const [isFocused, setIsFocused] = useState(false)
	const [shouldHandleBlur, setShouldHandleBlur] = useState(true)
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

	useEffect(() => {
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
				setHint((prev) => response_data)
			}
		}, 2000)
	}, [input])

	useEffect(() => {
		// Use the ref to get input position and dimensions
		const inputElement = searchBoxRef.current
		const searchBoxElement = searchResultRef.current

		if (inputElement && searchBoxElement) {
			// Calculate the position of the search box based on input
			const inputRect = inputElement.getBoundingClientRect()

			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')
			context.font = `${16}px Arial, Helvetica, sans-serif`
			const textWidth = context.measureText(input).width
			searchBoxElement.style.left = `${Math.min(
				textWidth,
				1000 - searchBoxElement.getBoundingClientRect().width
			)}px`
		}
	}, [isFocused, input])

	return (
		<div className="search-bar-container">
			<SearchBarComponent
				handleSearch={handleSearch}
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
			<div className="search-valid">
				Valid course codes:
				{hint.map((c) => {
					return ' ' + c.toUpperCase()
				})}
			</div>
		</div>
	)
}
