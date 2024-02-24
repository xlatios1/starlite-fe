// https://www.freecodecamp.org/news/javascript-promise-tutorial-how-to-resolve-or-reject-promises-in-js/
// https://console.firebase.google.com/u/0/project/stars-pro-7d6f5/firestore/data/~2FStarliteUserData~2F5GNld3eynYUMCIu02Q7cGia5lsq1
import Notification from '@components/notification/notification.tsx'
import { ExtractTextFromFile } from '@components/dropzone/extractPDFText.tsx'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UserAuth } from '../../authentications/AuthContext.js'

interface FileWithPreview extends File {
	preview: string // Define the type for the preview property
}

export default function Dropzone({ identifier }) {
	const [files, setFiles] = useState<FileWithPreview | null>()
	const [pdfText, setPdfText] = useState(null)
	const { fetchUserInCache, setData, getFileData, rmData } = UserAuth()

	const curUser = fetchUserInCache()

	const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
		if (acceptedFiles?.length === 1) {
			const file = Object.assign(acceptedFiles[0], {
				preview: URL.createObjectURL(acceptedFiles[0]),
			})
			setFiles((prev) => file)
			ExtractTextFromFile(file)
				.then(async (result) => {
					setPdfText((prev) => result)
					const storingData = {
						[identifier]: {
							name: file.name,
							data: file,
							courses: result,
						},
					}
					await setData(curUser, storingData)
					Notification('success', `Upload ${identifier} successful!`, 1000)
				})
				.catch((e) => {
					Notification(
						'error',
						'An unexpected error has occured (Parsing pdf info)',
						1000
					)
					console.error('Error extracting text:', e)
				})
		} else if (acceptedFiles?.length > 1) {
			Notification('info', 'Please upload only a single file!', 1000)
		}
		if (rejectedFiles?.length) {
			Notification('info', 'Please upload PDF file only!', 1000)
		}
	}, [])

	const { getRootProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'application/pdf': [],
		},
		maxSize: 1024 * 1024,
	})

	useEffect(() => {
		getFileData(curUser, [identifier]).then(async (result) => {
			if (Object.keys(result).length !== 0) {
				setFiles((prev) => result[identifier].file)
				setPdfText((prev) => result[identifier].courses)
			}
		})
	}, [])

	const removeFile = async () => {
		setFiles((prev) => null)
		await rmData(curUser, identifier)
		Notification('success', `Removed ${identifier} successful!`, 1000)
	}

	const myComponentStyles = {
		padding: '3rem',
		width: '600px',
		display: 'flex',
		justifyContent: 'center',
	}

	return (
		<form>
			<p
				style={{
					display: 'flex',
					justifyContent: 'center',
					textDecoration: 'underline',
					fontWeight: 'bold',
					margin: '10px auto 10px',
				}}
			>
				{identifier}
			</p>
			{files ? (
				<ul
					style={{
						...myComponentStyles,
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<a href={files.preview} target="_blank">
						{files.name}
					</a>
					<button
						type="button"
						style={{ marginLeft: '2rem' }}
						onClick={() => removeFile()}
					>
						removefile
					</button>
				</ul>
			) : (
				<div
					{...getRootProps({
						style: { ...myComponentStyles, border: '1px solid #E5E7EB' },
					})}
				>
					{isDragActive ? (
						<p>Drop the files here...</p>
					) : (
						<p>
							Drag and drop your {identifier} file here, or click to select file
						</p>
					)}
				</div>
			)}
		</form>
	)
}
