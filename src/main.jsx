import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/useAuth.jsx'
import DashboardProvider from './context/useDashboardFunc.jsx'
import SearchProvider from './context/useSearch.jsx'

createRoot(document.getElementById('root')).render(
  <Fragment>
    <AuthProvider>
      <DashboardProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </DashboardProvider>
    </AuthProvider>
  </Fragment>,
)
