import React from 'react'
import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '@authentications/AuthContext.js'
import Notification from '@components/notification/notification.tsx'
import './navbar.css'

type NavBar = {
	user: string
	active: string
}

export default function NavBar({ user, active }: NavBar) {
	const [isMenuClick, setIsMenuClick] = useState(true)
	const { logout } = UserAuth()
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			await logout()
			navigate('/')
			Notification('success', 'Logout successful!', 1000)
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
							Home
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
