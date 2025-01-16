import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import axios from 'axios'

const AssignTask = () => {
  const [users, setUsers] = useState([])
  const [show, setShow] = useState(false)
  const [task, setTask] = useState({
    subject: '',
    description: '',
    files: [],
    dueDate: ''
  })

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://localhost:8000/admin/showUsers')
      setUsers(res.data.users.filter((user) => !user.isAdmin))
    }
    fetchUsers()
  }, [])

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post(
      'http://localhost:8000/admin/assignTask',
      { ...task, userId: e.target.elements.userId.value }
    )
    alert(res.data.message)
    handleClose()
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="primary" onClick={handleShow}>
                  Assign Task
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                value={task.subject}
                onChange={(e) => setTask({ ...task, subject: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Files</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) =>
                  setTask({
                    ...task,
                    files: Array.from(e.target.files)
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign to</Form.Label>
              <Form.Select
                name="userId"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Assign Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AssignTask