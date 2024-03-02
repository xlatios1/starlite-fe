import './error.css'
import React from 'react'

type RenderAccountError = {
	errorMessages: string[]
	name: string
}

export default function RenderAccountError({
	errorMessages,
	name,
}: RenderAccountError) {
	const errors = (name: string) => {
		return {
			loginEmail: 'email not found',
			loginPassword: 'invalid password',
			registerEmail: 'email cannot be blank',
			registerPassword: 'password invalid',
			differentPassword: 'different password',
		}[name]
	}

	if (errorMessages.includes(name)) {
		return <div className="error">{errors(name)}</div>
	}
}
