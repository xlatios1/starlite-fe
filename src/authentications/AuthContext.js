import { createContext, useContext, useEffect } from 'react'
import { auth, db } from '@root/firebase'

import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth'

import { doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore'

const UserContext = createContext()

export const AuthContextProvider = ({ children }) => {
	const authWrapper = async (
		type,
		authFunction,
		email = null,
		password = null
	) => {
		try {
			if (type === 'logout') {
				localStorage.removeItem('credentials')
				await authFunction(auth)
			} else {
				const response = await authFunction(auth, email, password)
				if (type === 'create') {
					setFirebaseData(response.user, {
						createdAt: new Date().toLocaleString('en-SG', {
							day: '2-digit',
							month: 'short',
							year: 'numeric',
						}),
					})
				}
			}
			return { status: 200, message: '' }
		} catch (error) {
			return { status: 500, message: error.message.split(':')[1] }
		}
	}

	const createUser = async (email, password) => {
		console.log('Create user CLICKED')
		return authWrapper(
			'create',
			createUserWithEmailAndPassword,
			email,
			password
		)
	}

	const signIn = (email, password) => {
		console.log('Sign in CLICKED')
		return authWrapper('login', signInWithEmailAndPassword, email, password)
	}

	const logout = () => {
		console.log('Logout CLICKED')
		return authWrapper('logout', signOut)
	}

	const fetchUserInCache = () => {
		return JSON.parse(localStorage.getItem('credentials'))
	}

	const getFileData = async (user, fields = null) => {
		console.log('getFileData called!')
		function dataURLtoBlob(dataURL) {
			const byteString = atob(dataURL.split(',')[1])
			const ab = new ArrayBuffer(byteString.length)
			const ia = new Uint8Array(ab)
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i)
			}
			return new Blob([ab], { type: 'application/pdf' })
		}
		const convertBase64ToFile = (dataField) => {
			if (dataField && dataField instanceof Object) {
				const blob = dataURLtoBlob(dataField.fileBase64)
				return {
					file: Object.assign(
						new File([blob], dataField.fileName, { type: 'application/pdf' }),
						{ preview: URL.createObjectURL(blob) }
					),
					courses: dataField.courses,
				}
			}
			return dataField
		}

		const data = await getDoc(doc(db, 'StarliteUserData', user.uid))
		if (data.exists()) {
			const documentData = data.data()
			// Return all fields in the documentData
			const result = {}
			Object.keys(documentData).forEach((fieldName) => {
				if (fields && fields.includes(fieldName)) {
					result[fieldName] = convertBase64ToFile(documentData[fieldName])
				} else if (!fields) {
					result[fieldName] = convertBase64ToFile(
						fieldName,
						documentData[fieldName]
					)
				}
			})
			return result
		}
		return null
	}

	const rmData = async (user, field) => {
		console.log('rmData called!')
		const updateData = {}
		updateData[field] = deleteField()
		await updateDoc(doc(db, 'StarliteUserData', user.uid), updateData)
	}

	const setData = async (user, file = null, coursesLeft = null) => {
		console.log('setData called!')
		async function convertFileToBase64(file) {
			return new Promise((resolve, reject) => {
				if (!file || file.length === 0) {
					resolve(null)
				}
				const reader = new FileReader()
				reader.onload = (event) => {
					resolve({
						fileName: file.name,
						fileBase64: event.target.result,
						courses: file.courses,
					})
				}
				reader.onerror = (event) => {
					console.log(new Error('Failed to convert file to base64'))
					reject(null)
				}
				reader.readAsDataURL(file.data)
			})
		}
		const updateData = {}
		if (user.displayName) {
			updateData.displayName = user.displayName
		}

		if (file) {
			const key = Object.keys(file)[0]
			updateData[key] = await convertFileToBase64(file[key])
		}

		if (coursesLeft) {
			updateData.coursesLeft = coursesLeft
		}
		await setDoc(doc(db, 'StarliteUserData', user.uid), updateData, {
			merge: true,
		})
	}

	const getFirebaseData = async (user, count = 3) => {
		console.log('getFirebaseData called!', count)
		if (user) {
			return new Promise((resolve) => {
				setTimeout(async () => {
					try {
						const data = await getDoc(doc(db, 'StarliteUserData', user.uid))
						if (data.exists()) {
							resolve({ status: 200, data: data.data(), message: 'Successful' })
						} else {
							if (count > 0) {
								resolve(await getFirebaseData(user, count - 1))
							} else {
								setFirebaseData(user, {
									createdAt: new Date().toLocaleString('en-SG', {
										day: '2-digit',
										month: 'short',
										year: 'numeric',
									}),
								})
								resolve({ status: 304, data: null, message: 'Successful' })
							}
						}
					} catch (error) {
						resolve({
							status: 500,
							data: null,
							message: 'Unable to retrieve firebase data.',
						})
					}
				}, 1000)
			})
		} else {
			return { status: 500, data: null, message: 'Invalid user found.' }
		}
	}

	const setFirebaseData = async (user, payload = {}) => {
		console.log('setFirebaseData called!')
		await setDoc(doc(db, 'StarliteUserData', user.uid), payload, {
			merge: true,
		})
	}

	useEffect(() => {
		const login = onAuthStateChanged(auth, (currentUser) => {
			if (
				currentUser &&
				new Date().getTime() < currentUser?.stsTokenManager?.expirationTime
			) {
				localStorage.setItem(
					'credentials',
					JSON.stringify(currentUser) //{ displayname: currentUser.providerData.0.displayName, uid: currentUser.uid, accessToken: currentUser.stsTokenManager.accessToken, expirationTime: currentUser.stsTokenManager.expirationTime }
				)
			} else {
				localStorage.removeItem('credentials')
			}
		})
		return () => {
			login()
		}
	}, [])

	return (
		<UserContext.Provider
			value={{
				fetchUserInCache,
				createUser,
				signIn,
				logout,
				setData,
				getFileData,
				rmData,
				getFirebaseData,
				setFirebaseData,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export const UserAuth = () => {
	return useContext(UserContext)
}
