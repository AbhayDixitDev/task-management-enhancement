import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const ShowUsers = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUsers = async () => {
      
      const res = await axios.get('http://localhost:8000/admin/showUsers')
      console.log(res);
      
      setUsers(res.data.users)
    }
    fetchUsers()
  }, [])

  const handleUserEdit = (id) => {
    navigate(`/admindashboard/edituser/${id}`)
  }

  const handleUserDelete = async(id) => {
    const res = await axios.delete(`http://localhost:8000/admin/deleteUser/${id}`)
    console.log(res);
    alert(res.data.message)
    const updatedUsers = users.filter((user) => user._id !== id)
    setUsers(updatedUsers)
  }

  return (
    <Table striped bordered hover style={{width:"80%", margin:"auto"}}>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Position</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user._id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.department}</td>
            <td>{user.position}</td>
            <td>
              <button className="btn btn-primary me-2" onClick={()=>{handleUserEdit(user._id)}}>Edit</button>
              <button className="btn btn-danger" onClick={()=>{handleUserDelete(user._id)}}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default ShowUsers