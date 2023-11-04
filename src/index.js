import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@root/App'
import Test from '@root/Test'
import '@styles/general.css'

const root = createRoot(document.getElementById('root'))
root.render(
	<StrictMode>
		<App />
	</StrictMode>
)
