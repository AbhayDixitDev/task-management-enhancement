import React, { useEffect } from 'react'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import AdminDashboard from './components/AdminDashboard'
import UserDashboard from './components/UserDashboard'
import CreateUser from './pages/adminPages/CreateUser'
import AssignTask from './pages/adminPages/AssignTask'
import ShowTasks from './pages/adminPages/ShowTasks'
import ShowUsers from './pages/adminPages/ShowUsers'
const App = () => {
  // const navigate = useNavigate()
 
  return (
  <>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admindashboard" element={<AdminDashboard />} >
        <Route index element={<ShowUsers/>}/>
        <Route path="createuser" element={<CreateUser/>}/>
        <Route path="showusers" element={<ShowUsers/>}/>
        <Route path="assigntask" element={<AssignTask/>}/>
        <Route path='showtasks' element={<ShowTasks/>}/>
        </Route>
        <Route path="/userdashboard" element={<UserDashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </>
  )
}

export default App