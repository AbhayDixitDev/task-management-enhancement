import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Button  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';


function AdminSidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <>
      <Button style={{backgroundColor:"transparent", border:"none", fontSize:"1.5rem"}} className="me-2" onClick={toggleShow}>
        <FaBars  style={{ color: 'black'}}/>
      </Button>
      <Offcanvas show={show} onHide={handleClose} scroll={true} backdrop={true} style={{ width: '200px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Sidebar</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul>
            <Nav>
              <Nav.Link as={Link} to="/admindashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admindashboard/createuser">Create User</Nav.Link>
              <Nav.Link as={Link} to="/admindashboard/showusers">Show Users</Nav.Link>
              <Nav.Link as={Link} to="/admindashboard/assigntask">Assign Task</Nav.Link>
              <Nav.Link as={Link} to="/admindashboard/showtasks">Show Tasks</Nav.Link>
              <Nav.Link as={Link} to="/admindashboard/changepassword">Change Password</Nav.Link>
              <Nav.Link as={Link} to="/admindashboard/resetpassword">Reset Password</Nav.Link>
            </Nav>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AdminSidebar;