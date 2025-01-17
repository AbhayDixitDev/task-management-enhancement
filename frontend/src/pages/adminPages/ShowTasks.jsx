import { useState, useEffect } from 'react'
import { Table, Form, Button, Modal } from 'react-bootstrap'
import axios from 'axios'
import { IoDocumentAttach } from "react-icons/io5";



const ShowTasks = () => {
  const [tasks, setTasks] = useState([])
  const [updateStatus, setUpdateStatus] = useState('')
  const [showUpdateModal, setShowUpdateModal] = useState(false);


  const loadTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/showTasks')
      setTasks(res.data.tasks)
      // console.log(res.data);

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const DeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete the task?")) {
      if (window.confirm("Are you really sure? This action is irreversible.")) {
        try {
          const res = await axios.delete(`http://localhost:8000/admin/deleteTask/${id}`)
          alert(res.data.message)
          loadTasks()
        } catch (error) {
          console.log(error);

        }
      }
    }
  }

  const UpdateTaskStatus = async (id) => {
    if (updateStatus === '') {
      alert('Please select a status')
      return
    }
    try {
      const res = await axios.put(`http://localhost:8000/admin/updateTaskStatus/${id}`, { status: updateStatus })
      setUpdateStatus('')
      setShowUpdateModal(false)
      loadTasks()
      alert(res.data.message)

    } catch (error) {
      console.log(error);
      alert(error.response.data.message)

    }
  }




  const ans = tasks.map((task, index) => {
    return (
      <tr key={task._id}>
        <td>{index + 1}</td>
        <td width={"20%"}><b>Task:</b> {task.subject} <br /> <b>Description:</b> {task.description}</td>
        <td><b>Name:</b> {task.userId.name} <br /><b>Email:</b> {task.userId.email} <br /> <b>Department:</b> {task.userId.department} <br /> <b>Position:</b> {task.userId.position}</td>

        {/* <td>{}</td> */}
        <td>
          {new Date(task.dueDate).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
          <br />

          {

            (() => {

              const today = new Date();
              const dueDate = new Date(task.dueDate);
              const timeDifference = dueDate - today;
              const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
              if (daysDifference <= 0) {
                return <span style={{ color: "red" }}>Overdue</span>;
              } else if (daysDifference <= 3) {
                return <span style={{ color: "orange" }}>{daysDifference} days remaining</span>;
              } else {
                return <span style={{ color: "green" }}>{daysDifference} days remaining</span>;
              }
            })()
          }

        </td>
        <td style={{ color: "black", fontSize: "2rem", textDecoration: "none" }}> {task.file.map((file) => {
          return (
            <a href={file} target="_blank" rel="noopener noreferrer" onMouseOver={(e) => { e.target.style.color = "blue" }} onMouseOut={(e) => { e.target.style.color = "black" }}><IoDocumentAttach /></a>
          )
        })} </td>

        <td>{task.status}</td>
        <td >
          <Button className='btn btn-success' style={{ width: "70%", margin: "10px" }} onClick={() => setShowUpdateModal(true)}>Update Status</Button>
          <Button className='btn btn-danger' style={{ width: "70%", margin: "10px" }} onClick={() => DeleteTask(task._id)}>Delete Task</Button>

          <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update Task Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
                    <option value="">Select Status</option>
                    <option value="Complete">Complete</option>
                    <option value="InComplete">InComplete</option>
                    <option value="Pending">Pending</option>
                    <option value="Due">Due</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => UpdateTaskStatus(task._id)}>
                Update Status
              </Button>
            </Modal.Footer>
          </Modal>

        </td>
      </tr>
    )
  })



  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Subject & Description</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Attachments</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ans}
        </tbody>
      </Table>

    </div>
  )
}

export default ShowTasks