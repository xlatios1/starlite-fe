import React from 'react'
import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../authentications/AuthContext.js'
import Notification from '@components/notification/notification.tsx'
import apiRequest from '@components/apihandler/apiRequest'
import '@styles/navbar.css'

type Navbar = {
	user: string
	active: string
}

export default function Navbar({ user, active }: Navbar) {
	const [isMenuClick, setIsMenuClick] = useState(true)
	const { logout } = UserAuth()
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			const API_URL = `http://localhost:5000/handle_clean_up`
			const [response_status, response_data] = await apiRequest(API_URL)
			console.log(response_status, response_data)
			if (response_status === true && response_data) {
				await logout()
				navigate('/')
				Notification('success', 'Logout successful!', 3000)
			} else {
				Notification(
					'error',
					'Error! Unable to clear local data (Logout)',
					2000
				)
			}
		} catch (e) {
			Notification('error', 'An unexpected error has occured (Logout)', 3000)
			console.log(e.message)
		}
	}

	return (
		<nav className="nav">
			<div className="user-detail">Welcome, {user}! </div>
			<div className="nav-container">
				<ul
					id="navLinks"
					className={isMenuClick ? '#navLinks inactive' : '#navLinks active'}
				>
					<li>
						<Link className={active === '/home' ? 'active' : null} to="/home">
							Search
						</Link>
					</li>
					<li>
						<Link
							className={active === '/upload' ? 'active' : null}
							to="/upload"
						>
							Upload
						</Link>
					</li>
					<li>
						<Link className={active === '/about' ? 'active' : null} to="/about">
							About
						</Link>
					</li>
					<li>
						<Link onClick={handleLogout} to="/">
							Logout
						</Link>
					</li>
					<Outlet />
				</ul>
				<div className="navDropdown">
					<i
						id="bar"
						className={isMenuClick ? 'fas fa-bars' : 'fas fa-times'}
						onClick={() => {
							setIsMenuClick((prev) => !prev)
						}}
					></i>
				</div>
			</div>
		</nav>
	)
}
