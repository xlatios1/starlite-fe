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
	const [shouldHandleBlur, setShouldHandleBlur] = useState(false)
	const searchResultRef = useRef(null)

	const handleSelect = (value) => {
		const words = input.trim().split(' ')
		words[words.length - 1] = value
		const modifiedSentence = words.join(' ') + ' '

		setInput(modifiedSentence)
		fetchData(value)
		FocusTextBox({ ref: searchBoxRef })
	}

	const handleInput = (value = '') => {
		const words = value.trim().split(' ')
		setInput(value)
		fetchData(words[words.length - 1])
	}

	const fetchData = (value) => {
		// TODO: return bigram word from value
		fetch('https://jsonplaceholder.typicode.com/users')
			.then((response) => response.json())
			.then((json) => {
				const results = json.filter((user) => {
					return (
						value &&
						user &&
						user.name &&
						user.name.toLowerCase().includes(value.toLowerCase())
					)
				})
				setResults(results)
			})
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
				inputRect.left + textWidth,
				inputRect.right - searchBoxElement.getBoundingClientRect().width
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
