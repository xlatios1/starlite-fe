import '@styles/signin.css'
import Registration from '@pages/Registration/Registration.tsx'
import SignIn from '@pages/SignIn/SignIn.tsx'
import VerificationPage from '@pages/Verification/VerificationPage.tsx'
import NotFound from '@pages/NotFound/NotFound.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './authentications/ProtectedRoute.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '@components/loading/Loading.tsx'
import FooterNavigation from '@components/navigations/footernavigation/footernavigation.tsx'

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
					<Route path="/verify" element={<VerificationPage />} />
					{renderProtectedPaths(['/home', '/upload', '/about'])}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
			<FooterNavigation />
			<div className="version-tag">Beta version: 3.3.0</div>
		</>
	)
}
