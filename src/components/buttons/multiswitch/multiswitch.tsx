import React from 'react'
import './multiswitch.css'
import { RootState } from '@store/store'
import { useSelector } from 'react-redux'

type MultiSwitchProp = {
	handleMultiSwitch: (text: string, option: string) => void
	text: string
	options: string[]
	check: string
	disabled: boolean
}

export default function MultiSwitch({
	handleMultiSwitch,
	text,
	options,
	check,
	disabled,
}: MultiSwitchProp) {
	const walkthrough = useSelector(
		(state: RootState) => state.walkthrough.walkthrough
	)

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
								className={`${disabled ? ' disabled' : ''}`}
								onClick={() => {
									handleMultiSwitch(text, option)
								}}
								style={{ zIndex: walkthrough > 0 ? '0' : '2' }}
							>
								{option}
							</label>
						</React.Fragment>
					)
				})}
				<div
					className={`slide${disabled ? ' disabled' : ''}`}
					aria-hidden="true"
				></div>
			</div>
		</div>
	)
}
