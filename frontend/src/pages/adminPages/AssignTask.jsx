import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';


const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [userid, setUserid] = useState('');
  const [show, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    dueDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://localhost:8000/admin/showUsers');
      setUsers(res.data.users.filter((user) => !user.isAdmin));
    };
    fetchUsers();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const data = new FormData();
    data.append('subject', formData.subject);
    data.append('description', formData.description);
    data.append('dueDate', formData.dueDate);
    data.append('userid', userid);

    // Append the file
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
          data.append('files', files[i]); // Append each file
      }
  }
  console.log(data.getAll('files')); 

    try {
      const response = await axios.post('http://localhost:8000/admin/assignTask', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      // Optionally reset the form or close the modal
      setShow(false);
      setFormData({ subject: '', description: '', dueDate: '' });
      setFiles(null);
    } catch (error) {
      console.error('Error uploading file and data:', error);
    }
  };

  return (
    <>
      <Table responsive striped bordered hover>
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
                    setShow(true);
                    setUserid(user._id);
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
            <Form.Group controlId="subject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="file">
              <Form.Label>Files</Form.Label>
              <Form.Control
                type="file"
                name="file"
                multiple
                onChange={handleFileChange}
              />
            </Form.Group>

            <Form.Group controlId="dueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Assign Task
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  );
};

export default AssignTask;