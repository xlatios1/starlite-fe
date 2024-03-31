import React, { useLayoutEffect, useState, useRef, useEffect } from 'react'
import '@styles/signin.css'
import Notification from '@components/notification/notification.tsx'
import RenderAccountError from '@components/errorhandling/Errors.tsx'
import FocusTextBox from '@components/errorhandling/Focus.tsx'
import { UserAuth } from '@authentications/AuthContext.js'
import { handleEmailChanges } from '@components/formcontrol/emailhandler/handleEmailChanges.tsx'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { openLoading, closeLoading } from '@store/loading/loadingSlice.ts'

export default function Registration() {
	const registerName = useRef(null)
	const registerEmail = useRef(null)
	const registerPassword = useRef(null)
	const registerRetypePassword = useRef(null)
	const createBtnRef = useRef(null)
	const [registration, setRegistration] = useState({
		newName: '',
		newEmail: '@e.ntu.edu.sg',
		newPassword: '',
		retypePassword: '',
		attempt: false,
	})
	const [errorMessages, setErrorMessages] = useState([])
	const { createUser, fetchUserInCache } = UserAuth()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const defaultPosition = 257
	const [buttonPosition, setButtonPosition] = useState(defaultPosition)

	const curUser = fetchUserInCache()
	useEffect(() => {
		if (curUser?.expirationTime > new Date().getTime()) {
			console.log('Active user cache present, directing...', curUser)
			navigate('/home')
		}
	}, [curUser, navigate])

	const handleForm = () => {
		let errMsg = [...errorMessages]
		if (!registration.newName) {
			// name empty
			errMsg.push('registerName')
			if (!registration.attempt) FocusTextBox({ ref: registerName })
		} else {
			if (errMsg.includes('registerName')) {
				errMsg.splice(errMsg.indexOf('registerName'), 1)
			}
		}
		if (registration.newEmail.length < 14) {
			// Email empty
			errMsg.push('registerEmail')
			if (!registration.attempt) FocusTextBox({ ref: registerEmail })
		} else {
			if (errMsg.includes('registerEmail')) {
				errMsg.splice(errMsg.indexOf('registerEmail'), 1)
			}
		}
		if (!registration.newPassword) {
			errMsg.push('registerPassword')
			if (!registration.attempt) FocusTextBox({ ref: registerPassword })
		} else {
			if (errMsg.includes('registerPassword')) {
				errMsg.splice(errMsg.indexOf('registerPassword'), 1)
			}
		}
		if (registration.newPassword !== registration.retypePassword) {
			// Invalid password
			errMsg.push('differentPassword')
			if (!registration.attempt) FocusTextBox({ ref: registerRetypePassword })
		} else {
			if (errMsg.includes('differentPassword')) {
				errMsg.splice(errMsg.indexOf('differentPassword'), 1)
			}
		}
		errMsg = Array.from(new Set(errMsg))
		setErrorMessages(errMsg)
		return errMsg.length === 0
	}

	const handleCreateUser = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		if (handleForm()) {
			dispatch(openLoading())
			const isCreated = await createUser(registration)
			if (isCreated.status === 200) {
				Notification('success', 'Account creation successful!', 1000)
				navigate('/verify')
			} else {
				Notification('error', isCreated.message, 1000)
			}
			dispatch(closeLoading())
		}
		setRegistration((prev) => ({
			...prev,
			attempt: true,
		}))
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

	useEffect(() => {
		if (registration.attempt) {
			handleForm()
		}
	}, [registration])

	// Function to handle mouse move event
	useEffect(() => {
		let added = false
		const buttonRef = createBtnRef.current
		const btnEscape = (e) => {
			if (!buttonRef) return
			const btnRect = buttonRef.getBoundingClientRect()
			const btnWidth = btnRect.width
			const mouseX = e.clientX - btnRect.left
			const buffer = 3
			if (mouseX > btnWidth / 2) {
				// Player entered by the right
				if (buttonPosition - (btnWidth - mouseX) - buffer > 0) {
					// got space to move left
					setButtonPosition(buttonPosition - (btnWidth - mouseX) - buffer)
				} else {
					// No space already!! JUMP RIGHT
					setButtonPosition(buttonPosition + mouseX + buffer)
				}
			} else {
				// Player entered by the left
				if (buttonPosition + mouseX + buffer < defaultPosition) {
					// got space to move right
					setButtonPosition(buttonPosition + mouseX + buffer)
				} else {
					// No space already!! JUMP LEFT
					setButtonPosition(buttonPosition - (btnWidth - mouseX) - buffer)
				}
			}
		}
		if (!added && errorMessages.length > 0) {
			buttonRef.addEventListener('mousemove', btnEscape)
			added = true
		}
		if (added && errorMessages.length === 0) {
			buttonRef.removeEventListener('mousemove', btnEscape)
			added = false
		}
		return () => {
			if (added) buttonRef.removeEventListener('mousemove', btnEscape)
		}
	}, [buttonPosition, createBtnRef, errorMessages])

	return (
		<div className="login-initializer">
			<form className="form">
				<h2>Sign up</h2>
				<p>Please use your NTU Email!</p>
				<div className="form-control">
					<label htmlFor="Name"> Name*</label>
					<input
						type="text"
						name="newName"
						value={registration.newName}
						ref={registerName}
						onChange={handleChange}
					/>
				</div>
				{RenderAccountError({
					errorMessages: errorMessages,
					name: 'registerName',
				})}
				<div className="form-control">
					<label htmlFor="Email"> Email*</label>
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
					<label htmlFor="password"> Password* </label>
					<input
						type="password"
						name="newPassword"
						value={registration.newPassword}
						ref={registerPassword}
						onChange={handleChange}
						autoComplete="off"
					/>
				</div>
				{RenderAccountError({
					errorMessages: errorMessages,
					name: 'registerPassword',
				})}
				<div className="form-control">
					<label htmlFor="confirmPassword"> Confirm Password* </label>
					<input
						type="password"
						name="retypePassword"
						value={registration.retypePassword}
						ref={registerRetypePassword}
						onChange={handleChange}
						autoComplete="off"
					/>
				</div>
				{RenderAccountError({
					errorMessages: errorMessages,
					name: 'differentPassword',
				})}
				<div className="form-action" style={{ justifyContent: 'start' }}>
					<button
						type="button"
						className="secondary-btn"
						onClick={() => navigate('/')}
					>
						Back
					</button>
					<button
						id="create-btn"
						type="submit"
						className="primary-btn"
						onClick={handleCreateUser}
						ref={createBtnRef}
						style={{
							position: 'relative',
							left: buttonPosition,
							cursor: errorMessages.length !== 0 ? 'default' : 'pointer',
						}}
					>
						Create
					</button>
				</div>
			</form>
		</div>
	)
}
