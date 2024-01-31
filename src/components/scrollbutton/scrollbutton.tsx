import React from 'react'
import '@styles/scrollbutton.css'

export default function ScrollButton() {
	const scrollFn = () => {
		window.scrollTo({
			left: 0,
			top: 250,
			behavior: 'smooth',
		})
	}

	return <button className="gg-arrow-up-o" onClick={scrollFn}></button>
}
