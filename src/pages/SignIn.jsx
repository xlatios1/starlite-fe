import { useLayoutEffect, useState, useRef, useEffect } from 'react'

import Notification from '@components/notification/notification.tsx'
import RenderAccountError from '@components/errorhandling/Errors.tsx'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import { handleEmailChanges } from '@root/components/emailhandler/handleEmailChanges.tsx'
import { UserAuth } from '../authentications/AuthContext.js'
import { Link, useNavigate } from 'react-router-dom'

export default function Signin() {
	const uemail = useRef()
	const pass = useRef()
	const [login, setLogin] = useState({
		email: '@e.ntu.edu.sg',
		password: '',
	})
	const [errorMessages, setErrorMessages] = useState([])

	const { signIn, fetchUserInCache } = UserAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (fetchUserInCache()) {
			console.log('Active user cache present, directing...')
			navigate('/home')
		}
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		let errMsg = []
		if (login.email.length < 14) {
			// Email not found
			errMsg = [...errMsg, 'loginEmail']
			FocusTextBox({ ref: uemail })
		}
		if (!login.password) {
			errMsg = [...errMsg, 'loginPassword']
			FocusTextBox({ ref: pass })
		}
		setErrorMessages(Array.from(new Set(errMsg)))
		console.log(errMsg)
		if (errMsg.length === 0) {
			const isSignIn = await signIn(login.email, login.password)

			if (isSignIn === true) {
				Notification('success', 'Login successful!', 2000)
				navigate('/home')
			} else {
				Notification('error', isSignIn.message.split(': ')[1], 3000)
			}
		}
	}

	const handleChange = (e) => {
		let value = e.target.value
		if (e.target.name === 'email') {
			value = handleEmailChanges(value)
		}
		setLogin((prev) => ({
			...prev,
			[e.target.name]: value,
		}))
	}

	//runs synchronously before the repaint, eliminating the blink.
	useLayoutEffect(() => {
		uemail.current.setSelectionRange(
			login.email.length - 13,
			login.email.length - 13
		)
	}, [login.email])

	return (
		<div className="login-initializer">
			<form className="form">
				<h3>Sign in to your account</h3>
				<p>
					Don't have an account yet? <Link to="/register">Sign up.</Link>
				</p>
				<div className="form-control">
					<label htmlFor="email"> Email: </label>
					<input
						type="text"
						id="email"
						name="email"
						value={login.email}
						ref={uemail}
						onChange={handleChange}
					/>
				</div>
				{RenderAccountError({
					errorMessages: errorMessages,
					name: 'loginEmail',
				})}
				<div className="form-control">
					<label htmlFor="password"> Password: </label>
					<input
						type="password"
						id="password"
						name="password"
						value={login.password}
						ref={pass}
						onChange={handleChange}
					/>
				</div>
				{RenderAccountError({
					errorMessages: errorMessages,
					name: 'loginPassword',
				})}
				<div>
					<button type="submit" onClick={handleSubmit}>
						Login
					</button>
				</div>
			</form>
		</div>
	)
}
