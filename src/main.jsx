import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/useAuth.jsx'
import DashboardProvider from './context/useDashboardFunc.jsx'

createRoot(document.getElementById('root')).render(
  <Fragment>
    <AuthProvider>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </AuthProvider>
  </Fragment>,
)
