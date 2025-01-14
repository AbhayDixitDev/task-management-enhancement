import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { FaUser, FaLock } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const [userType, setUserType] = useState('admin')
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`http://localhost:8000/${userType}/${userType}Login`, data)
      localStorage.setItem('userName', res.data.user.name)
      localStorage.setItem('userType', userType)
      window.location.href = `/${userType}dashboard`
    } catch (error) {
      console.log(error)
    }
  }

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value)
  }

  return (
    <Row className='justify-content-center'>
      <Col md={4}>
        <h2 className='text-center'>Login</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>User Type</Form.Label>
            <Form.Select value={userType} onChange={handleUserTypeChange}>
              <option value='admin'>Admin</option>
              <option value='user'>User</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' {...register('email')} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' {...register('password')} />
          </Form.Group>

          <Button variant='primary' type='submit'>
            <FaUser /> Login as {userType}
          </Button>
        </Form>
      </Col>
    </Row>
  )
}

export default Login