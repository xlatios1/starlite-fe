import { useLayoutEffect, useState, useRef, useEffect } from 'react'

import Notification from '@components/notification/notification.tsx'
import RenderAccountError from '@components/errorhandling/Errors.tsx'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import { handleEmailChanges } from '@components/formcontrol/emailhandler/handleEmailChanges.tsx'
import { UserAuth } from '@authentications/AuthContext.js'
import { Link, useNavigate } from 'react-router-dom'
import React from 'react'

export default function Signin() {
	const uemail = useRef(null)
	const pass = useRef(null)
	const [login, setLogin] = useState({
		email: '@e.ntu.edu.sg',
		password: '',
	})
	const [errorMessages, setErrorMessages] = useState([])
	const { signIn, fetchUserInCache } = UserAuth()
	const navigate = useNavigate()
	const curUser = fetchUserInCache()

	useEffect(() => {
		if (curUser?.expirationTime > new Date().getTime()) {
			console.log('Active user cache present, directing...', curUser)
			navigate('/home')
		}
	}, [curUser, navigate])

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
		if (errMsg.length === 0) {
			const isSignIn = await signIn(login.email, login.password)
			switch (isSignIn.status) {
				case 200:
					Notification('success', 'Login successful!', 1000)
					navigate('/home')
					break
				case 401:
					navigate('/verify')
					break
				case 500:
					Notification('error', isSignIn.message, 3000)
					break
			}
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value
		if (e.target.name === 'email') {
			value = handleEmailChanges(value)
		}
		setLogin((prev) => ({
			...prev,
			[e.target.name]: value,
		}))
	}

	//runs synchronously before the repaint, eliminating the unintended blink.
	useLayoutEffect(() => {
		if (uemail.current) {
			uemail.current.setSelectionRange(
				login.email.length - 13,
				login.email.length - 13
			)
		}
	}, [login.email])

	return (
		<div className="login-initializer">
			<form className="form" onSubmit={handleSubmit}>
				<h2>Sign in</h2>
				<p>
					Don't have an account yet? <Link to="/register">Sign up.</Link>
				</p>
				<div className="form-control">
					<label htmlFor="email"> Email* </label>
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
					<label htmlFor="password"> Password* </label>
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
				<div className="form-action">
					{/* <button
						type="button"
						className="secondary-btn"
						onClick={() => navigate('/forgot-password')}
					>
						Forgot password?
					</button> */}
					<button type="submit" className="primary-btn" onClick={handleSubmit}>
						Login
					</button>
				</div>
			</form>
		</div>
	)
}
