import React from 'react'
import './scrollbutton.css'


export default function ScrollButton({ display }) {
	const scrollFn = () => {
		window.scrollTo({
			left: 0,
			top: 40,
			behavior: 'smooth',
		})
	}
	if (display) {
		return <button className="gg-arrow-up-o" onClick={scrollFn}></button>
	}
}
