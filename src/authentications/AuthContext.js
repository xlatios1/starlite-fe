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
	const authWrapper = async (authFunction, email, password) => {
		try {
			await authFunction(auth, email, password).then((user) => {
				setData(user.user)
			})
			return true
		} catch (error) {
			return error
		}
	}

	const createUser = async (email, password) => {
		try {
			console.log('Create user CLICKED')
			return authWrapper(createUserWithEmailAndPassword, email, password)
		} catch (e) {
			return { message: 'Error: API request set user is unsuccessful' }
		}
	}

	const signIn = (email, password) => {
		console.log('Sign in CLICKED')
		return authWrapper(signInWithEmailAndPassword, email, password)
	}

	const fetchUserInCache = () => {
		return JSON.parse(localStorage.getItem('credentials'))
	}

	const logout = () => {
		console.log('Logout CLICKED')
		localStorage.removeItem('credentials')
		return signOut(auth)
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

	const getFirebaseData = async (user) => {
		console.log('getFirebaseData called!')
		return await getDoc(doc(db, 'StarliteUserData', user.uid))
			.then((data) => {
				if (data.exists()) {
					return data.data()
				} else {
					return null
				}
			})
			.catch(() => {
				throw new Error('Unable to retrieve firebase data.')
			})
	}

	const setFirebaseData = async (user, payload) => {
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
