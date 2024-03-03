import { useLayoutEffect, useState, useRef, useEffect } from 'react'
import '@styles/signin.css'
import Notification from '@components/notification/notification.tsx'
import RenderAccountError from '@components/errorhandling/Errors.tsx'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import { UserAuth } from '@authentications/AuthContext.js'
import { handleEmailChanges } from '@root/components/emailhandler/handleEmailChanges.tsx'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'

export default function Registration() {
	const registerEmail = useRef(null)
	const registerPassword = useRef(null)
	const registerRetypePassword = useRef(null)
	const [registration, setRegistration] = useState({
		newEmail: '@e.ntu.edu.sg',
		newPassword: '',
		retypePassword: '',
	})
	const [errorMessages, setErrorMessages] = useState([])
	const { createUser, fetchUserInCache } = UserAuth()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const curUser = fetchUserInCache()
	useEffect(() => {
		if (
			curUser &&
			curUser?.stsTokenManager?.expirationTime > new Date().getTime()
		) {
			console.log('Active user cache present, directing...', curUser)
			navigate('/home')
		}
	}, [])

	const handleCreateUser = async (e) => {
		e.preventDefault()
		let errMsg = []
		if (registration.newEmail.length < 14) {
			// Email not found
			errMsg = [...errMsg, 'registerEmail']
			FocusTextBox({ ref: registerEmail })
		}
		if (!registration.newPassword) {
			errMsg = [...errMsg, 'registerPassword']
			FocusTextBox({ ref: registerRetypePassword })
		}
		if (registration.newPassword !== registration.retypePassword) {
			// Invalid password
			errMsg = [...errMsg, 'differentPassword']
			FocusTextBox({ ref: registerRetypePassword })
		}
		setErrorMessages(Array.from(new Set(errMsg)))
		if (errMsg.length === 0) {
			dispatch(openLoading())
			const isCreated = await createUser(
				registration.newEmail,
				registration.newPassword
			)
			if (isCreated === true) {
				Notification('success', 'Account creation successful!', 2000)
				navigate('/home')
			} else {
				Notification('error', isCreated.message.split(': ')[1], 3000)
			}
			dispatch(closeLoading())
		}
	}

	const handleChange = (e) => {
		let value = e.target.value
		if (e.target.name === 'newEmail') {
			value = handleEmailChanges(value)
		}
		setRegistration((prev) => ({
			...prev,
			[e.target.name]: value,
		}))
	}
	//runs synchronously before the repaint, eliminating the blink.
	useLayoutEffect(() => {
		registerEmail.current.setSelectionRange(
			registration.newEmail.length - 13,
			registration.newEmail.length - 13
		)
	}, [registration.newEmail])

	return (
		<div className="login-initializer">
			<form className="form">
				<h3>Sign up for a free account</h3>
				<p>
					Already have an account? <Link to="/">Sign in.</Link>
				</p>
				<div className="form-control">
					<label htmlFor="Email"> Email: </label>
					<input
						type="text"
						name="newEmail"
						value={registration.newEmail}
						ref={registerEmail}
						onChange={handleChange}
					/>
				</div>
				{RenderAccountError({
					errorMessages: errorMessages,
					name: 'registerEmail',
				})}
				<div className="form-control">
					<label htmlFor="password"> Password: </label>
					<input
						type="password"
						name="newPassword"
						value={registration.newPassword}
						ref={registerPassword}
						onChange={handleChange}
					/>
				</div>
				{RenderAccountError({
					errorMessages: errorMessages,
					name: 'registerPassword',
				})}
				<div className="form-control">
					<label htmlFor="confirmPassword"> Confirm Password: </label>
					<input
						type="password"
						name="retypePassword"
						value={registration.retypePassword}
						ref={registerRetypePassword}
						onChange={handleChange}
					/>
				</div>
				{RenderAccountError({
					errorMessages: errorMessages,
					name: 'differentPassword',
				})}
				<div>
					<button className="btn" onClick={handleCreateUser}>
						Create
					</button>
				</div>
			</form>
		</div>
	)
}
