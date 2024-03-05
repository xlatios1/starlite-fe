import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from '@root/App'
import { store } from '@store/store.ts'
import { AuthContextProvider } from './authentications/AuthContext.js'
import '@styles/general.css'

const root = createRoot(document.getElementById('root'))
root.render(
	<StrictMode>
		<AuthContextProvider>
			<Provider store={store}>
				<App />
			</Provider>
		</AuthContextProvider>
	</StrictMode>
)
