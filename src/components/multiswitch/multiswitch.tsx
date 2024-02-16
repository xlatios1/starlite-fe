import React from 'react'
import '@styles/multiswitch.css'

type MultiSwitch = {
	handleMultiSwitch: (text: string, option: string) => void
	text: string
	options: string[]
	check: string
}

export default function MultiSwitch({
	handleMultiSwitch,
	text,
	options,
	check,
}: MultiSwitch) {
	return (
		<div className="multi-switch-options" key={text}>
			<div className="multi-switch-option" key={text}>
				{text}
			</div>
			<div className="slide-container">
				{options.map((option, i) => {
					return (
						<React.Fragment key={text + option}>
							<input
								type="radio"
								id={String(i)}
								name={text}
								key={text + option + i}
								checked={check === option}
								onChange={() => {}}
							/>
							<label
								onClick={() => {
									handleMultiSwitch(text, option)
								}}
							>
								{option}
							</label>
						</React.Fragment>
					)
				})}
				<a className="slide" aria-hidden="true"></a>
			</div>
		</div>
	)
}
