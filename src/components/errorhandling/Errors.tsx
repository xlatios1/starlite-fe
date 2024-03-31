import './error.css'
import React from 'react'

type RenderAccountErrorProp = {
	errorMessages: string[]
	name: string
}

export default function RenderAccountError({
	errorMessages,
	name,
}: RenderAccountErrorProp) {
	const errors = (name: string) => {
		return {
			loginEmail: 'email not valid',
			loginPassword: 'password not valid',
			registerName: 'name cannot be blank',
			registerEmail: 'email cannot be blank',
			registerPassword: 'password invalid',
			differentPassword: 'different password',
		}[name]
	}

	if (errorMessages.includes(name)) {
		return <div className="error">{errors(name)}</div>
	}
}
