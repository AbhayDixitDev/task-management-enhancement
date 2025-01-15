import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from './adminComponents/AdminSidebar';
const Header = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState("")
   useEffect(() => {
      const userName = localStorage.getItem('userName')
      const userType = localStorage.getItem('userType')
      if(!userName || !userType){
        setIsLogin(false)
        navigate('/login')
      }
      else{
        setIsLogin(true)
        if(userType === 'admin'){
          setIsAdmin("admin")
        }
        else{
          setIsAdmin("user")
        }
      }
   })

   const logout = () => {
    localStorage.removeItem('userName')
    localStorage.removeItem('userType')
    setIsLogin(false)
    setIsAdmin("")
    navigate('/login')
   }
  return (
     <>
       <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
      {isAdmin==="admin" ? <AdminSidebar/> : isAdmin==="user" ? '<UserSidebar/>' : ''}
        <Navbar.Brand href="#home">Task Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isLogin ? <Nav.Link onClick={() => {logout()}}>Logout</Nav.Link>: <Nav.Link onClick={() => {logout()}}>Login</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
     
     
     </>
  )
}

export default Header