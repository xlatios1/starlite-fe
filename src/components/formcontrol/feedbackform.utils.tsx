import {
	UseFormRegister,
	UseFormRegisterReturn,
	UseFormSetValue,
} from 'react-hook-form'
import { FormValues } from './feedbackform.model.tsx'

export const formSetup = (
	register: UseFormRegister<FormValues>,
	setValue: UseFormSetValue<FormValues>
) => {
	const formInputs = new Map<string, UseFormRegisterReturn<string>>()

	formInputs.set('name', {
		...register('name', {
			required: 'Name is required.',
			minLength: {
				value: 2,
				message: 'Minimum length is 2.',
			},
		}),
	})
	formInputs.set('title', {
		...register('title', {
			required: 'Title is required.',
			minLength: {
				value: 2,
				message: 'Minimum length is 2.',
			},
		}),
	})
	formInputs.set('feedback', {
		...register('feedback', {
			required: 'Feedback is required.',
			minLength: {
				value: 2,
				message: 'Feedback is required!',
			},
		}),
	})

	return formInputs
}
