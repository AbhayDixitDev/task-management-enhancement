import React, { useEffect } from 'react'
import {BrowserRouter, Routes, Route, Outlet, useNavigate} from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import AdminDashboard from './components/AdminDashboard'
import UserDashboard from './components/UserDashboard'
import CreateUser from './pages/adminPages/CreateUser'
import AssignTask from './pages/adminPages/AssignTask'
import ShowTasks from './pages/adminPages/ShowTasks'
import ShowUsers from './pages/adminPages/ShowUsers'
import EditUser from './pages/adminPages/EditUser'
import ChangePassword from './pages/adminPages/ChangePassword'
import ResetPassword from './pages/adminPages/ResetPassword'
import ShowUserTasks from './pages/userPages/ShowUserTasks'
import ChangeUserPassword from './pages/userPages/ChangeUserPassword'
import ResetUserPassword from './pages/userPages/ResetUserPassword'
import TaskReports from './pages/adminPages/TaskReports'
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
          <Route path="edituser/:id" element={<EditUser/>}/>
          <Route path="changepassword" element={<ChangePassword/>}/>
          <Route path="resetpassword" element={<ResetPassword/>}/>
          <Route path="taskreports/:id" element={<TaskReports/>}/>

        </Route>
        <Route path="/userdashboard" element={<UserDashboard />} >
          <Route index element={<ShowUserTasks/>} />
          <Route path="showusertasks" element={<ShowUserTasks/>} />
          <Route path="changeuserpassword" element={<ChangeUserPassword/>}/>
          <Route path="resetuserpassword" element={<ResetUserPassword/>}/>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
  </>
  )
}

export default App