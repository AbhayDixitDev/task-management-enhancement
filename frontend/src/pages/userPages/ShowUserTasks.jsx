import { useState, useEffect } from 'react'
import { Table, Form, Button, Modal } from 'react-bootstrap'
import axios from 'axios'
import { IoDocumentAttach } from "react-icons/io5";


const ShowUserTasks = () => {
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState(localStorage.getItem('userId'))
  const [showReportModal, setShowReportModal] = useState(false)
  const [report, setReport] = useState({ description: '', files: [], taskId: '', status: '' })
  const [files, setFiles] = useState([]);

  const loadTasks = async () => {
    console.log(userId);
    
    try {
      const res = await axios.post('http://localhost:8000/user/showUserTasks',{userId:`${userId}`})
      setTasks(res.data.tasks)
      console.log(res.data);

    } catch (error) {
      console.log(error);

    }
  }

  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFiles(e.target.files);
  };

  useEffect(() => {
    loadTasks()
    console.log(report);
    
  }, [report])

  const handleShow = () => setShowReportModal(true);
  const handleClose = () => setShowReportModal(false);

  const handleReportTask = async (e) => {
    e.preventDefault()
    const data = new FormData();
    data.append('description', report.description);
    data.append('taskid', report.taskId);
    data.append('status', report.status);

    // Append the file
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
          data.append('files', files[i]); // Append each file
      }
  }
  console.log(data.getAll('files')); 
    try {
      const res = await axios.post(`http://localhost:8000/user/submitTaskReport`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      handleClose()
      loadTasks()
    } catch (error) {
      console.log(error);
    }
  }

  const ans = tasks.map((task, index) => {
    return (
      <tr key={task._id}>
        <td>{index + 1}</td>
        <td width={"20%"}>{task.subject} </td>
        <td> {task.description} </td>

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
          <Button className='btn btn-success' style={{ width: "70%", margin: "10px" }} onClick={() => { setReport({ taskId: task._id, description: '', files: [],status:task.status }); handleShow() }}>Submit Task Report</Button>

       
        </td>
      </tr>
    )
  })



  return (
    <div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Subject </th>
            <th>Description</th>
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

      <Modal show={showReportModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Task Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReportTask}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Description" value={report.description} onChange={(e) => setReport({ ...report, description: e.target.value })} />
            </Form.Group>
           
            <Form.Group controlId="status">
              <Form.Label>Task Current Status</Form.Label>
                  <Form.Select value={report.status} onChange={(e) => setReport({ ...report, status: e.target.value })}>
                    <option value="">Select Status</option>
                    <option value="Complete">Complete</option>
                    <option value="InComplete">InComplete</option>
                    <option value="Pending">Pending</option>
                    <option value="Due">Due</option>
                  </Form.Select>
                </Form.Group>
            <Form.Group controlId="files">
              <Form.Label>Files</Form.Label>
              <Form.Control multiple type="file" name='file' onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default ShowUserTasks