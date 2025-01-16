import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateUser = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('IT')
  const [position, setPosition] = useState('Software Engineer')
  const [manager, setManager] = useState(localStorage.getItem('userName'))

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      name,
      email,
      password,
      department,
      position,
      manager: localStorage.getItem("userId")
    }
    try {
      const res = await axios.post('http://localhost:8000/admin/createUser', data)
      console.log(res);
      alert(res.data.message)
      
      if (res.data.message) {
        navigate('/admindashboard')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales']
  const positions = ['Software Engineer', 'Data Scientist', 'HR Manager', 'Financial Analyst', 'Marketing Manager', 'Sales Manager']

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '10px auto', padding: '10px', border:"1px solid #ccc", borderRadius:"5px" }}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Department</Form.Label>
        <Form.Select value={department} onChange={(e) => setDepartment(e.target.value)}>
          {departments.map((dept) => (
            <option value={dept}>{dept}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Position</Form.Label>
        <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
          {positions.map((pos) => (
            <option value={pos}>{pos}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Manager</Form.Label>
        <Form.Control type="text" disabled value={manager} onChange={(e) => setManager(e.target.value)} />
      </Form.Group>
      <Button type="submit">Create User</Button>
    </Form>
  )
}

export default CreateUser