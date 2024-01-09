import React from 'react'
import '@styles/scrollbutton.css'

export default function Scrollbutton() {
	const scrollFn = () => {
		window.scrollTo({
			left: 0,
			top: 400,
			behavior: 'smooth',
		})
	}

	return <button className="gg-arrow-up-o" onClick={scrollFn}></button>
}
