import '@styles/signin.css'
import '@styles/loading.css'
import Registration from '@pages/Registration'
import SignIn from '@pages/SignIn'
import NotFound from '@pages/NotFound'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContextProvider } from './authentications/AuthContext.js'
import ProtectedRoute from './authentications/ProtectedRoute.js'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export default function App() {
	const renderProtectedPaths = (paths) =>
		paths.map((path) => (
			<Route key={path} path={path} element={<ProtectedRoute path={path} />} />
		))

	return (
		<AuthContextProvider>
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
				{/* <div className="app">
				<article className="bg"> */}
				<Routes>
					<Route path="/" element={<SignIn />} />
					<Route path="/register" element={<Registration />} />
					{renderProtectedPaths(['/home', '/upload', '/about'])}
					<Route path="*" element={<NotFound />} />
				</Routes>
				{/* </article>
			</div> */}
			</Router>
			<div className="version-tag">Beta version: 2.12.1</div>
		</AuthContextProvider>
	)
}
