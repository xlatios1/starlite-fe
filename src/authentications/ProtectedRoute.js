import { Navigate } from 'react-router-dom'
import { UserAuth } from '@authentications/AuthContext.js'
import Notification from '@components/notification/notification.tsx'
import NavBar from '@components/navigations/navbar/navbar.tsx'
import HomePage from '@pages/Home/Home.tsx'
import Upload from '@pages/Upload/Upload.jsx'
import About from '@pages/About/About.tsx'

const ProtectedRoute = ({ path }) => {
	const { fetchUserInCache, logout } = UserAuth()

	const curUser = fetchUserInCache()
	console.log(
		'Path: ',
		path,
		'Cache: ',
		curUser,
		'Account auth expiring: ',
		new Date(curUser?.expirationTime)
	)
	if (!curUser || new Date().getTime() >= curUser?.expirationTime) {
		if (curUser) {
			logout()
			Notification('info', 'Authentication expired, please login again!', 3000)
		}
		return <Navigate to="/" />
	}

	return (
		<>
			<NavBar user={curUser.displayname || '5.0!'} active={path} />
			{path === '/home' && <HomePage />}
			{path === '/upload' && <Upload />}
			{path === '/about' && <About />}
		</>
	)
}

export default ProtectedRoute
