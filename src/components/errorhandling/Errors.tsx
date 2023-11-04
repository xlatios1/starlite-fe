import '@styles/error.css'
import React from 'react'

type renderAccountError = {
	errorMessages: string[]
	name: string
}

export default function RenderAccountError({
	errorMessages,
	name,
}: renderAccountError) {
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
