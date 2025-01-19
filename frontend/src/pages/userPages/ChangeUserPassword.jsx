import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { FaLock } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ChangeUserPassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm new password do not match')
      return
    }
    try {
      const userId = localStorage.getItem('userId')
      const res = await axios.put('http://localhost:8000/user/changePassword/'+userId, {
        oldPassword,
        newPassword
      })
      // console.log(res)
      alert(res.data.message)
      navigate('/userdashboard')
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  return (
    <Form onSubmit={handleSubmit} style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", height:"50vh",boxShadow:"0 0 10px black",borderRadius:"10px",width:"30%",maxWidth:"500px",margin:"20px auto "  }}>
    
        <Form.Group className="mb-3">
          <Form.Label>Old Password</Form.Label>
          <Form.Control type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          <FaLock />
          {' '}Change Password
        </Button>

    </Form>
  )
}

export default ChangeUserPassword