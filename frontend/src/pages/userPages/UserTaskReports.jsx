import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { IoDocumentAttach } from "react-icons/io5";

const UserTaskReports = () => {
  const { id } = useParams();
  const [taskReports, setTaskReports] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [reportId, setReportId] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchTaskReports = async () => {
      const res = await axios.get(`http://localhost:8000/user/taskReports/${id}`);
      setTaskReports(res.data.taskReports);
    };
    fetchTaskReports();
  }, [id]);

  const handleFeedbackShow = () => setShowFeedback(true);
  const handleFeedbackClose = () => setShowFeedback(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/admin/feedback/${reportId}`, { feedback });
      setFeedback('');
      setShowFeedback(false);
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px' }}>
      <h1>
        Task Subject: <span style={{ color: 'blue', fontWeight: 'lighter' }}>{taskReports.length > 0 ? taskReports[0].subject : ''}</span>
      </h1>
      <br />
      <h3>
        Task Description: <span style={{ color: 'blue', fontWeight: 'lighter' }}>{taskReports.length > 0 ? taskReports[0].description : ''}</span>
      </h3>
      <br />

      <h3 style={{display: 'inline'}}>
        Task Assigned On: <span style={{ color: 'blue', fontWeight: 'lighter' }}>
          {taskReports.length > 0 ?
            new Date(taskReports[0].createdAt).toLocaleDateString('en-GB') + ' ' + new Date(taskReports[0].createdAt).toLocaleTimeString('en-GB').slice(0, -3)
            : ''
          }
        </span>
      </h3>
      <h3 style={{display: 'inline'}}>
        &nbsp;&nbsp;| Task Due Date: <span style={{ color: 'blue', fontWeight: 'lighter' }}>
          {taskReports.length > 0 ?
            new Date(taskReports[0].dueDate).toLocaleDateString('en-GB') + ' ' + new Date(taskReports[0].dueDate).toLocaleTimeString('en-GB').slice(0, -3)
            : ''
          }
        </span>
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
                  <td>{index + 1}</td>
                  <td>
                    {report.reports.length > 0 ?
                      new Date(r.createdAt).toLocaleDateString('en-GB') + ' ' + new Date(r.createdAt).toLocaleTimeString('en-GB').slice(0, -3)
                      : ''
                    }
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '1.2rem' }}>{r.description}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', fontSize: '1.2rem' }}>
                    {r.reportFiles.map((file) => (
                      <a key={file} href={file} style={{maxWidth: '200px',minWidth: '200px'}} target="_blank" rel="noopener noreferrer" onMouseOver={(e) => { e.target.style.color = "blue" }} onMouseOut={(e) => { e.target.style.color = "black" }}><IoDocumentAttach /></a>
                    ))}
                  </td>
                  <td style={{ maxWidth: '350px',minWidth: '350px', fontSize: '1.1rem' }}>
                    <span style={{ color: 'blue', fontWeight: 'lighter' }}>{r.status}</span>   at the time of Report <br /> Current Status: <span style={{ color: 'blue', fontWeight: 'lighter' }}>{taskReports[0].status}</span>
                  </td>
                  <td>
                    {r.feedback }
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </Table>
      </div>

      
    </div>
  );
};

export default UserTaskReports;