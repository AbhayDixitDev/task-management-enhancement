import React, { useState , useEffect} from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import axios from 'axios'

const AssignTask = () => {
  const [users, setUsers] = useState([])
  const [show, setShow] = useState(false)
  const [selectedFile, setSelectedFile]= useState(null);
  const [task, setTask] = useState({
    subject: '',
    description: '',
    dueDate: '',
    userId: ''
  })

  const handleFileChange=(e)=>{
    setSelectedFile(e.target.files[0]);
}

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
    if (!selectedFile) {
      alert('Please upload a file')
      return
    }
    const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append('upload_preset', 's7oqfqa0');
        formData.append('cloud_name', 'abhaydixitdev');
        const response = await axios.post('https://api.cloudinary.com/v1_1/abhaydixitdev/image/upload', formData, {
          headers: {
              'Content-Type': 'multipart/form-data', // Set the content type
          },
      });
        console.log(response.data.url);
        const myimg=response.data.url;
    const res = await axios.post('http://localhost:8000/admin/assignTask', {
      ...task,
      file: myimg
    })
    console.log(res)
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
                <Button
                  variant="primary"
                  onClick={() => {
                    setShow(true)
                    setTask({ ...task, userId: user._id })
                  }}
                >
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
                onChange={(e) =>
                  setTask({ ...task, subject: e.target.value })
                }
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
                name="file"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={task.dueDate}
                onChange={(e) =>
                  setTask({ ...task, dueDate: e.target.value })
                }
              />
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