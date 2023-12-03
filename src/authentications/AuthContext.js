import { createContext, useContext, useEffect } from 'react'
import { auth, db } from '@root/firebase'
import apiRequest from '@components/apihandler/apiRequest'

import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth'

import { doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore'

const UserContext = createContext()

export const AuthContextProvider = ({ children }) => {
	const authWrapper = async (authFunction, email, password) => {
		try {
			const idToken = await authFunction(auth, email, password).then((user) => {
				console.log('USER', user)
				setData(user.user)
				return user._tokenResponse.idToken
			})
			const [response_status, response_data] = await apiRequest(
				'http://localhost:5000/login',
				{
					access_token: idToken,
					username: email.split('@')[0],
					password: password,
				}
			)
			if (!response_status || !response_data) {
				return {
					message: 'Error: Unknown error, unsuccessful on login, do re-login.',
				}
			} else {
				return true
			}
		} catch (error) {
			return error
		}
	}

	const createUser = async (email, password) => {
		try {
			console.log('Create user CLICKED')
			const [response_status, response_data] = await apiRequest(
				'http://localhost:5000/validate',
				{
					username: email.split('@')[0],
					password: password,
				}
			)
			if (response_status && response_data) {
				return authWrapper(createUserWithEmailAndPassword, email, password)
			} else {
				return { message: 'Error: NTU Account is invalid' }
			}
		} catch (e) {
			return { message: 'Error: API request set user is unsuccessful' }
		}
	}

	const signIn = (email, password) => {
		console.log('Sign in CLICKED')
		return authWrapper(signInWithEmailAndPassword, email, password)
	}

	const logout = () => {
		console.log('Logout CLICKED')
		localStorage.removeItem('credentials')
		return signOut(auth)
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

	const getData = async (user, fields = null) => {
		console.log('getData called!')
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

	useEffect(() => {
		const login = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				localStorage.setItem(
					'credentials',
					JSON.stringify(currentUser) //{ displayname: currentUser.providerData.0.displayName, uid: currentUser.uid, accessToken: currentUser.stsTokenManager.accessToken }
				)
			} else {
				localStorage.removeItem('credentials')
			}
		})
		return () => {
			login()
		}
	}, [])

	const fetchUserInCache = () => {
		return JSON.parse(localStorage.getItem('credentials'))
	}

	return (
		<UserContext.Provider
			value={{
				fetchUserInCache,
				createUser,
				signIn,
				logout,
				setData,
				getData,
				rmData,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export const UserAuth = () => {
	return useContext(UserContext)
}
