import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [userid, setUserid] = useState('');
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
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
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const data = new FormData();
    data.append('subject', formData.subject);
    data.append('description', formData.description);
    data.append('dueDate', formData.dueDate);
    data.append('userid', userid);

    // Append the file
    if (file) {
      data.append('file', file);
    }

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
      setFile(null);
    } catch (error) {
      console.error('Error uploading file and data:', error);
    }
  };

  return (
    <>
      <table>
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
                <button
                  onClick={() => {
                    setShow(true);
                    setUserid(user._id);
                  }}
                >
                  Assign Task
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <form onSubmit={handleSubmit}>
          <label>
            Subject:
            <input
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Files:
            <input name="file" type="file" onChange={handleFileChange} />
          </label>

          <label>
            Due Date:
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit">Assign Task</button>
        </form>
      )}
    </>
  );
};

export default AssignTask;