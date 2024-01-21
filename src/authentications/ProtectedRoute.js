import { Route, useRoutes, useParams, Navigate } from 'react-router-dom'
import { UserAuth } from '../authentications/AuthContext.js'

import Notification from '@components/notification/notification.tsx'
import NavBar from '@components/navbar/navbar.tsx'
import HomePage from '@pages/Home'
import Upload from '@pages/Upload'

const ProtectedRoute = ({ path }) => {
	const { fetchUserInCache, logout } = UserAuth()

	const curUser = fetchUserInCache()
	console.log(
		'Path: ',
		path,
		'Cache: ',
		curUser,
		'Account auth expiring: ',
		new Date(curUser?.stsTokenManager?.expirationTime)
	)
	if (
		!curUser ||
		new Date().getTime() >= curUser?.stsTokenManager?.expirationTime
	) {
		if (curUser) {
			logout()
			Notification('info', 'Authentication expired, please login again!', 3000)
		}
		return <Navigate to="/" />
	}
	return (
		<>
			<NavBar user={curUser?.email} active={path} />
			{path === '/home' && <HomePage />}
			{path === '/upload' && <Upload />}
		</>
	)
}

export default ProtectedRoute
