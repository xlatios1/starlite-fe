import React, { useState } from 'react'
import {
	FormControl,
	TextField,
	Button,
	Box,
	Paper,
	Typography,
} from '@mui/material'
import Loading from '@components/loading/Loading.tsx'
import { useForm } from 'react-hook-form'
import { FormValues } from '@components/formcontrol/feedbackform.model.tsx'
import { formSetup } from './feedbackform.utils.tsx'
import Notification from '@components/notification/notification.tsx'
const _ = require('lodash')

const FeedbackForm = () => {
	const { register, handleSubmit, formState, reset } = useForm<FormValues>()
	const { errors } = formState
	const formInputs = formSetup(register)
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (data: FormValues) => {
		try {
			setIsLoading(true)
			setTimeout(() => {
				//Send feedback to somewhere
				const { name, title, feedback } = data
				console.log('Received!', name, title, feedback)
				Notification('success', 'Thank you for your valuable feedback!', 2000)
				setIsLoading(false)
				reset({ name: '', title: '', feedback: '' })
			}, 1000)
		} catch (error) {
			if (!error.message)
				error.message = 'Something went wrong. Please try again later.'
			Notification('error', 'Failed to send feedback!', 2000)
		}
	}

	return (
		<Box display="flex" justifyContent="center">
			{isLoading && <Loading />}
			<FormControl>
				<Paper
					sx={{
						display: 'flex',
						flexDirection: 'column',
						elevation: '2',
						width: '500px',
					}}
				>
					<Typography
						sx={{
							margin: '10px',
							display: 'flex',
							justifyContent: 'center',
							fontSize: '30px',
						}}
					>
						Feedback form!
					</Typography>
					<TextField
						{...formInputs.get('name')}
						error={!_.isEmpty(errors.name)}
						label="Name"
						required
						sx={{ margin: '10px' }}
						helperText={errors.name?.message}
					/>
					<TextField
						{...formInputs.get('title')}
						error={!_.isEmpty(errors.title)}
						label="Title"
						required
						sx={{ margin: '10px' }}
						helperText={errors.title?.message}
					/>
					<TextField
						{...formInputs.get('feedback')}
						error={!_.isEmpty(errors.feedback)}
						label="Feedback"
						multiline
						variant="outlined"
						required
						sx={{ margin: '10px' }}
						helperText={errors.feedback?.message}
					/>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}
					>
						<Button
							fullWidth={true}
							size="large"
							onClick={handleSubmit(onSubmit)}
							sx={{
								width: '130px',
								backgroundColor: '#31acbd',
								fontWeight: 'bold',
								color: 'white',
								textTransform: 'none',
								borderRadius: 2,
								margin: '10px',
								'&:hover': { backgroundColor: 'lightblue' },
							}}
						>
							Submit
						</Button>
					</Box>
				</Paper>
			</FormControl>
		</Box>
	)
}

export default FeedbackForm
