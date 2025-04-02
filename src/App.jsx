import { useEffect, useState } from 'react'

import { 
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  RouterProvider,
  Outlet,

 } from 'react-router-dom'

import Home from './components/Home'
import TaskLayout from './TaskLayout'
import HomeLoading from './loadingpages/HomeLoading'
import Signup from './components/Authentication/Signup'
import Settings from './components/Settings'

import './scss/navigation.scss'
import Dashboard from './components/Dashboard'
import Board from './components/board/Board'
import BoardSelect from './components/board/BoardSelect'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import { useAuth } from './context/useAuth'
import Error from './error/Error'
import { PreferencesProvider } from './context/usePreferences'

const router = createBrowserRouter([
  {
    path:'/',
    element:<TaskLayout/>,
    errorElement:<Error/>,
    children:[
      {
        path:"/home",
        element:(
        <PublicRoute>
          <Home/>
        </PublicRoute>),
        errorElement:<Error/>
      },
      {
        path:"/signup",
        element:(
          <PublicRoute>
            <Signup/>

          </PublicRoute>
        ),
        errorElement:<Error/>
      },
      {
        path:'/settings',
        element:<Settings/>,
        errorElement:<Error/>
      },
      {
        path:`/dashboard`,
        element:(
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute>
        ),
        children: [
          {
            path: `:itemId`, 
            element: <BoardSelect />, 
            errorElement: <Error />
          }          
        ]
      },
      {
        path:'/board',
        element:(
          <PrivateRoute>
            <Board/>
          </PrivateRoute>
        ),
        errorElement:<Error/>
      },
      {
        path: '*',
        element: <Error />,
      },
    ],
    
  }
])
function App() {

  return(
    <PreferencesProvider>
      <RouterProvider router={router} />
    </PreferencesProvider>
  )
}

export default App
