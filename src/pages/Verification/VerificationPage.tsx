import React, { useEffect } from 'react'
import { Box, Button, Paper, SxProps, Theme, Typography } from '@mui/material'
import Notification from '@components/notification/notification.tsx'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '@authentications/AuthContext.js'

const formProps: SxProps<Theme> = {
	width: '400px',
	borderRadius: 3,
	paddingX: 3,
	paddingY: 2,
	border: 5,
	borderLeft: 0,
	borderRight: 0,
	borderBottom: 0,
	borderColor: 'primary.main',
}

const contentProps: SxProps<Theme> = {
	marginY: 2,
}

const VerificationPage = () => {
	const { fetchUserInCache, sendVerificationEmail, fetchTempUserInCache } =
		UserAuth()
	const navigate = useNavigate()
	const curUser = fetchUserInCache()
	const email = fetchTempUserInCache()?.email

	const sendEmail = async () => {
		const response = await sendVerificationEmail()
		if (response.status === 200) {
			Notification('success', 'Email sent successfully.')
		}
		if (response.status === 304) {
			Notification(
				'info',
				'Account has been successfully verified. Please proceed to login!',
				3000
			)
		} else {
			Notification('error', 'Please try again later.')
		}
	}

	useEffect(() => {
		if (curUser?.expirationTime > new Date().getTime()) {
			console.log('Active user cache present, directing...', curUser)
			navigate('/home')
		}
		if (!email) {
			navigate('/')
		}
	}, [])

	return (
		<Box className="login-initializer">
			<Paper elevation={1} sx={formProps}>
				<Typography variant="h5" sx={contentProps}>
					<strong>Almost done!</strong>
				</Typography>
				<Typography sx={contentProps}>
					A verification email has been sent to <br />
					<strong>{email}</strong>
				</Typography>
				<Typography>
					Please check your email and click the link to activate your Starlite
					account.
				</Typography>

				<Button
					variant="contained"
					sx={{ ...contentProps, width: '100%' }}
					onClick={sendEmail}
				>
					RESEND EMAIL
				</Button>
				<Button
					variant="outlined"
					sx={{ width: '100%' }}
					onClick={() => {
						navigate('/')
					}}
				>
					BACK
				</Button>
			</Paper>
		</Box>
	)
}

export default VerificationPage
