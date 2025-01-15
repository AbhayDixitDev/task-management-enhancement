import React, { useState } from 'react'
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
      manager:localStorage.getItem("userId")
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
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label>
        Department:
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          {departments.map((dept) => (
            <option value={dept}>{dept}</option>
          ))}
        </select>
      </label>
      <label>
        Position:
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
          {positions.map((pos) => (
            <option value={pos}>{pos}</option>
          ))}
        </select>
      </label>
      <label>
        Manager:
        <input type="text" disabled value={manager} onChange={(e) => setManager(e.target.value)} />
      </label>
      <button type="submit">Create User</button>
    </form>
  )
}

export default CreateUser