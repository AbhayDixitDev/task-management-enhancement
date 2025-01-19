import React, { useEffect,useState } from 'react'
import {BrowserRouter, Routes, Route, Outlet, Navigate,useNavigate} from 'react-router-dom'
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
import TaskReports from './pages/adminPages/TaskReports'
import ShowUserTasks from './pages/userPages/ShowUserTasks'

import ChangeUserPassword from './pages/userPages/ChangeUserPassword'
import ResetUserPassword from './pages/userPages/ResetUserPassword'
import UserTaskReports from './pages/userPages/UserTaskReports'

import NotFound from './pages/NotFound'
const App = () => {
  // const navigate = useNavigate()
  const [userType, setUserType] = useState(localStorage.getItem('userType'))

 
 
  return (
  <>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Login />} />

        <Route path="/login" element={userType ? <Navigate to='/'/> : <Login />} />
        
        <Route path="/admindashboard" element={userType === 'admin' ? <AdminDashboard />: <Navigate to='/'/>} >
          <Route index element={userType === 'admin' ? <ShowUsers/>: <Navigate to='/'/>}/>
          <Route path="createuser" element={userType === 'admin' ? <CreateUser/>: <Navigate to='/'/>}/>
          <Route path="showusers" element={userType === 'admin' ? <ShowUsers/>: <Navigate to='/'/>}/>
          <Route path="assigntask" element={userType === 'admin' ? <AssignTask/>: <Navigate to='/'/>}/>
          <Route path='showtasks' element={userType === 'admin' ? <ShowTasks/> : <Navigate to='/'/>}/>
          <Route path="edituser/:id" element={userType === 'admin' ? <EditUser/>: <Navigate to='/'/>}/>
          <Route path="changepassword" element={userType === 'admin' ?<ChangePassword/>: <Navigate to='/'/>}/>
          <Route path="resetpassword" element={userType === 'admin' ?<ResetPassword/>: <Navigate to='/'/>}/>
          <Route path="taskreports/:id" element={userType === 'admin' ?<TaskReports/>: <Navigate to='/'/>}/>
          
        </Route>
        <Route path="/userdashboard" element={userType === 'user' ?<UserDashboard />: <Navigate to='/'/>}>
          <Route index element={userType === 'user' ?<ShowUserTasks/>: <Navigate to='/'/>}/>
          <Route path="showusertasks" element={userType === 'user' ?<ShowUserTasks/>: <Navigate to='/'/>}/>
          <Route path="changeuserpassword" element={userType === 'user' ?<ChangeUserPassword/>: <Navigate to='/'/>}/>
          <Route path="resetuserpassword" element={userType === 'user' ?<ResetUserPassword/>: <Navigate to='/'/>}/>
          <Route path="usertaskreports/:id" element={userType === 'user' ?<UserTaskReports/>: <Navigate to='/'/>}/>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  </BrowserRouter>
  </>
  )
}

export default App