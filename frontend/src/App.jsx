import React, { useEffect } from 'react'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import AdminDashboard from './components/AdminDashboard'
import UserDashboard from './components/UserDashboard'
const App = () => {
  // const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('userName')
    const isAdmin = localStorage.getItem('isAdmin')

    if(token && isAdmin){
      window.location.href = '/admindashboard'
    }
    else if(token && !isAdmin){
      window.location.href = '/userdashboard'
    }
  },[])
  return (
  <>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </>
  )
}

export default App