import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FaUser, FaLock } from 'react-icons/fa'
import axios from 'axios'

const EditUser = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        position: '',
    })
    const { id } = useParams()
    const navigate = useNavigate()
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.put(`http://localhost:8000/admin/edituser/${id}`, user)
            const data = res.data
            if (data.message) {
                alert(data.message)
                navigate('/admindashboard')
            } 
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/admin/fetchUser/${id}`)
                const data = res.data.user
                setUser({
                    name: data.name,
                    email: data.email,
                    department: data.department,
                    position: data.position,
                    manager: data.manager
                })
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [id])
    return (
        <Form onSubmit={handleEdit}>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" name="name" value={user.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name="email" value={user.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Control type="text" placeholder="Enter department" name="department" value={user.department} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPosition">
                <Form.Label>Position</Form.Label>
                <Form.Control type="text" placeholder="Enter position" name="position" value={user.position} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
                <FaUser /> Edit User
            </Button>
        </Form>
    )
}

export default EditUser