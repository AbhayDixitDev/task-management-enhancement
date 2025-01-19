import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import { IoDocumentAttach } from "react-icons/io5";

const UserTaskReports = () => {
    const {id} = useParams()
    const [taskReports, setTaskReports] = useState([])
    const [show, setShow] = useState(false)
    const [feedback, setFeedback] = useState('')

    useEffect(() => {
        const fetchTaskReports = async () => {
            const res = await axios.get(`http://localhost:8000/admin/taskReports/${id}`)
            setTaskReports(res.data.taskReports)
        }
        fetchTaskReports()
    }, [id])

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.put(`http://localhost:8000/admin/showTaskReports/${id}`, { feedback })
            setFeedback('')
            setShow(false)
            alert(res.data.message)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{margin:"20px",padding:"20px"}}>
            <h1 style={{display:"inline",fontWeight:"400"}}>Task Subject: </h1><h1 style={{ color: "blue" ,fontWeight:"lighter",display:"inline"}}> {taskReports.length > 0 ? taskReports[0].subject : ''}</h1> <br />
            <h3 style={{display:"inline",fontWeight:"400"}}>Task Description:</h3> <h3 style={{ color: "blue" ,fontWeight:"lighter",display:"inline"}}> {taskReports.length > 0 ? taskReports[0].description : ''}</h3> <br />
            
            <h3 style={{display:"inline",fontWeight:"400",marginRight:"10px"}}>
                Task Assigned On: </h3><h3 style={{ color: "blue" ,fontWeight:"lighter",display:"inline"}}>
                {taskReports.length > 0 ? 
                    new Date(taskReports[0].createdAt).toLocaleDateString('en-GB') + ' ' + new Date(taskReports[0].createdAt).toLocaleTimeString('en-GB').slice(0,-3) 
                    : ''
                }  
            </h3>
            
            <h3 style={{display:"inline",fontWeight:"400",marginRight:"10px"}}>
             &nbsp;| Task Due Date: </h3><h3 style={{ color: "blue" ,fontWeight:"lighter",display:"inline"}}>
                {taskReports.length > 0 ? 
                    new Date(taskReports[0].dueDate).toLocaleDateString('en-GB') + ' ' + new Date(taskReports[0].dueDate).toLocaleTimeString('en-GB').slice(0,-3) 
                    : ''
                } 
            </h3>
            
            
            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Reported On</th>
                            <th>Description</th>
                            <th>Files</th>
                            <th>Status</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskReports.map(report => (
                            report.reports.map((r, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>
                                    {report.reports.length > 0 ? 
                        new Date(r.createdAt).toLocaleDateString('en-GB') + ' ' + new Date(r.createdAt).toLocaleTimeString('en-GB').slice(0,-3) 
                        : ''
                    }
                                    </td>
                                    <td style={{ maxWidth: "200px",fontSize:"1.2rem" }}>{r.description}</td>
                                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",fontSize:"1.2rem" }}>{r.reportFiles.map((file) => {
                                        return (
                                            <a href={file} target="_blank" rel="noopener noreferrer" onMouseOver={(e) => { e.target.style.color = "blue" }} onMouseOut={(e) => { e.target.style.color = "black" }}><IoDocumentAttach /></a>
                                        )
                                    })}</td>
                                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",fontSize:"1.2rem" }}>{r.status}</td>
                                    <td>
                                        {r.feedback ? (
                                           <h4> {r.feedback}</h4>
                                        ) : (
                                            <Button variant="primary" onClick={handleShow}>
                                            Submit Feedback
                                        </Button>
                                        )
                                        }
                                    </td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </Table>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Feedback</Form.Label>
                            <Form.Control as="textarea" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UserTaskReports