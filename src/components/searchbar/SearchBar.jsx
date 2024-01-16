import { useState, useRef, useEffect } from 'react'
import { SearchBarComponent } from './searchbarcomponents/SearchBarComponent'
import { SearchResultList } from './searchbarcomponents/SearchResultList'
import FocusTextBox from '@components/errorhandling/Focus.tsx'

import './searchbar.css'
import './searchbarcomponents/searchbarcomponent.css'

export default function SearchBar({ handleSearch }) {
	const [results, setResults] = useState([])
	const [input, setInput] = useState('')
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
			fetchData(words[words.length - 1])
		}
	}

	const fetchData = (value) => {
		// TODO: return bigram word from value
		fetch(
			`https://backend.ntusu.org/modsoptimizer/course_code/?search__icontains=${value}`
		)
			.then((response) => response.json())
			.then((json) => json.results)
			.then((results) =>
				setResults((prev) =>
					results.map((items) => ({ code: items.code, name: items.name }))
				)
			)
	}

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
		</div>
	)
}
