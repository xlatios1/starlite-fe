// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCWYI4FI9uZk0Fe2K9AgUbk1QLy6XZOLMs',
	authDomain: 'stars-pro-7d6f5.firebaseapp.com',
	projectId: 'stars-pro-7d6f5',
	storageBucket: 'stars-pro-7d6f5.appspot.com',
	messagingSenderId: '759575699812',
	appId: '1:759575699812:web:c241b72c7646f44694da71',
	measurementId: 'G-FHKZZER23T',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
