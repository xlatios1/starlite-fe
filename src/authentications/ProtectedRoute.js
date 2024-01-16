import { Route, useRoutes, useParams, Navigate } from 'react-router-dom'
import { UserAuth } from '../authentications/AuthContext.js'

import Navbar from '@components/navbar/navbar.tsx'
import HomePage from '@pages/Home'
import Upload from '@pages/Upload'

const ProtectedRoute = ({ path }) => {
	const { fetchUserInCache } = UserAuth()

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
		return <Navigate to="/" />
	}
	return (
		<>
			<Navbar user={curUser?.email} active={path} />
			{path === '/home' && <HomePage />}
			{path === '/upload' && <Upload />}
		</>
	)
}

export default ProtectedRoute
