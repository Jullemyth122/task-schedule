import { useState } from 'react'

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

const router = createBrowserRouter([
  {
    path:'/',
    element:<TaskLayout/>,
    errorElement:<Error/>,
    children:[
      {
        path:"/home",
        element:<Home/>,
        // loader:<HomeLoading/>,
        errorElement:<Error/>
      },
      {
        path:"/signup",
        element:<Signup/>,
        errorElement:<Error/>

      },
      {
        path:'/settings',
        element:<Settings/>,
        errorElement:<Error/>
      },
      {
        path:`/dashboard`,
        element:<Dashboard/>,
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
        element:<Board/>,
        errorElement:<Error/>
      }
    ]
  }
])
function App() {
  return <RouterProvider router={router} />
}

export default App
