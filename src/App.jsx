import '@styles/signin.css'
import Registration from '@pages/Registration/Registration.jsx'
import SignIn from '@pages/SignIn/SignIn.jsx'
import NotFound from '@pages/NotFound/NotFound.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './authentications/ProtectedRoute.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '@components/loading/Loading.tsx'

export default function App() {
	const renderProtectedPaths = (paths) =>
		paths.map((path) => (
			<Route key={path} path={path} element={<ProtectedRoute path={path} />} />
		))

	return (
		<>
			<Loading />
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable
				pauseOnHover
				theme="light"
			/>
			<Router>
				<Routes>
					<Route path="/" element={<SignIn />} />
					<Route path="/register" element={<Registration />} />
					{renderProtectedPaths(['/home', '/upload', '/about'])}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
			<div className="version-tag">Beta version: 3.1.5</div>
		</>
	)
}
